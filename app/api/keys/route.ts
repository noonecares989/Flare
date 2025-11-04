import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiKeyManager } from '@/lib/encryption/apiKeys';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, apiKey, modelPreferences } = await request.json();

    const keyId = await apiKeyManager.storeApiKey(
      session.user.id,
      provider,
      apiKey,
      modelPreferences
    );

    return NextResponse.json({ success: true, keyId });
  } catch (error) {
    console.error('Error storing API key:', error);
    return NextResponse.json(
      { error: 'Failed to store API key' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        provider: true,
        isActive: true,
        usageCount: true,
        lastUsed: true,
        modelPreferences: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}