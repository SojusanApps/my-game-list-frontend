import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import logo from "../../assets/logos/logo.svg";
import backgroundImage from "../../assets/images/login_register_background.jpg";
import Colors from "../../styles/Colors";
import RegisterForm from "../../components/Forms/Register/RegisterForm";

export default function RegisterPage(): JSX.Element {
  return (
    <Container
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        display: "flex",
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw !important",
        position: "absolute",
        top: "0",
        left: "0",
      }}
    >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: Colors.background,
            opacity: 0.9,
            borderRadius: "45px",
          }}
        >
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              maxHeight: { xs: 200, md: 167 },
              maxWidth: { xs: 200, md: 250 },
            }}
            src={logo}
          />
          <Typography component="h1" variant="h6">
            MyGameList
          </Typography>
          <RegisterForm />
        </Box>
      </Container>
    </Container>
  );
}
