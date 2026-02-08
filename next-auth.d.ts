import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName: string
      profileImage: string
      authMethods: string[]
      provider: string
      role: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    firstName: string
    profileImage: string
    authMethods: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    firstName: string
    profileImage: string
    authMethods: string[]
    provider: string
    role: string
  }
}
