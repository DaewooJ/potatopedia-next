'use client';
import { useEffect, useRef, useState } from 'react';

const PAYPAL_CLIENT_ID = 'ATUjAycwPmYZJh4-DMFzKXDyLcWC8FFPGJMI2P62JzXjV7frWkn69lOtsIaFNVsBqcHhKZWg3vtuzaUa';
const PRESETS = [5, 10, 25, 50];

let paypalSdkPromise = null;
function loadPaypalSdk() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.paypal) return Promise.resolve(window.paypal);
  if (!paypalSdkPromise) {
    paypalSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&disable-funding=venmo,card,paylater`;
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return paypalSdkPromise;
}

export default function PayPalButton() {
  const containerRef = useRef(null);
  const amountRef = useRef(10);
  const [amount, setAmountState] = useState(10);
  const [status, setStatus] = useState('idle');

  const setAmount = (val) => {
    amountRef.current = val;
    setAmountState(val);
  };

  useEffect(() => {
    let cancelled = false;
    loadPaypalSdk().then((paypal) => {
      if (cancelled || !paypal || !containerRef.current) return;
      paypal.Buttons({
        style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'paypal', height: 40 },
        createOrder: (_, actions) => actions.order.create({
          purchase_units: [{ amount: { value: String(amountRef.current || 1), currency_code: 'USD' } }],
        }),
        onApprove: async (_, actions) => {
          await actions.order.capture();
          if (!cancelled) setStatus('success');
        },
        onError: (err) => { console.error('[PayPalButton] SDK error:', err); if (!cancelled) setStatus('error'); },
      }).render(containerRef.current);
    });
    return () => { cancelled = true; };
  }, []);

  if (status === 'success') {
    return <div style={{ fontSize: 14, color: '#2E7D32', fontWeight: 600 }}>Thank you for your support!</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="pp-amount-row" style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className="pp-amount-chip"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: amount === p ? '1.5px solid #C62828' : '1px solid #ddd',
              background: amount === p ? 'rgba(198,40,40,0.06)' : '#fff',
              color: amount === p ? '#C62828' : '#444',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ${p}
          </button>
        ))}
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="pp-amount-input"
          style={{ width: 64, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13 }}
        />
      </div>
      <div ref={containerRef} style={{ maxWidth: 220 }} />
      {status === 'error' && (
        <div style={{ fontSize: 12, color: '#C62828', marginTop: 6 }}>Something went wrong — please try again.</div>
      )}
      <style>{`
        @media (max-width: 480px) {
          .pp-amount-row { gap: 4px !important; }
          .pp-amount-chip { padding: 5px 8px !important; font-size: 11.5px !important; }
          .pp-amount-input { width: 42px !important; padding: 5px 5px !important; font-size: 11.5px !important; }
        }
      `}</style>
    </div>
  );
}
