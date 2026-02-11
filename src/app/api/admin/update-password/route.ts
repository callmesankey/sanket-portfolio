import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { verifySession } from '@/lib/auth/session';

// POST /api/admin/update-password - Update admin password (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Verify current admin is authenticated
    const currentAdmin = await verifySession();

    if (!currentAdmin) {
      console.log('Update password failed: No authenticated admin');
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    console.log('Updating password for admin:', currentAdmin.email);

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get current admin with password
    const admin = await db.admin.findUnique({
      where: { id: currentAdmin.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!admin) {
      console.log('Update password failed: Admin not found in DB');
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if password is hashed
    let isCurrentPasswordValid = false;

    if (!admin.password.includes('$2') && !admin.password.includes('$2b')) {
      // Default password scenario
      const defaultPassword = 'admin123';
      isCurrentPasswordValid = (currentPassword === defaultPassword);
    } else {
      // Verify current password with bcrypt
      isCurrentPasswordValid = await verifyPassword(currentPassword, admin.password);
    }

    if (!isCurrentPasswordValid) {
      console.log('Update password failed: Current password is incorrect');
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword },
    });

    console.log('Password updated successfully for admin:', currentAdmin.email);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
