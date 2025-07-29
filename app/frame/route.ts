import { NextRequest } from 'next/server';

const FUNDBASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';

// Helper function to create frame HTML response
function createFrameHtmlResponse({
  title = 'FundBase',
  image,
  buttons = [],
  postUrl,
}: {
  title?: string;
  image: string;
  buttons?: Array<{ label: string; action: string }>;
  postUrl?: string;
}) {
  const buttonsHtml = buttons
    .map(
      (button, index) => `
        <meta property="fc:frame:button:${index + 1}" content="${button.label}" />
        <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />
      `
    )
    .join('');

  const postUrlMeta = postUrl ? `<meta property="fc:frame:post_url" content="${postUrl}" />` : '';

  return new Response(
    `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${image}" />
  ${buttonsHtml}
  ${postUrlMeta}
  <meta property="og:title" content="${title}" />
  <meta property="og:image" content="${image}" />
</head>
<body>
  <h1>${title}</h1>
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle frame interactions
    const { buttonIndex } = body.untrustedData || {};

    if (buttonIndex === 1) {
      // Launch FundBase
      return createFrameHtmlResponse({
        image: `${FUNDBASE_URL}/api/og`,
        postUrl: `${FUNDBASE_URL}/api/frame`,
        buttons: [
          {
            label: 'Launch FundBase',
            action: 'post_redirect',
          },
        ],
      });
    }

    return createFrameHtmlResponse({
      image: `${FUNDBASE_URL}/api/og`,
      postUrl: `${FUNDBASE_URL}/api/frame`,
      buttons: [
        {
          label: 'Post Idea',
          action: 'post_redirect',
        },
        {
          label: 'View Trending',
          action: 'post_redirect',
        },
      ],
    });
  } catch (error) {
    console.error('Frame POST error:', error);
    return new Response('Invalid request', { status: 400 });
  }
}

export async function GET() {
  return createFrameHtmlResponse({
    image: `${FUNDBASE_URL}/api/og`,
    postUrl: `${FUNDBASE_URL}/api/frame`,
    buttons: [
      {
        label: 'Launch FundBase',
        action: 'post_redirect',
      },
    ],
  });
} 