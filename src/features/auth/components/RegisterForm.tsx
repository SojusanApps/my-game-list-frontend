import * as React from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { useNavigate, Link, useSearch } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";

import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Stack, Text } from "@mantine/core";
import authStyles from "./auth.module.css";
import { useCreateUser } from "@/features/users/hooks/userQueries";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const validationSchema = z
  .object({
    username: z.string().min(1, { message: i18n.t("validation:usernameRequired") }),
    email: z
      .email({ message: i18n.t("validation:emailInvalid") })
      .min(1, { message: i18n.t("validation:emailRequired") }),
    password: z
      .string()
      .min(1, i18n.t("validation:passwordRequired"))
      .min(8, i18n.t("validation:passwordMin"))
      .max(32, i18n.t("validation:passwordMax")),
    confirmPassword: z.string().min(1, { message: i18n.t("validation:confirmPasswordRequired") }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: i18n.t("validation:passwordsNoMatch"),
  });

type ValidationSchema = z.infer<typeof validationSchema>;

function RegisterForm() {
  const navigate = useNavigate();
  const search: { redirect?: string } = useSearch({ strict: false });
  const { mutate: createUser } = useCreateUser();
  const { t } = useTranslation("auth");

  const form = useForm<ValidationSchema>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: schemaResolver(validationSchema),
  });

  const onSubmitHandler = async (data: ValidationSchema) => {
    createUser(
      {
        username: data.username,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: t("register.successTitle"),
            message: t("register.successMessage"),
            color: "green",
          });
          navigate({
            to: "/login",
            replace: true,
            search: search.redirect ? { redirect: search.redirect } : undefined,
          });
        },
        onError: error => {
          notifications.show({
            title: t("register.errorTitle"),
            message: error.message || t("register.errorMessage"),
            color: "red",
          });
        },
      },
    );
  };

  const onCancelHandler: React.MouseEventHandler = () => {
    navigate({ to: ".." });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
      <TextInput
        placeholder={t("register.usernamePlaceholder")}
        required
        id="username"
        label={t("register.usernameLabel")}
        name="username"
        {...form.getInputProps("username")}
      />
      <TextInput
        placeholder={t("register.emailPlaceholder")}
        required
        id="email"
        label={t("register.emailLabel")}
        name="email"
        {...form.getInputProps("email")}
      />
      <PasswordInput
        required
        id="password"
        name="password"
        label={t("register.passwordLabel")}
        placeholder={t("register.passwordPlaceholder")}
        {...form.getInputProps("password")}
      />
      <PasswordInput
        required
        id="confirmPassword"
        name="confirmPassword"
        label={t("register.confirmPasswordLabel")}
        placeholder={t("register.confirmPasswordPlaceholder")}
        {...form.getInputProps("confirmPassword")}
      />
      <Stack gap={12} mt="xl">
        <Button type="submit" fullWidth uppercase>
          {t("register.button")}
        </Button>
        <Button type="button" onClick={onCancelHandler} variant="ghost" fullWidth uppercase>
          {t("register.cancel")}
        </Button>
      </Stack>
      <Text ta="center" size="sm" mt="md" c="var(--color-text-600)">
        {t("register.alreadyHaveAccount")}&nbsp;
        <Link
          to="/login"
          search={search.redirect ? { redirect: search.redirect } : undefined}
          className={authStyles.authLink}
        >
          {t("register.loginLink")}
        </Link>
      </Text>
    </form>
  );
}

export default RegisterForm;
