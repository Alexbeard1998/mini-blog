import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./app/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    id: string;
    theme?: string | null;
  }
  interface Session {
    user: User & { theme?: string | null };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Адаптер связывает Auth.js с нашей базой данных
  adapter: PrismaAdapter(prisma),

  // Провайдеры авторизации
  providers: [
    // Вход через GitHub
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

    // Вход через email и пароль
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Ищем пользователя по email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Сравниваем пароль с хэшем
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],

  // Кастомные страницы входа
  pages: {
    signIn: "/login",
  },

  // Используем JWT вместо сессий в базе
  session: {
    strategy: "jwt",
  },

  // Колбэки для добавления данных в токен
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }, // ← подгружаем привязанные аккаунты
        });

        if (existingUser) {
          // Проверяем, есть ли уже GitHub среди привязанных аккаунтов
          const alreadyLinked = existingUser.accounts.some(
            (acc) => acc.provider === "github",
          );

          // Если нет — создаём привязку. Если есть — ничего не делаем
          if (!alreadyLinked) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            });
          }
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.theme = user.theme || "dark";
      }
      // Обновляем тему при принудительном обновлении сессии
      if (trigger === "update" && session?.theme) {
        token.theme = session.theme;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.theme = token.theme as string;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
