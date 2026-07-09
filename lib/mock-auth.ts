/**
 * Mock Authentication System
 * Bypasses NextAuth for local development
 */

import { mockStorage } from "./mock-data/storage";
import type { MockUser, UserRole } from "./mock-data/types";

const MOCK_SESSION_KEY = "minara-mock-session";

export interface MockSession {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    image: string | null;
  };
}

export type MockLoginResult =
  | { user: MockUser; error?: never }
  | { error: 'EMAIL_NOT_FOUND' | 'WRONG_PASSWORD'; user?: never };

/**
 * Mock login - checks if user exists with matching password
 * Returns specific error codes for email not found vs wrong password
 */
export function mockLogin(email: string, password: string): MockLoginResult {
  const users = mockStorage.getUsers();

  // First check if email exists
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { error: 'EMAIL_NOT_FOUND' };
  }

  // Then check password
  if (user.password !== password) {
    return { error: 'WRONG_PASSWORD' };
  }

  // Store session in sessionStorage
  if (typeof window !== "undefined") {
    const session: MockSession = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    };
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  }
  return { user };
}

/**
 * Mock register - creates new user
 */
export function mockRegister(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
}): MockUser {
  const users = mockStorage.getUsers();

  // Check if user already exists
  if (users.find((u) => u.email === data.email)) {
    throw new Error("User already exists");
  }

  // Check for auto-admin
  const isAdmin = data.email.toLowerCase().includes("admin");

  const newUser: MockUser = {
    id: mockStorage.generateId("user"),
    email: data.email,
    password: data.password, // In mock mode, we store plain text (never do this in production!)
    name: data.name,
    phone: data.phone || null,
    role: isAdmin ? "ADMIN" : data.role || "CONSUMER",
    image: null,
    emailVerified: new Date(), // Auto-verify in mock mode
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  mockStorage.setUsers(users);

  return newUser;
}

/**
 * Get current session from sessionStorage
 * Session persists across page refreshes but clears when browser closes
 */
export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(MOCK_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Set mock session (for role switching)
 */
export function setMockSession(userId: string) {
  const users = mockStorage.getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  const session: MockSession = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
  };

  if (typeof window !== "undefined") {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

/**
 * Mock logout
 */
export function mockLogout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  }
}

/**
 * Switch role (for testing)
 * This allows you to quickly switch between consumer/business/admin
 */
const ROLE_DEFAULTS: Record<UserRole, { name: string; email: string }> = {
  CONSUMER: { name: "Aisha Rahman", email: "consumer@minara.test" },
  BUSINESS_OWNER: { name: "Yusuf Khan", email: "owner@minara.test" },
  ADMIN: { name: "Trust Team", email: "admin@minara.test" },
};

export function switchMockRole(role: UserRole) {
  const users = mockStorage.getUsers();
  let user = users.find((u) => u.role === role);

  // No seeded user for this role yet? Create one so the flow always connects.
  if (!user) {
    const d = ROLE_DEFAULTS[role];
    user = {
      id: mockStorage.generateId("user"),
      email: d.email,
      password: "password",
      name: d.name,
      phone: null,
      role,
      image: null,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    mockStorage.setUsers(users);
  }

  return setMockSession(user.id);
}

/**
 * Get all available mock users (for role switcher UI)
 */
export function getAvailableMockUsers() {
  return mockStorage.getUsers().map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
  }));
}
