import * as React from "react";
import { useTranslation } from "react-i18next";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { Box, Stack, Text, TextInput } from "@mantine/core";
import { Button } from "@/components/ui/Button";
import { useChangeUsername } from "../hooks/userQueries";
import { ApiError } from "@/utils/apiUtils";
import i18n from "@/lib/i18n";

// Mirrors Django's default UnicodeUsernameValidator: letters, digits, underscore, and @/./+/-
const USERNAME_FORMAT_REGEX = /^[\p{L}\p{N}_.@+-]+$/u;

export const buildChangeUsernameValidationSchema = (currentUsername: string) =>
  z
    .object({
      username: z
        .string()
        .min(1, { message: i18n.t("validation:usernameRequired") })
        .regex(USERNAME_FORMAT_REGEX, { message: i18n.t("validation:usernameFormat") }),
    })
    .refine(data => data.username !== currentUsername, {
      path: ["username"],
      message: i18n.t("validation:usernameSameAsCurrent"),
    });

export type ChangeUsernameFormValues = { username: string };

interface ChangeUsernameFormProps {
  userId: number;
  currentUsername: string;
}

export default function ChangeUsernameForm({ userId, currentUsername }: Readonly<ChangeUsernameFormProps>) {
  const { t } = useTranslation("users");
  const { mutate: changeUsername, isPending } = useChangeUsername(userId);

  const validationSchema = React.useMemo(() => buildChangeUsernameValidationSchema(currentUsername), [currentUsername]);

  const form = useForm<ChangeUsernameFormValues>({
    initialValues: { username: currentUsername },
    validate: schemaResolver(validationSchema),
  });

  React.useEffect(() => {
    form.setFieldValue("username", currentUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsername]);

  const onSubmitHandler = (data: ChangeUsernameFormValues) => {
    changeUsername(
      { username: data.username },
      {
        onSuccess: () => {
          notifications.show({
            title: t("settings.username.successTitle"),
            message: t("settings.username.successMessage"),
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
      },
    );
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
          {t("settings.username.sectionTitle")}
        </Text>
      </Box>

      <Box p={24}>
        <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
          <TextInput
            id="username"
            name="username"
            label={t("settings.username.usernameLabel")}
            placeholder={t("settings.username.usernamePlaceholder")}
            {...form.getInputProps("username")}
          />
          <Stack gap={12} mt="md">
            <Button type="submit" isLoading={isPending} disabled={isPending}>
              {t("settings.username.saveButton")}
            </Button>
          </Stack>
          <Text fz="sm" c="var(--color-text-500)" mt={8}>
            {t("settings.username.helperText")}
          </Text>
        </form>
      </Box>
    </Box>
  );
}
