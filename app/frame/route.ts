import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest } from 'next/server';

const FUNDBASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json();

  const { message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (!message?.isValid) {
    return new Response('Invalid message', { status: 400 });
  }

  // Handle frame interactions
  const { buttonIndex } = body.untrustedData;

  if (buttonIndex === 1) {
    // Launch FundBase
    return getFrameHtmlResponse({
      buttons: [
        {
          label: 'Launch FundBase',
          action: 'post_redirect',
        },
      ],
      image: `${FUNDBASE_URL}/api/og`,
      postUrl: `${FUNDBASE_URL}/api/frame`,
    });
  }

  return getFrameHtmlResponse({
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
    image: `${FUNDBASE_URL}/api/og`,
    postUrl: `${FUNDBASE_URL}/api/frame`,
  });
}

export async function GET() {
  return getFrameHtmlResponse({
    buttons: [
      {
        label: 'Launch FundBase',
        action: 'post_redirect',
      },
    ],
    image: `${FUNDBASE_URL}/api/og`,
    postUrl: `${FUNDBASE_URL}/api/frame`,
  });
} 