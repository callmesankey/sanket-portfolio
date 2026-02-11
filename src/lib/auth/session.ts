import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_DAYS = 7;

/**
 * Set admin session cookie
 */
export async function createSession(adminId: string): Promise<string> {
  const cookieStore = await cookies();
  
  // Create a simple, reliable session token
  const timestamp = Date.now();
  const token = `${adminId}-${timestamp}`;
  
  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  // Set cookie
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60, // 7 days in seconds
  });

  return token;
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return sessionCookie.value;
}

/**
 * Clear the admin session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Verify session and get admin user
 */
export async function verifySession(): Promise<{id: string; email: string; name: string} | null> {
  const sessionToken = await getSession();

  if (!sessionToken) {
    console.log('verifySession: No session token found');
    return null;
  }

  // Parse token: format is "adminId-timestamp"
  const parts = sessionToken.split('-');
  
  if (parts.length !== 2) {
    console.error('verifySession: Invalid token format', sessionToken);
    await clearSession();
    return null;
  }

  const [adminId, timestampStr] = parts;
  
  // Validate adminId exists
  if (!adminId || adminId.length < 1) {
    console.error('verifySession: Invalid adminId in token');
    await clearSession();
    return null;
  }

  // Check timestamp
  const timestamp = parseInt(timestampStr);
  if (isNaN(timestamp)) {
    console.error('verifySession: Invalid timestamp in token');
    await clearSession();
    return null;
  }

  // Check if token is expired (7 days)
  const now = Date.now();
  const expiry = timestamp + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  if (now > expiry) {
    console.log('verifySession: Token expired, clearing session');
    await clearSession();
    return null;
  }

  // Verify admin exists in database
  try {
    const admin = await db.admin.findFirst({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!admin) {
      console.log('verifySession: Admin not found in database for ID:', adminId);
      await clearSession();
      return null;
    }

    console.log('verifySession: Valid admin found', admin.email);
    return admin;
  } catch (error) {
    console.error('verifySession: Database error', error);
    return null;
  }
}

/**
 * Get admin ID from session
 */
export async function getAdminIdFromSession(): Promise<string | null> {
  const sessionToken = await getSession();

  if (!sessionToken) {
    return null;
  }

  // Parse token: format is "adminId-timestamp"
  const parts = sessionToken.split('-');
  
  if (parts.length !== 2) {
    return null;
  }

  const [adminId, timestampStr] = parts;
  
  // Validate adminId exists
  if (!adminId || adminId.length < 1) {
    return null;
  }

  // Check timestamp
  const timestamp = parseInt(timestampStr);
  if (isNaN(timestamp)) {
    return null;
  }

  // Check if token is expired (7 days)
  const now = Date.now();
  const expiry = timestamp + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  if (now > expiry) {
    await clearSession();
    return null;
  }

  return adminId;
}
