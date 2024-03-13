"use server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { eq } from "drizzle-orm";
import { NewUser, insertUserSchema, user } from "@/lib/database/schema";
import { db } from "@/lib/database";
import { lucia, validateRequest } from "@/lib/auth/auth";
import { LoginSchema, RegisterSchema } from "@/lib/validation/shema";

export async function registerAction(
  formData: FormData
): Promise<ActionResult> {
  const parsedData = RegisterSchema.safeParse({
    user: formData.get("user"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    throw new Error(parsedData.error.issues[0].message);
  }

  const data = parsedData.data;

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, data.email),
  });

  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  const hashedPassword = await new Argon2id().hash(data.password);
  const newUser = insertUserSchema.parse({
    email: data.email,
    hashedPassword: hashedPassword,
    userName: data.user,
  });

  const results: NewUser[] = await db.insert(user).values(newUser).returning();

  if (!results[0].id) {
    throw new Error("User could not be created");
  }

  const session = await lucia.createSession(results[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  revalidatePath("/");
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const parsedData = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      message: parsedData.error.issues[0].message,
    };
  }
  const data = parsedData.data;

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, data.email),
  });

  if (!existingUser) {
    throw new Error("Incorrect username or password");
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword ?? "",
    data.password
  );

  if (!validPassword) {
    throw new Error("Incorrect username or password");
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function logoutAction(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return revalidatePath("/");
}
