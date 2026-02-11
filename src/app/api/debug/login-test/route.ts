import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

// GET /api/debug/login-test - Test authentication without login form
export async function GET(request: NextRequest) {
  try {
    // Check if admin user exists
    const adminEmail = 'admin@sanket.com';
    const admin = await db.admin.findUnique({
      where: { email: adminEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    const testResults = {
      adminExists: !!admin,
      adminData: admin ? {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        passwordHash: admin.password.substring(0, 50),
        passwordLength: admin.password.length,
        isHashed: admin.password.startsWith('$2'),
        passwordStartsWith: admin.password.substring(0, 10),
      } : null,
    };

    // Test password verification
    const testPassword = 'admin123';
    let passwordTest = {
      password: testPassword,
      dbPasswordHash: admin?.password || '',
      verificationResult: null,
      error: null,
    };

    if (admin) {
      passwordTest.verificationResult = await verifyPassword(testPassword, admin.password);
      passwordTest.dbPasswordHash = admin.password.substring(0, 50);
    } else {
      passwordTest.error = 'No admin found in database';
    }

    // Test hash creation
    const testHash = await hashPassword(testPassword);
    
    return NextResponse.json({
      success: true,
      message: 'Authentication test results',
      ...testResults,
      passwordTest,
      testHash: testHash.substring(0, 50),
    });
  } catch (error) {
    console.error('Error in login test:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
