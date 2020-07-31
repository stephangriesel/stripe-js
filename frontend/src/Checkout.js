import React, { useState } from 'react';
import { fetchFromAPI } from './helpers';
import { useStripe } from '@stripe/react-stripe-js';

export function Checkout() {
    const stripe = useStripe();

    const [product, setProduct] = useState({
        name: 'Shirt',
        description: 'My nice t-shirt.',
        images: [
            'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        ],
        amount: 200,
        currency: 'usd',
        quantity: 0,
    });

    const changeQuantity = (v) =>
        setProduct({ ...product, quantity: Math.max(0, product.quantity + v) });

    const handleClick = async (event) => {
        const body = { line_items: [product] }
        const { id: sessionId } = await fetchFromAPI('checkouts', {
            body
        });

        const { error } = await stripe.redirectToCheckout({
            sessionId,
        });

        if (error) {
            console.log(error);
        }
    };

    return (
        <>

            <div>
                <h3>{product.name}</h3>
                <h4>Amount: {product.amount}</h4>

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
                Checkout
      </button>
        </>
    );
}

export function CheckoutSuccess() {
    const url = window.location.href;
    const sessionId = new URL(url).searchParams.get('session_id');
    return <h3>Success! {sessionId}</h3>
}

export function CheckoutFail() {
    return <h3>Failed!</h3>
}
