import { createTheme } from "@mui/material/styles";
import Colors from "./Colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
    },
    background: {
      default: Colors.background,
    },
    error: {
      main: Colors.error,
    },
    text: {
      primary: Colors.text,
    },
    success: {
      main: Colors.success,
    },
  },
});

export default lightTheme;
