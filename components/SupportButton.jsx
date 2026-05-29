'use client';
import { useEffect, useRef } from 'react';

export default function SupportButton({ buttonId = 'pl_SvAVGLB6msHiQV' }) {
  const formRef = useRef(null);
  useEffect(() => {
    const form = formRef.current;
    if (!form || form.querySelector('script')) return;
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    s.async = true;
    s.dataset.payment_button_id = buttonId;
    form.appendChild(s);
  }, [buttonId]);
  return <form ref={formRef} />;
}
