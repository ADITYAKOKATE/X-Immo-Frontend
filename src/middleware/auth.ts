import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyAccessToken } from '@/lib/auth';

export interface AuthRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

export function authMiddleware(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    
    if (!payload) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    (req as AuthRequest).user = payload;
    return handler(req as AuthRequest);
  };
}

