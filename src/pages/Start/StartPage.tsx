import * as React from "react";
import { Link } from "react-router-dom";

export default function StartPage(): React.JSX.Element {
  return (
    <div className="container bg-slate-300 max-w-full">
      <h6>Welcome to MyGameList Temporary Start Page - Early access!</h6>
      <h6>
        Log in:{" "}
        <Link to="/login" className="text-blue-500">
          here
        </Link>
      </h6>
      <h6>
        Register:{" "}
        <Link to="/register" className="text-blue-500">
          here
        </Link>
      </h6>
      <h6>
        Home:{" "}
        <Link to="/home" className="text-blue-500">
          here
        </Link>
      </h6>
    </div>
  );
}
