import { Route } from "react-router-dom";
import { LoginPage, RegisterPage } from "./index";

export const AuthRoutes = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </>
);
