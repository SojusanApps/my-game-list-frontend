import * as React from "react";

import AppLogo from "@/components/AppLogo/AppLogo";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage(): React.JSX.Element {
  return (
    <div className="container flex justify-center max-w-full max-h-full">
      <div className="bg-[url(src/assets/images/LoginRegisterBackground.jpg)] transform -scale-x-100 bg-cover blur-[2px] h-full w-full max-w-full max-h-full absolute -z-10" />
      <div className="flex-col justify-items-center w-1/5 min-w-fit mt-20 p-8 bg-background-100 rounded-xl">
        <div>
          <AppLogo />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
