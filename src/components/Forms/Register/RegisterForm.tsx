import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import TextFieldInput from "../../Fields/FormInput/TextFieldInput";
import Constants from "../../../helpers/Constants";
import StatusCode from "../../../helpers/StatusCode";
import { UserService } from "../../../client";


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

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    try {
      const {data: createData, response} = await UserService.userUsersCreate({
        body: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      });
      if (response.status !== StatusCode.CREATED || !createData) {
        throw new Error("Error creating user");
      }
      alert(createData);
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error);
    }
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
        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 bg-primary-950 text-white font-medium uppercase rounded shadow-md hover:bg-primary-900 hover:shadow-lg focus:bg-primary-800 focus:outline-none focus:ring-0 active:bg-slate-900"
        >
          REGISTER
        </button>
        <button
          type="button"
          onClick={onCancelHandler}
          className="w-full mt-2 px-6 py-3 bg-primary-600 text-white font-medium uppercase rounded shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-400 focus:outline-none focus:ring-0 active:bg-primary-700"
        >
          CANCEL
        </button>
      </form>
    </FormProvider>
  );
}

export default RegisterForm;
