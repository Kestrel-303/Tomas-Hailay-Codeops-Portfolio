import 'server-only';

// The only module that reads secrets. 'server-only' makes importing it from a client
// component a build error, and neither variable has a NEXT_PUBLIC_ prefix, so Next
// never inlines them into browser JavaScript.
function required(name) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(
      `${name} is missing or shorter than 32 characters. Locally: .env.local (see .env.example). On Vercel: Settings → Environment Variables, a separate value for Production and for Preview.`,
    );
  }
  return value;
}

export const getSessionSecret = () => required('SESSION_SECRET');
export const getPaymentWebhookSecret = () => required('PAYMENT_WEBHOOK_SECRET');
