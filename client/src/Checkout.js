import React, { useState } from 'react'
import { useStripe } from '@stripe/react-stripe-js'
import { fetchFromAPI } from './helpers';

export function Checkout() {
  const stripe = useStripe();

  const [product, setProduct] = useState({
    name: "Jordan 1 Bred",
    description: "Air Jordan 1 in black/red colorway",
    images: [
      'https://images.unsplash.com/photo-1559252676-c735ac416188?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    ],
    amount: "599",
    currency: "usd",
    quantity: 0,
  });

  const changeQuantity = (v) => 
    setProduct({ ...product, quantity: Math.max(0, product.quantity + v)});

  const handleClick = async (event) => {
    const body = { line_items: [] }
    const { id: sessionId } = await fetchFromAPI("checkouts", {
      body
    })

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })

    if (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.amount}</h4>

        <img src={product.images[0]} width="250px" alt="product" />

        <button
          onClick={() => changeQuantity(-1)}>
          -
        </button>
        <span>
          {product.quantity}
        </span>
        <button
          onClick={() => changeQuantity(1)}>
          +
        </button>
      </div>

      <hr />

      <button
        onClick={handleClick}
        disabled={product.quantity < 1}>
        Start Checkout
      </button>
    </>
  )
}

export function CheckoutSuccess() {
  const url = window.location.href;
  const sessionId = new URL(url).searchParams.get('session_id');
  return <h3>Checkout was a Success! {sessionId}</h3>
}

export function CheckoutFail() {
  return <h3>Checkout failed!</h3>
}
