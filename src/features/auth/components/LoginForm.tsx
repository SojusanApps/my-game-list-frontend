import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import GoogleLogo from "@/assets/logos/GoogleLogo.svg";
import FacebookLogo from "@/assets/logos/FacebookLogo.svg";
import XLogo from "@/assets/logos/XLogo.svg";
import TextFieldInput from "@/components/ui/Form/TextFieldInput";
import CheckboxInput from "@/components/ui/Form/CheckboxInput";
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
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { login } = useAuth();

  const defaultValues: ValidationSchema = {
    email: "",
    password: "",
    remember: false,
  };

  const methods = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<ValidationSchema> = async (data: ValidationSchema) => {
    try {
      const { data: tokenInfo, response } = await TokenService.tokenCreate({
        body: { email: data.email, password: data.password, access: "", refresh: "" },
      });
      if (response.status !== StatusCode.OK) {
        toast.error("Error logging in");
        return;
      }
      const token = tokenInfo?.access;
      const refreshToken = tokenInfo?.refresh;
      if (token && refreshToken) {
        login({ email: data.email, token, refreshToken });
        toast.success("Logged in successfully");
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitHandler)} noValidate>
        <TextFieldInput
          placeholder="Please enter your email"
          required
          id="email"
          label="Email"
          name="email"
          type="text"
        />
        <TextFieldInput
          placeholder="Please enter your password"
          required
          id="password"
          label="Password"
          name="password"
          type="password"
        />
        <CheckboxInput name="remember" id="remember" label="Remember me" />
        <h6 className="mt-2">
          Don&apos;t have an account?&nbsp;
          <Link to="/register" className="text-secondary-950">
            Sign up
          </Link>
        </h6>
        <Button type="submit" fullWidth uppercase className="mt-4 shadow-md hover:shadow-lg">
          LOGIN
        </Button>
      </form>
      <div className="grid grid-cols-3 justify-items-center mt-4">
        <img src={GoogleLogo} alt="google logo" className="w-8" />
        <img src={FacebookLogo} alt="facebook logo" className="w-8" />
        <img src={XLogo} alt="x logo" className="w-8" />
      </div>
    </FormProvider>
  );
}

export default LoginForm;
