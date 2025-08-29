import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email:string;
    username?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    role?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string | null;
      email: string | null;
      name?: string | null;
      username?: string | null;
      firstname?: string | null;
      lastname?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | null;
    email: string | null;
    username?: string | null;
    role?: string | null;
  }
}
