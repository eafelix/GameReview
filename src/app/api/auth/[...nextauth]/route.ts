import NextAuth from "next-auth";
import OktaProvider from "next-auth/providers/okta";
import CredentialsProvider from "next-auth/providers/credentials";
import SteamProvider from "@/lib/auth/steam-provider";

const handler = NextAuth({
  providers: [
    SteamProvider(),
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: process.env.OKTA_ISSUER,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically validate against your database
        // For development, we'll use a hardcoded user
        if (credentials?.email === "dev@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            email: "dev@example.com",
            name: "Development User",
          };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 