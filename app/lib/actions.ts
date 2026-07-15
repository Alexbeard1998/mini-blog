"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveImage(file: File): Promise<string> {
  // Убедимся, что папка uploads существует
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Генерируем уникальное имя файла, чтобы не было конфликтов
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  // Читаем содержимое файла и сохраняем на диск
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Возвращаем путь, который будет доступен из браузера
  return `/uploads/${fileName}`;
}

export async function toggleTheme(currentTheme: string) {
  const cookieStore = await cookies();
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  cookieStore.set("theme", newTheme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // год
  });

  redirect("/");
}

export async function togglePublish(id: string, currentStatus: boolean) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }
  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  // Проверяем, что пост принадлежит этому пользователю
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Нет доступа");
  }
  //Меняем статус на противоположный
  await prisma.post.update({
    where: { id },
    data: { published: !currentStatus },
  });

  revalidatePath("/dashboard");
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Нет доступа");
  }

  await prisma.post.delete({
    where: { id },
  });

  redirect("/dashboard");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  // Проверяем, что пост принадлежит этому пользователю
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Нет доступа");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("removeImage") === "on";

  if (!title || !content) {
    throw new Error("Заголовок и содержимое обязательны");
  }
    let imageUrl = post.imageUrl;

  // Если отметили "удалить изображение" — убираем
  if (removeImage) {
    imageUrl = null;
  }
  // Если загрузили новый файл — заменяем
  else if (imageFile && imageFile.size > 0) {
    imageUrl = await saveImage(imageFile);
  }

  await prisma.post.update({
    where: { id },
    data: { title, content, published, imageUrl },
  });

  redirect(`/posts/${id}`);
}

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!title || !content) {
    throw new Error("Заголовок и содержимое обязательны");
  }

  // Если файл прикреплён — сохраняем и получаем путь
  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveImage(imageFile);
  }

  await prisma.post.create({
    data: {
      title,
      content,
      published,
      imageUrl,
      authorId: session.user.id,
    },
  });

  redirect("/");
}

export async function setPassword(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    throw new Error("Пароль должен быть не менее 6 символов");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  revalidatePath("/profile");
}

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/" });
}

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // Не делаем редирект, мы сами обработаем
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error("Неверный email или пароль");
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Проверяем, нет ли уже пользователя с таким email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }

  // Хэшируем пароль (10 раундов соли)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создаём пользователя
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}
