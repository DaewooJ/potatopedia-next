import SupportButton from './SupportButton';

export default function SupportBlock() {
  return (
    <div style={{
      background: 'rgba(198,40,40,0.03)',
      border: '1px solid rgba(198,40,40,0.12)',
      borderLeft: '4px solid #C62828',
      borderRadius: 12,
      padding: '24px 28px',
      margin: '40px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: 1 }}>
        Support
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, margin: '6px 0 8px' }}>
        Found this useful? Help keep Potatopedia running.
      </h3>
      <p style={{ fontSize: 14, color: '#555', margin: '0 0 16px', maxWidth: 560 }}>
        Potatopedia is independent and free. Your support covers hosting and the
        data work behind every page.
      </p>
      <SupportButton />
    </div>
  );
}
