import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Grid } from "@mui/joy";
import { LoadingProvider } from "./contexts/LoadingContext";
import { FileProvider } from "./contexts/FileContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kamui | Background Eraser",
  description:
    "Kamui is a web application able to remove a background of an image.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry options={{ key: "joy" }}>
          <FileProvider>
            <LoadingProvider>
              <Grid container flexDirection="column" sx={{ height: "100vh" }}>
                <Navbar />
                {children}
                <Footer />
              </Grid>
            </LoadingProvider>
          </FileProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
