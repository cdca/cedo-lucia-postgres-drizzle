import { logoutAction, registerAction } from "@/actions/auth-action";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import { db } from "@/lib/database";
import RegisterForm from "./_components/register-form";
import LoginForm from "./_components/login-form";
import React from "react";
import { validateRequest } from "@/lib/auth/auth";
import Logout from "./_components/logout";
import Link from "next/link";

export default async function Home() {
  const users = await db.query.user.findMany();
  const { user, session } = await validateRequest();
  return (
    <div className="p-10 flex flex-col gap-4 h-[100vh] overflow-hidden">
      <p className="bg-gray-50 w-full text-md text-slate-600 border p-4 rounded-md">
        This is a simple demo example of a auth application using Next.js, Lucia
        auth, Drizzle, and PostgreSQl.{" "}
        <Link
          target="_blank"
          className="underline font-medium text-blue-600"
          href="https://www.cedo.dev/blog/authentication-with-lucia-next-drizzle-postgres"
        >
          Link to the original blog post.
        </Link>
      </p>

      <div className="flex gap-4">
        <div className="flex flex-col w-[500px] gap-4">
          <ErrorBoundary errorComponent={Error}>
            <RegisterForm />
          </ErrorBoundary>
          <ErrorBoundary errorComponent={Error}>
            <LoginForm />
          </ErrorBoundary>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex bg-gray-50 border rounded-md border-neutral-900 px-12 py-4 h-[80px] justify-between">
            <div className="flex gap-2 items-center">
              <div className="text-lg font-bold">Logged user:</div>
              <div className="text-lg font-bold text-blue-700">
                {user?.email ?? "None"}
              </div>
              <div className="text-lg text-neutral-900">
                {session?.expiresAt &&
                  " - Session expires at: " +
                    new Date(session.expiresAt).toLocaleString()}
              </div>
            </div>
            {user?.email && <Logout />}
          </div>
          <div className="flex flex-col bg-gray-50 flex-1 border rounded-md border-neutral-900 px-12 py-6">
            <div className="mb-3 text-lg font-bold">User list:</div>
            <div className="h-[500px] overflow-auto">
              <div className="grid grid-cols-3 gap-4 overflow-auto">
                <div className="mb-3 text-lg font-bold">ID</div>
                <div className="mb-3 text-lg font-bold">Username</div>
                <div className="mb-3 text-lg font-bold">Email</div>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <p>{user.id}</p>
                    <p>{user.userName}</p>
                    <p>{user.email}</p>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
