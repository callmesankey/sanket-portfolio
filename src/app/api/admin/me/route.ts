import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';

// GET /api/admin/me - Get current admin user
export async function GET(request: NextRequest) {
  try {
    const admin = await verifySession();
    
    console.log('GET /api/admin/me - Admin verification result:', admin ? `${admin.email} (ID: ${admin.id})` : 'No valid session');

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error('Error in /api/admin/me:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}
