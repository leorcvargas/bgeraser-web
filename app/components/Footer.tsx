import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import { Link, Typography } from "@mui/joy";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <Sheet
      component="footer"
      variant="outlined"
      className={styles.fotter}
      sx={{
        p: 2,
        borderRadius: { xs: 0, sm: "sm" },
        marginTop: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography level="body-sm">
          Made with love by{" "}
          <Link
            href="https://github.com/leorcvargas"
            target="_blank"
            rel="noopener noreferrer"
          >
            @leorcvargas
          </Link>
        </Typography>
      </Box>
    </Sheet>
  );
}
