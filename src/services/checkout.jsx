const BASE_URL = import.meta.env.VITE_API_URL || '';

const checkoutPayment = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Checkout request failed');
  }

  return response.json();
};

export default { checkoutPayment };
