import paypal from '@paypal/checkout-server-sdk';

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (mode === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

export function paypalClient() {
  return new paypal.core.PayPalHttpClient(environment());
}

export async function createOrder(amount: number, currency: string = 'USD') {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
  });

  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

export async function captureOrder(orderId: string) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

export async function getOrderDetails(orderId: string) {
  const request = new paypal.orders.OrdersGetRequest(orderId);
  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}