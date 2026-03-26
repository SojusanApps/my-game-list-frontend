import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
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

const validationSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  remember: z.boolean(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function LoginForm() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/login" }) as { redirect?: string };
  const from = searchParams.redirect || "/";
  const { login } = useAuth();

  const form = useForm<ValidationSchema>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: zod4Resolver(validationSchema),
  });

  const onSubmitHandler = async (data: ValidationSchema) => {
    try {
      const { data: tokenInfo, response } = await TokenService.tokenCreate({
        body: { email: data.email, password: data.password, access: "", refresh: "" },
      });
      if (response?.status !== StatusCode.OK) {
        notifications.show({ title: "Error", message: "Error logging in", color: "red" });
        return;
      }
      const token = tokenInfo?.access;
      const refreshToken = tokenInfo?.refresh;
      if (token && refreshToken) {
        login({ email: data.email, token, refreshToken });
        notifications.show({ title: "Success", message: "Logged in successfully", color: "green" });
      }
      navigate({ to: from, replace: true });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmitHandler)} noValidate>
        <TextInput
          placeholder="Please enter your email"
          required
          id="email"
          label="Email"
          name="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          placeholder="Please enter your password"
          required
          id="password"
          label="Password"
          name="password"
          {...form.getInputProps("password")}
        />
        <Checkbox
          name="remember"
          id="remember"
          label="Remember me"
          {...form.getInputProps("remember", { type: "checkbox" })}
        />
        <Text ta="center" size="sm" mt="md" c="var(--color-text-600)">
          Don&apos;t have an account?&nbsp;
          <Link to="/register" className={authStyles.authLink}>
            Sign up
          </Link>
        </Text>
        <Button type="submit" fullWidth uppercase style={{ marginTop: 24 }}>
          LOGIN
        </Button>
      </form>

      <Divider
        label="Or continue with"
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
