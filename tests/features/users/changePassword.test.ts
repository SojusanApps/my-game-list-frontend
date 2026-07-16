import { describe, expect, it } from "vitest";
import { ZodType } from "zod";
import { changePasswordValidationSchema } from "@/features/users/components/ChangePasswordForm";

function getFirstIssuePath(schema: ZodType, value: unknown): PropertyKey[] {
  const result = schema.safeParse(value);
  if (result.success) {
    throw new Error("expected validation to fail");
  }
  return result.error.issues[0].path;
}

describe("changePasswordValidationSchema", () => {
  it("accepts a valid, matching password change", () => {
    const result = changePasswordValidationSchema.safeParse({
      current_password: "old-password",
      new_password: "new-strong-password",
      new_password_confirm: "new-strong-password",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty current password", () => {
    const result = changePasswordValidationSchema.safeParse({
      current_password: "",
      new_password: "new-strong-password",
      new_password_confirm: "new-strong-password",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a new password shorter than 8 characters", () => {
    const result = changePasswordValidationSchema.safeParse({
      current_password: "old-password",
      new_password: "short",
      new_password_confirm: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a new password longer than 32 characters", () => {
    const longPassword = "a".repeat(33);
    const result = changePasswordValidationSchema.safeParse({
      current_password: "old-password",
      new_password: longPassword,
      new_password_confirm: longPassword,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when the confirmation does not match the new password, attaching the error to new_password_confirm", () => {
    const path = getFirstIssuePath(changePasswordValidationSchema, {
      current_password: "old-password",
      new_password: "new-strong-password",
      new_password_confirm: "different-password",
    });
    expect(path).toEqual(["new_password_confirm"]);
  });
});
