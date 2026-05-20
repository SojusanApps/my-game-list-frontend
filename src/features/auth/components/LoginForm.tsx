import * as React from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";

import { Button } from "@/components/ui/Button";
import GoogleLogo from "@/assets/logos/GoogleLogo.svg";
import FacebookLogo from "@/assets/logos/FacebookLogo.svg";
import authStyles from "./auth.module.css";
import XLogo from "@/assets/logos/XLogo.svg";
import { TextInput, PasswordInput, Checkbox, Divider, Group, Text } from "@mantine/core";
import StatusCode from "@/utils/StatusCode";
import { TokenService } from "@/client";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const validationSchema = z.object({
  email: z
    .email({ message: i18n.t("validation:emailInvalid") })
    .min(1, { message: i18n.t("validation:emailRequired") }),
  password: z
    .string()
    .min(1, i18n.t("validation:passwordRequired"))
    .min(8, i18n.t("validation:passwordMin"))
    .max(32, i18n.t("validation:passwordMax")),
  remember: z.boolean(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function LoginForm() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/login" }) as { redirect?: string };
  const from = searchParams.redirect || "/";
  const { login } = useAuth();
  const { t } = useTranslation("auth");

  const form = useForm<ValidationSchema>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: schemaResolver(validationSchema),
  });

  const onSubmitHandler = async (data: ValidationSchema) => {
    try {
      const { data: tokenInfo, response } = await TokenService.tokenCreate({
        body: { email: data.email, password: data.password, access: "", refresh: "" },
      });
      if (response?.status !== StatusCode.OK) {
        notifications.show({ title: t("login.errorTitle"), message: t("login.errorMessage"), color: "red" });
        return;
      }
      const token = tokenInfo?.access;
      const refreshToken = tokenInfo?.refresh;
      if (token && refreshToken) {
        login({ email: data.email, token, refreshToken });
        notifications.show({ title: t("login.successTitle"), message: t("login.successMessage"), color: "green" });
      }
      navigate({ to: from, replace: true });
    } catch (error) {
      notifications.show({
        title: t("login.errorTitle"),
        message: error instanceof Error ? error.message : t("login.errorMessage"),
        color: "red",
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
        <TextInput
          placeholder={t("login.emailPlaceholder")}
          required
          id="email"
          label={t("login.emailLabel")}
          name="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          placeholder={t("login.passwordPlaceholder")}
          required
          id="password"
          label={t("login.passwordLabel")}
          name="password"
          {...form.getInputProps("password")}
        />
        <Checkbox
          name="remember"
          id="remember"
          label={t("login.rememberMe")}
          {...form.getInputProps("remember", { type: "checkbox" })}
        />
        <Text ta="center" size="sm" mt="md" c="var(--color-text-600)">
          {t("login.noAccount")}&nbsp;
          <Link to="/register" className={authStyles.authLink}>
            {t("login.signUp")}
          </Link>
        </Text>
        <Button type="submit" fullWidth uppercase style={{ marginTop: 24 }}>
          {t("login.button")}
        </Button>
      </form>

      <Divider
        label={t("login.orContinueWith")}
        labelPosition="center"
        my="lg"
        classNames={{ label: "text-text-400 uppercase text-xs" }}
      />

      <Group grow gap="md">
        <Button variant="outline" size="sm" style={{ width: "100%" }}>
          <img src={GoogleLogo} alt="google logo" style={{ width: "20px" }} />
        </Button>
        <Button variant="outline" size="sm" style={{ width: "100%" }}>
          <img src={FacebookLogo} alt="facebook logo" style={{ width: "20px" }} />
        </Button>
        <Button variant="outline" size="sm" style={{ width: "100%" }}>
          <img src={XLogo} alt="x logo" style={{ width: "20px" }} />
        </Button>
      </Group>
    </>
  );
}

export default LoginForm;
