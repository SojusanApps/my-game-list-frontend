import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Button } from "@/components/Button/Button";
import TextFieldInput from "@/components/Fields/FormInput/TextFieldInput";
import Constants from "@/utils/Constants";
import { useCreateUser } from "@/features/users/hooks/userQueries";

const validationSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
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
  const defaultValues: ValidationSchema = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const { mutate: createUser } = useCreateUser();

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    createUser(
      {
        username: data.username,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("User created successfully");
          navigate("/login", { replace: true });
        },
        onError: error => {
          toast.error(error.message || "Failed to create user");
        },
      },
    );
  };

  const onCancelHandler: React.MouseEventHandler = () => {
    navigate(Constants.NAVIGATE_PREVIOUS_PAGE);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandler)} noValidate>
        <TextFieldInput
          placeholder="Please enter your username"
          required
          id="username"
          label="Username"
          name="username"
          type="text"
        />
        <TextFieldInput
          placeholder="Please enter your email address"
          required
          id="email"
          label="Email Address"
          name="email"
          type="text"
        />
        <TextFieldInput
          required
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Please enter your password"
        />
        <TextFieldInput
          required
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Confirm the password"
        />
        <Button type="submit" fullWidth uppercase className="mt-4 shadow-md hover:shadow-lg">
          REGISTER
        </Button>
        <Button
          type="button"
          onClick={onCancelHandler}
          variant="secondary"
          fullWidth
          uppercase
          className="mt-2 shadow-md hover:shadow-lg"
        >
          CANCEL
        </Button>
      </form>
    </FormProvider>
  );
}

export default RegisterForm;
