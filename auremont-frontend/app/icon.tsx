import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4AF37',
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: 6,
          border: '1px solid rgba(212, 175, 55, 0.4)'
        }}
      >
        RN
      </div>
    ),
    { ...size }
  );
}
