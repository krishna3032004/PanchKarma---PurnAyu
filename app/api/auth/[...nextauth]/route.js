// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "isSignUp", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const storedOtp = await prisma.oTP.findUnique({ where: { email: credentials.email } });
        if (!storedOtp || new Date() > storedOtp.expires) {
          throw new Error("OTP expired or invalid.");
        }

        const isValid = await bcrypt.compare(credentials.otp, storedOtp.otp);
        if (!isValid) {
          throw new Error("Invalid OTP.");
        }
        
        await prisma.oTP.delete({ where: { email: credentials.email } });

        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        
        if (!user && credentials.isSignUp) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              emailVerified: new Date(),
            }
          });
        }
        
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }