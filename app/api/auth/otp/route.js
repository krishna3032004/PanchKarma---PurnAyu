// app/api/auth/otp/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, name, isSignUp } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (isSignUp) {
      if (user) {
        return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
      }
    } else {
      if (!user) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
      }
    }

    // OTP Generate Karein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minute expiry

    // Purana OTP delete karke naya save karein
    await prisma.oTP.deleteMany({ where: { email } });
    await prisma.oTP.create({
      data: { email, otp: hashedOtp, expires },
    });

    // **IMPORTANT**: Abhi ke liye OTP terminal me print hoga
    console.log(`\n\nOTP for ${email}: ${otp}\n\n`);
    
    // Yahan production me email bhejne ka code aayega (nodemailer se)

    return NextResponse.json({ message: 'OTP sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}