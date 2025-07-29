import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#0052FF',
              marginRight: '20px',
            }}
          >
            💡
          </div>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            FundBase
          </div>
        </div>
        
        <div
          style={{
            fontSize: '24px',
            color: '#888888',
            textAlign: 'center',
            maxWidth: '600px',
            marginBottom: '40px',
          }}
        >
          Post wild startup ideas and get instant ETH backing from the community
        </div>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#0052FF',
          }}
        >
          🚀 Built on Base with MiniKit
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
} 