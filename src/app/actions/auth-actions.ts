"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
} from "@/lib/auth";
import {
  verifyUserCredentials,
  createUser,
  hasAnyUser,
} from "@/lib/auth-db";


export type AuthActionResponse = {
  success: boolean;
  error?: string;
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function loginAction(
  _prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return { success: false, error: "Username and password are required." };
  }

  const user = await verifyUserCredentials(username.trim(), password);

  if (!user) {
    return {
      success: false,
      error: "Invalid username or password. Please try again.",
    };
  }

  try {
    const token = await createSessionToken(user.username);
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (err) {
    console.error("Login session creation error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Register (one-time — only when no user exists)
// ---------------------------------------------------------------------------

export async function registerAction(
  _prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  // Block if an account already exists
  const alreadyHasUser = await hasAnyUser();
  if (alreadyHasUser) {
    return {
      success: false,
      error: "Registration is closed. An account already exists.",
    };
  }

  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    !username.trim() ||
    !password
  ) {
    return { success: false, error: "All fields are required." };
  }

  if (username.trim().length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  try {
    const user = await createUser(username, password);

    // Auto-login after registration
    const token = await createSessionToken(user.username);
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create account.",
    };
  }
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  redirect("/login");
}

