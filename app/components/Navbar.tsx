import Box from "@mui/material/Box";
import * as React from "react";
import { Logo } from "./Logo";

export default function Navbar() {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        position: "static",
        // backgroundColor: "#18181b",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          margin: "auto",
          justifyContent: "center",
          minHeight: "64px",
          paddingX: "24px",
        }}
      >
        <Logo />
      </Box>
    </Box>
  );
}
