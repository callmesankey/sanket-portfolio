import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';

// POST /api/admin/logout - Logout endpoint
export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    await clearSession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}
