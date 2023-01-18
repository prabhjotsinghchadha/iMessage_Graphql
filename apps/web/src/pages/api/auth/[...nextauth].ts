import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../lib/prismadb"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      //console.log('Inside of the session callbacks');
      return { ...session, user: { ...session.user, ...user } };
    },
  }
})
