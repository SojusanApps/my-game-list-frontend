import * as React from "react";
import { useTranslation } from "react-i18next";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { Box, PasswordInput, Stack, Text } from "@mantine/core";
import { Button } from "@/components/ui/Button";
import { useChangePassword } from "../hooks/userQueries";
import { ApiError } from "@/utils/apiUtils";
import i18n from "@/lib/i18n";

export const changePasswordValidationSchema = z
  .object({
    current_password: z.string().min(1, { message: i18n.t("validation:currentPasswordRequired") }),
    new_password: z
      .string()
      .min(1, { message: i18n.t("validation:newPasswordRequired") })
      .min(8, { message: i18n.t("validation:newPasswordMin") })
      .max(32, { message: i18n.t("validation:newPasswordMax") }),
    new_password_confirm: z.string().min(1, { message: i18n.t("validation:newPasswordConfirmRequired") }),
  })
  .refine(data => data.new_password === data.new_password_confirm, {
    path: ["new_password_confirm"],
    message: i18n.t("validation:passwordsNoMatch"),
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordValidationSchema>;

const initialValues: ChangePasswordFormValues = {
  current_password: "",
  new_password: "",
  new_password_confirm: "",
};

export default function ChangePasswordForm() {
  const { t } = useTranslation("users");
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    initialValues,
    validate: schemaResolver(changePasswordValidationSchema),
  });

  const onSubmitHandler = (data: ChangePasswordFormValues) => {
    changePassword(data, {
      onSuccess: () => {
        form.reset();
        notifications.show({
          title: t("settings.password.successTitle"),
          message: t("settings.password.successMessage"),
          color: "green",
        });
      },
      onError: error => {
        if (error instanceof ApiError && error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            form.setFieldError(field, messages.join(" "));
          });
        }
      },
    });
  };

  return (
    <Box
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid var(--color-background-200)",
        overflow: "hidden",
      }}
      mt={24}
    >
      <Box
        style={{
          background: "var(--color-background-50)",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-background-200)",
        }}
      >
        <Text fw={600} c="var(--color-text-900)">
          {t("settings.password.sectionTitle")}
        </Text>
      </Box>

      <Box p={24}>
        <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
          <Stack gap={12}>
            <PasswordInput
              id="current_password"
              name="current_password"
              label={t("settings.password.currentPasswordLabel")}
              placeholder={t("settings.password.currentPasswordPlaceholder")}
              {...form.getInputProps("current_password")}
            />
            <PasswordInput
              id="new_password"
              name="new_password"
              label={t("settings.password.newPasswordLabel")}
              placeholder={t("settings.password.newPasswordPlaceholder")}
              {...form.getInputProps("new_password")}
            />
            <PasswordInput
              id="new_password_confirm"
              name="new_password_confirm"
              label={t("settings.password.confirmPasswordLabel")}
              placeholder={t("settings.password.confirmPasswordPlaceholder")}
              {...form.getInputProps("new_password_confirm")}
            />
          </Stack>
          <Stack gap={12} mt="md">
            <Button type="submit" isLoading={isPending} disabled={isPending}>
              {t("settings.password.saveButton")}
            </Button>
          </Stack>
          <Text fz="sm" c="var(--color-text-500)" mt={8}>
            {t("settings.password.helperText")}
          </Text>
        </form>
      </Box>
    </Box>
  );
}
