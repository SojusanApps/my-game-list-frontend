import * as React from "react";

export default function StartPage(): React.JSX.Element {
  return (
    <div className="container bg-slate-300 max-w-full">
      <h6>Welcome to MyGameList Temporary Start Page - Early access!</h6>
      <h6>
        Log in:&nbsp;
        <a href="/login" className="text-blue-500">
          here
        </a>
      </h6>
      <h6>
        Register:&nbsp;
        <a href="/register" className="text-blue-500">
          here
        </a>
      </h6>
      <h6>
        Home:&nbsp;
        <a href="/home" className="text-blue-500">
          here
        </a>
      </h6>
    </div>
  );
}
