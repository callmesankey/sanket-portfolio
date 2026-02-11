import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { createSession, clearSession } from '@/lib/auth/session';

// POST /api/admin/login - Login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find admin user by email
    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      console.log('Login failed: Admin not found for email:', normalizedEmail);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Admin found:', admin.email, 'Password hashed:', admin.password.startsWith('$2'));

    // Check if password hash exists (first-time login scenario)
    if (!admin.password.startsWith('$2')) {
      // Default password for first-time setup
      const defaultPassword = 'admin123';
      
      if (password === defaultPassword) {
        console.log('First login detected, hashing password');
        // Hash and update password
        const hashedPassword = await hashPassword(password);
        
        await db.admin.update({
          where: { id: admin.id },
          data: { password: hashedPassword },
        });

        // Create session
        const sessionToken = await createSession(admin.id);
        console.log('Session created after first login, token:', sessionToken?.substring(0, 30) + '...');

        return NextResponse.json({
          success: true,
          message: 'Login successful',
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          },
        });
      } else {
        console.log('First login failed: invalid default password');
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Verify password with bcrypt
    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      console.log('Login failed: Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Clear any existing session before creating new one
    await clearSession();

    // Create new session
    const sessionToken = await createSession(admin.id);
    console.log('Session created after login, token:', sessionToken.substring(0, 30) + '...');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
