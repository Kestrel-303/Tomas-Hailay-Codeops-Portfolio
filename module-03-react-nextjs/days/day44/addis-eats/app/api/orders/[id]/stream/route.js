import { errorResponse } from "../../../../../lib/api-errors";
import { FINAL_STATUSES, getOrderById } from "../../../../../lib/orders";
import { getSession } from "../../../../../lib/session";
import { toTrackedOrder } from "../../../../../lib/tracking";

// A live feed of one order's status and courier position, as Server-Sent Events. Never cached,
// never prerendered, and on the Node runtime so the stream can stay open.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TICK_MS = 2000;
const HEARTBEAT_MS = 15000;

// SSE framing: each message is "field: value" lines ended by one blank line. `id` lets a
// reconnecting browser send Last-Event-ID; `event` picks the listener; `data` is one JSON line.
function frame({ id, event, data }) {
  return `id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request, { params }) {
  const { id } = await params;

  // The same checks as GET /api/orders/[id], before any stream is opened. A 401 or 404 (not a
  // 200 stream) tells EventSource to give up instead of retrying forever.
  const session = await getSession();
  if (!session) {
    return errorResponse(401, "UNAUTHORIZED", "Please sign in to follow an order.");
  }
  const first = getOrderById(id);
  if (!first || first.ownerId !== session.id) {
    return errorResponse(404, "NOT_FOUND", `No order with id "${id}".`);
  }

  const encoder = new TextEncoder();
  let timer;
  let heartbeat;

  const stream = new ReadableStream({
    start(controller) {
      let eventId = Number(request.headers.get("last-event-id")) || 0;
      let lastStatus = null;
      let closed = false;

      const stop = () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // Already closed by the browser going away.
        }
      };

      const send = () => {
        const order = getOrderById(id);
        if (!order) return stop();
        const snapshot = toTrackedOrder(order);
        eventId += 1;
        // "status" when the stage changes, "position" for the courier moving in between.
        const event = order.status !== lastStatus ? "status" : "position";
        lastStatus = order.status;
        controller.enqueue(encoder.encode(frame({ id: eventId, event, data: snapshot })));

        // Delivered or cancelled: nothing will change again. Say so with a final "done" event and
        // close the stream on purpose, so the browser closes its side instead of reconnecting.
        if (FINAL_STATUSES.includes(order.status)) {
          controller.enqueue(encoder.encode(frame({ id: eventId + 1, event: "done", data: { status: order.status } })));
          stop();
        }
      };

      // Tell the browser how long to wait before reconnecting if the connection drops.
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      send();
      if (closed) return;
      timer = setInterval(send, TICK_MS);
      // A comment line (starts with ":") every 15s keeps proxies from timing out a quiet stream.
      heartbeat = setInterval(() => controller.enqueue(encoder.encode(": heartbeat\n\n")), HEARTBEAT_MS);

      // The tab closed or navigated away: stop the timers so nothing keeps running for nobody.
      request.signal.addEventListener("abort", stop);
    },
    cancel() {
      clearInterval(timer);
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Stops nginx-style proxies from buffering the stream into one late response.
      "X-Accel-Buffering": "no",
    },
  });
}
