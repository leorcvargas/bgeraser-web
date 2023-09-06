"use client";

import logo from "@bgeraser/public/logo.png";
import { Box, Grid } from "@mui/material";
import { Rajdhani } from "next/font/google";
import Image from "next/image";
import { useContext } from "react";
import styles from "./Logo.module.css";
import { LoadingContext } from "../contexts/LoadingContext";

const rajdhaniBold = Rajdhani({ weight: "700", subsets: ["latin"] });
const rajdhaniNormal = Rajdhani({ weight: "500", subsets: ["latin"] });

const logoSize = 40;

export function Logo() {
  const { loading } = useContext(LoadingContext);

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="center"
      className={rajdhaniBold.className}
      spacing={2}
    >
      <Grid item display="flex">
        <Image
          src={logo}
          alt="App logo"
          width={logoSize}
          height={logoSize}
          className={`${styles["logo-filter"]} ${
            loading ? styles["logo-loading"] : ""
          }`}
        />
      </Grid>

      <Grid container item spacing={1.5}>
        <Grid item>
          <div className={styles["logo-text"]}>Kamui</div>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Box
            sx={{
              height: "25px",
              width: "1px",
              backgroundColor: "gray",
            }}
          />
        </Grid>
        <Grid item>
          <div
            className={`${rajdhaniNormal.className} ${styles["logo-subtext"]}`}
          >
            Background Eraser
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
