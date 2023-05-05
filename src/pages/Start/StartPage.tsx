import * as React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function StartPage(): JSX.Element {
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Typography component="h1" variant="h6">
        Welcome to MyGameList Temporary Start Page - Early access!
      </Typography>
      <Typography component="h1" variant="h6">
        Log in:&nbsp;
        <Link href="/login" color="secondary">
          here
        </Link>
      </Typography>
      <Typography component="h1" variant="h6">
        Register:&nbsp;
        <Link href="/register" color="secondary">
          here
        </Link>
      </Typography>
      <Typography component="h1" variant="h6">
        Home:&nbsp;
        <Link href="/home" color="secondary">
          here
        </Link>
      </Typography>
    </Container>
  );
}
