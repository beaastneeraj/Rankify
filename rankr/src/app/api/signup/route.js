import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { hashPassword } from '@/lib/hash';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 });

  const user = await User.create({ email, passwordHash: await hashPassword(password) });
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
