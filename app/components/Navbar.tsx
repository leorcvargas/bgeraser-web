import Box from "@mui/material/Box";
import { Logo } from "./Logo";
import Link from "next/link";

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
      <Link
        href="/"
        style={{
          display: "flex",
          margin: "auto",
          justifyContent: "center",
          minHeight: "64px",
          paddingLeft: "24px",
          paddingRight: "24px",
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
      </Link>
    </Box>
  );
}
