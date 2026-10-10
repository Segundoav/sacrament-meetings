import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const isProtected =
        path === '/meetings/new' || path.endsWith('/edit');

      if (isProtected) return isLoggedIn;

      if (isLoggedIn && path === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;