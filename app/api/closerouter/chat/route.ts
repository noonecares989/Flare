import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { closerouterService } from '@/lib/ai/closerouter';

// Closerouter chat completion
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      model,
      messages,
      temperature = 0.7,
      maxTokens = 2000,
      stream = false,
    } = await request.json();

    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: 'Model and messages array are required',
        },
        { status: 400 }
      );
    }

    // Check if Closerouter client is configured
    if (!closerouterService.hasClient(session.user.id)) {
      return NextResponse.json(
        {
          error: 'Closerouter not configured',
          details: 'Please configure your Closerouter API key first',
        },
        { status: 400 }
      );
    }

    const requestPayload = {
      model,
      messages,
      temperature,
      maxTokens,
      stream,
    };

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of closerouterService.streamChatCompletion(
              session.user.id,
              requestPayload
            )) {
              const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            // Send final message
            const finalData = `data: ${JSON.stringify({ done: true })}\n\n`;
            controller.enqueue(encoder.encode(finalData));
            controller.close();
          } catch (error) {
            console.error('Closerouter streaming error:', error);
            const errorData = `data: ${JSON.stringify({
              error: error.message,
              done: true
            })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Handle non-streaming response
      const response = await closerouterService.chatCompletion(
        session.user.id,
        requestPayload
      );

      return NextResponse.json({
        success: true,
        response,
        usage: {
          model: response.model,
          promptTokens: response.usage.promptTokens,
          completionTokens: response.usage.completionTokens,
          totalTokens: response.usage.totalTokens,
          cost: response.cost,
        },
      });
    }
  } catch (error) {
    console.error('Closerouter chat error:', error);
    return NextResponse.json(
      {
        error: 'Chat completion failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Get available Closerouter models
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const models = await closerouterService.getAvailableModels(
      closerouterService.hasClient(session.user.id) ? session.user.id : undefined
    );

    return NextResponse.json({
      models,
      hasClient: closerouterService.hasClient(session.user.id),
    });
  } catch (error) {
    console.error('Closerouter models error:', error);
    return NextResponse.json(
      { error: 'Failed to get Closerouter models' },
      { status: 500 }
    );
  }
}