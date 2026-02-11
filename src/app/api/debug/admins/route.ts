import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

// GET /api/debug/admins - List all admin users
export async function GET(request: NextRequest) {
  try {
    const admins = await db.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        passwordLength: true,
        isHashed: true,
        createdAt: true,
      },
    });

    const adminDetails = admins.map(admin => {
      const isHashed = admin.password.includes('$2');
      const isDefaultHash = admin.password.includes('$2a$12b$'); // bcrypt for 'admin123'
      
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        passwordHash: admin.password.substring(0, 30) + '...',
        passwordLength: admin.password.length,
        isHashed,
        isDefaultHash,
        note: isHashed 
          ? 'Password is bcrypt hashed' 
          : `Default password (unhashed): "${admin.password}"`,
      };
    });

    return NextResponse.json({
      success: true,
      count: admins.length,
      admins: adminDetails,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/debug/verify-password - Verify password against hash
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, hash } = body;

    const isValid = await verifyPassword(password, hash);
    
    return NextResponse.json({
      success: true,
      password,
      hash,
      isValid,
      passwordLength: password.length,
      hashLength: hash.length,
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Verification failed', details: error.message },
      { status: 500 }
    );
  }
}
