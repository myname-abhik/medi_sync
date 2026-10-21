import { describe, it, expect, beforeEach } from "vitest";
import { signup, login, sessionFromToken, updateProfile, DEMO_ACCOUNT } from "./auth";

beforeEach(() => localStorage.clear());

describe("static auth", () => {
  it("logs in the demo account and resolves the session without the password", async () => {
    const token = await login(DEMO_ACCOUNT);
    const { user } = sessionFromToken(token);
    expect(user.email).toBe("demo@medisync.com");
    expect(user).not.toHaveProperty("password");
  });
  it("rejects wrong passwords", async () => {
    await expect(login({ email: DEMO_ACCOUNT.email, password: "nope-nope" })).rejects.toThrow("Invalid email or password");
  });
  it("creates accounts, blocks duplicates and validates input", async () => {
    const token = await signup({ name: "Abhik", email: "a@b.co", password: "secret1" });
    expect(sessionFromToken(token).user.name).toBe("Abhik");
    await expect(signup({ name: "X", email: "A@B.CO", password: "secret1" })).rejects.toThrow("already exists");
    await expect(signup({ name: "X", email: "bad", password: "secret1" })).rejects.toThrow("valid email");
    await expect(signup({ name: "X", email: "x@y.co", password: "123" })).rejects.toThrow("at least 6");
  });
  it("updates the profile", async () => {
    const token = await login(DEMO_ACCOUNT);
    const { user } = sessionFromToken(token);
    const next = await updateProfile(user._id, { name: "New Name", email: user.email, phone: "123", address: "Kolkata" });
    expect(sessionFromToken(next).user).toMatchObject({ name: "New Name", phone: "123", address: "Kolkata" });
  });
  it("returns null for garbage tokens", () => {
    expect(sessionFromToken("garbage")).toBeNull();
    expect(sessionFromToken(undefined)).toBeNull();
  });
});
