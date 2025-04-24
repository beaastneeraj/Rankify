import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { comparePassword } from '@/lib/hash';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const res = NextResponse.json({ success: true });
  res.headers.set(
    'Set-Cookie',
    serialize('authToken', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  );

  return res;
}
