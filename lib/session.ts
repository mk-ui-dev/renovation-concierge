import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { User } from './auth';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token.value, secret);
    return payload as unknown as User;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
}
