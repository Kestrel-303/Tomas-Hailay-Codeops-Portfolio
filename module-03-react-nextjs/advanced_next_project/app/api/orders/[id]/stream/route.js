import { errorResponse } from '@/lib/api-errors';
import { FINAL_STATUSES, getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { toTrackedOrder } from '@/lib/tracking';

// GET /api/orders/:id/stream: one order's status and courier position as Server-Sent Events.
// It stays open for the length of a delivery, so it is never cached or prerendered, and it
// runs on the Node runtime.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TICK_MS = 2000;
const HEARTBEAT_MS = 15000;

// The SSE wire format. Each message is lines of "field: value", and "data: " followed by TWO
// newlines ends it: the first ends the data line, the second (an empty line) tells the browser
// the message is complete and fires the event. With only one, nothing is ever delivered.
const sse = ({ id, event, data }) => `id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

// How many streams this server has open right now. Logged on open and close, so the "navigate
// away five times" check can be read off the server log too, not only from the browser.
const open = globalThis.__aeOpenStreams ?? (globalThis.__aeOpenStreams = new Set());

export async function GET(request, { params }) {
  const { id } = await params;

  // Checked before any stream exists. A 401/404 JSON response (not a 200 stream) is also what
  // makes EventSource stop instead of reconnecting forever.
  const session = await getSession();
  if (!session) return errorResponse(401, 'UNAUTHORIZED', 'Please sign in to follow an order.');
  const order = getOrderById(id);
  if (!order || order.ownerId !== session.id) {
    return errorResponse(404, 'NOT_FOUND', `No order with id "${id}".`);
  }

  const encoder = new TextEncoder();
  const timers = [];
  const handle = Symbol(id);

  const stream = new ReadableStream({
    start(controller) {
      let eventId = Number(request.headers.get('last-event-id')) || 0;
      let lastStatus = null;
      let closed = false;
      const write = (text) => controller.enqueue(encoder.encode(text));

      const close = (why) => {
        if (closed) return;
        closed = true;
        timers.forEach(clearInterval);
        open.delete(handle);
        console.log(`[stream] ${id} closed (${why}); open streams: ${open.size}`);
        try {
          controller.close();
        } catch {
          // Already closed from the browser's side.
        }
      };

      const tick = () => {
        const current = getOrderById(id);
        if (!current) return close('order gone');
        eventId += 1;
        // "status" when the stage changes; "position" while the courier moves in between.
        write(sse({ id: eventId, event: current.status === lastStatus ? 'position' : 'status', data: toTrackedOrder(current) }));
        lastStatus = current.status;

        // Delivered or cancelled: nothing will change again. Say so, then close on purpose.
        if (FINAL_STATUSES.includes(current.status)) {
          write(sse({ id: eventId + 1, event: 'done', data: { status: current.status } }));
          close(current.status);
        }
      };

      open.add(handle);
      console.log(`[stream] ${id} opened; open streams: ${open.size}`);
      write('retry: 3000\n\n'); // reconnect after 3 s if the connection drops
      tick();
      if (closed) return;
      timers.push(setInterval(tick, TICK_MS));
      // A comment line (it starts with ":") so proxies don't time out a quiet connection.
      timers.push(setInterval(() => write(': keep-alive\n\n'), HEARTBEAT_MS));
      // The tab closed, navigated away, or called EventSource.close().
      request.signal.addEventListener('abort', () => close('browser left'));
    },
    cancel() {
      timers.forEach(clearInterval);
      open.delete(handle);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
