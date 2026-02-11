import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';

// POST /api/debug/reset-password - Reset admin password to default
export async function POST(request: NextRequest) {
  try {
    // Hash "admin123" with bcrypt
    const defaultPasswordHash = await hashPassword('admin123');

    // Update the first admin user's password
    const admin = await db.admin.findFirst();

    if (!admin) {
      return NextResponse.json(
        { error: 'No admin user found in database' },
        { status: 404 }
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { password: defaultPasswordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset to default (admin123)',
      details: {
        oldHash: admin.password.substring(0, 50) + '...',
        newHash: defaultPasswordHash.substring(0, 50) + '...',
      },
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
