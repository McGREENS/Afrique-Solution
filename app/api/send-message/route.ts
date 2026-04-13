import { NextRequest, NextResponse } from 'next/server';
import { messageRouter } from '@/lib/messaging/router';

export async function POST(request: NextRequest) {
  try {
    const { to, message, channel } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    const result = await messageRouter.send({
      to,
      message,
      channel
    });

    return NextResponse.json({
      success: result.success,
      channel: result.channel,
      messageId: result.messageId,
      error: result.error,
      availableChannels: messageRouter.getAvailableChannels()
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}