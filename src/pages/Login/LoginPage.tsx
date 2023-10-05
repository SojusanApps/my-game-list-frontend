import * as React from "react";

import AppLogo from "../../assets/logos/AppLogo.svg";
import LoginForm from "../../components/Forms/Login/LoginForm";

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="container flex justify-center max-w-full max-h-full">
      <div className="bg-[url(src/assets/images/LoginRegisterBackground.jpg)] bg-cover blur-[2px] h-full w-full max-w-full max-h-full absolute -z-10" />
      <div className="flex-col justify-items-center w-1/5 min-w-fit mt-20 p-8 bg-background-100 rounded-xl">
        <div>
          <img src={AppLogo} alt="MyGameList logo" />
        </div>
        <h6 className="text-4xl font-bold mb-2 text-center">MyGameList</h6>
        <LoginForm />
      </div>
    </div>
  );
}
