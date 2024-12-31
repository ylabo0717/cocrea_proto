import { supabase } from './supabase';
import { hashPassword } from './crypto-utils';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function login({ email, password }: LoginCredentials): Promise<AuthUser | null> {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('User not found:', email);
      return null;
    }

    const hashedPassword = await hashPassword(password, user.salt);

    // デバッグ用のログ出力
    console.log('Debug - Password comparison:');
    console.log('Input password hash:', hashedPassword);
    console.log('Stored password hash:', user.hashed_password);
    console.log('Salt used:', user.salt);

    if (hashedPassword !== user.hashed_password) {
      console.error('Password mismatch for user:', email);
      return null;
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}