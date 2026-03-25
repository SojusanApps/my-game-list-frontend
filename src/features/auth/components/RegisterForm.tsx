import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useNavigate, Link, useSearch } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";

import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Stack, Text } from "@mantine/core";
import authStyles from "./auth.module.css";
import { useCreateUser } from "@/features/users/hooks/userQueries";

const validationSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.email({ message: "Please enter a valid email address" }).min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords don't match",
  });

type ValidationSchema = z.infer<typeof validationSchema>;

function RegisterForm() {
  const navigate = useNavigate();
  const search: { redirect?: string } = useSearch({ strict: false });
  const { mutate: createUser } = useCreateUser();

  const form = useForm<ValidationSchema>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(validationSchema),
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
          notifications.show({ title: "Success", message: "User created successfully", color: "green" });
          navigate({
            to: "/login",
            replace: true,
            search: search.redirect ? { redirect: search.redirect } : undefined,
          });
        },
        onError: error => {
          notifications.show({
            title: "Error",
            message: error.message || "Failed to create user",
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
        placeholder="Please enter your username"
        required
        id="username"
        label="Username"
        name="username"
        {...form.getInputProps("username")}
      />
      <TextInput
        placeholder="Please enter your email address"
        required
        id="email"
        label="Email Address"
        name="email"
        {...form.getInputProps("email")}
      />
      <PasswordInput
        required
        id="password"
        name="password"
        label="Password"
        placeholder="Please enter your password"
        {...form.getInputProps("password")}
      />
      <PasswordInput
        required
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        placeholder="Confirm the password"
        {...form.getInputProps("confirmPassword")}
      />
      <Stack gap={12} mt="xl">
        <Button type="submit" fullWidth uppercase>
          REGISTER
        </Button>
        <Button type="button" onClick={onCancelHandler} variant="ghost" fullWidth uppercase>
          CANCEL
        </Button>
      </Stack>
      <Text ta="center" size="sm" mt="md" c="var(--color-text-600)">
        Already have an account?&nbsp;
        <Link
          to="/login"
          search={search.redirect ? { redirect: search.redirect } : undefined}
          className={authStyles.authLink}
        >
          Login
        </Link>
      </Text>
    </form>
  );
}

export default RegisterForm;
