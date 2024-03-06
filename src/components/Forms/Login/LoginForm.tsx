import * as React from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";

import GoogleLogo from "../../../assets/logos/GoogleLogo.svg";
import FacebookLogo from "../../../assets/logos/FacebookLogo.svg";
import XLogo from "../../../assets/logos/XLogo.svg";
import TextFieldInput from "../../Fields/FormInput/TextFieldInput";
import CheckboxInput from "../../Fields/FormInput/CheckboxInput";
import StatusCode from "../../../helpers/StatusCode";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  remember: z.boolean(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function LoginForm() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      const response = await axiosPrivate.post("/token/", {
        email: data.email,
        password: data.password,
      });
      if (response.status !== StatusCode.OK) {
        alert("Error logging in");
        return;
      }
      const responseData = response.data;
      const token = responseData?.access;
      const refreshToken = responseData?.refresh;
      localStorage.setItem("user", JSON.stringify({ email: data.email, token, refreshToken }));
      navigate(from, { replace: true });
    } catch (error) {
      alert(error);
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
          <a href="/register" className="text-secondary-950">
            Sign up
          </a>
        </h6>
        <button
          type="submit"
          className="mt-4 w-full px-6 py-3 bg-primary-950 text-white font-medium uppercase rounded-lg shadow-md hover:bg-primary-900 hover:shadow-lg focus:bg-primary-800 focus:outline-none focus:ring-0 active:bg-slate-900"
        >
          LOGIN
        </button>
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
