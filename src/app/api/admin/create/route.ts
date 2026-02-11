import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { verifySession } from '@/lib/auth/session';

// POST /api/admin/create - Create new admin user (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Verify current admin is authenticated
    const currentAdmin = await verifySession();

    if (!currentAdmin) {
      console.log('Create admin failed: No authenticated admin');
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    console.log('Creating new admin by:', currentAdmin.email);

    const body = await request.json();
    const { email, name, password } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      console.log('Create admin failed: Email already exists:', normalizedEmail);
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new admin
    const newAdmin = await db.admin.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log('New admin created:', newAdmin.email, 'ID:', newAdmin.id);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: newAdmin,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// GET /api/admin/create - Get all admins (requires authentication)
export async function GET(request: NextRequest) {
  try {
    // Verify current admin is authenticated
    const currentAdmin = await verifySession();

    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const admins = await db.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
