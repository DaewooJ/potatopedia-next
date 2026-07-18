'use client';
import { useEffect, useRef } from 'react';

const PAYPAL_CLIENT_ID = 'BAAFoYylUtkqg6A_u3nsoX3LsGS3ouBfqxvdmoQjsFRWbZjE-iBP9HomBJP1rN6Vj0oDvwSZ2r0LNswQTY';

let paypalSdkPromise = null;
function loadPaypalSdk() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.paypal) return Promise.resolve(window.paypal);
  if (!paypalSdkPromise) {
    paypalSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`;
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return paypalSdkPromise;
}

export default function PayPalButton({ hostedButtonId = 'UUJY8ZWUUTAQ6' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadPaypalSdk().then((paypal) => {
      if (cancelled || !paypal || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      paypal.HostedButtons({ hostedButtonId }).render(containerRef.current);
    });
    return () => { cancelled = true; };
  }, [hostedButtonId]);

  return <div ref={containerRef} />;
}
