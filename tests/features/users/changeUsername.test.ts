import { describe, expect, it } from "vitest";
import { buildChangeUsernameValidationSchema } from "@/features/users/components/ChangeUsernameForm";

describe("buildChangeUsernameValidationSchema", () => {
  const schema = buildChangeUsernameValidationSchema("current_user");

  it("accepts a valid, different username", () => {
    const result = schema.safeParse({ username: "new_user.name+1" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty username", () => {
    const result = schema.safeParse({ username: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a username identical to the current one", () => {
    const result = schema.safeParse({ username: "current_user" });
    expect(result.success).toBe(false);
  });

  it("rejects a username with disallowed characters", () => {
    const result = schema.safeParse({ username: "new user!" });
    expect(result.success).toBe(false);
  });

  it("accepts unicode letters, matching Django's default username validator", () => {
    const result = schema.safeParse({ username: "użytkownik" });
    expect(result.success).toBe(true);
  });
});
