// src/components/payments/StripeCheckoutForm.tsx
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export interface CheckoutItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface Props {
  cartItems: CheckoutItem[];
  total: number;
  shippingForm: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
    shippingPhone: string;
  };
  onSuccess: (orderId: number) => void;
}

export default function StripeCheckoutForm({
  cartItems,
  total,
  shippingForm,
  onSuccess,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    // 🚀 1) Crear PaymentIntent
    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          userId: shippingForm.userId,
          cartItems: cartItems.map((i) => ({
            productId: i.product_id,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress: shippingForm.shippingAddress,
          shippingCity: shippingForm.shippingCity,
          shippingState: shippingForm.shippingState,
          shippingZipCode: shippingForm.shippingZipCode,
          shippingPhone: shippingForm.shippingPhone,
        }),
      }
    );

    // 🚨 Lee el body SOLO UNA vez
    const data = await resp.json();
    console.log("respuesta del servidor:", resp.status, data);

    if (!resp.ok) {
      alert(data.error || "Error al crear el pago");
      setLoading(false);
      return;
    }

    const { clientSecret, orderId } = data;

    // 🚀 2) Confirmar con Stripe.js
    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            name: `${shippingForm.firstName} ${shippingForm.lastName}`,
            email: shippingForm.email,
          },
        },
      }
    );

    if (error) {
      alert(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(orderId);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <CardElement
        options={{ style: { base: { fontSize: "16px", color: "#444" } } }}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={!stripe || loading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded"
      >
        {loading ? "Procesando..." : "Pagar con Tarjeta"}
      </button>
    </div>
  );
}
