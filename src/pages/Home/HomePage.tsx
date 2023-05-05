import * as React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

export default function HomePage(): JSX.Element {
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Typography component="h1" variant="h6">
        HOME PAGE - EARLY ACCESS!
      </Typography>
    </Container>
  );
}
