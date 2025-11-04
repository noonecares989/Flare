import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { closerouterService } from '@/lib/ai/closerouter';

// Initialize Closerouter client with user's API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey, config = {} } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Initialize Closerouter client for the user
    await closerouterService.initializeClient(session.user.id, {
      apiKey,
      ...config,
    });

    // Test the connection by getting available models
    const models = await closerouterService.getAvailableModels(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Closerouter client initialized successfully',
      models,
      config: {
        initialized: true,
        provider: 'closerouter',
        modelCount: models.length,
      },
    });
  } catch (error) {
    console.error('Closerouter config error:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize Closerouter',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Get Closerouter status and available models
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasClient = closerouterService.hasClient(session.user.id);
    const models = await closerouterService.getAvailableModels(
      hasClient ? session.user.id : undefined
    );
    const usageStats = closerouterService.getUsageStats(session.user.id);

    return NextResponse.json({
      status: {
        configured: hasClient,
        provider: 'closerouter',
      },
      models,
      usage: usageStats,
    });
  } catch (error) {
    console.error('Closerouter status error:', error);
    return NextResponse.json(
      { error: 'Failed to get Closerouter status' },
      { status: 500 }
    );
  }
}

// Remove Closerouter client configuration
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    closerouterService.removeClient(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Closerouter client removed successfully',
    });
  } catch (error) {
    console.error('Closerouter delete error:', error);
    return NextResponse.json(
      { error: 'Failed to remove Closerouter client' },
      { status: 500 }
    );
  }
}