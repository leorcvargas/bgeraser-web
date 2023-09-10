"use client";

import { Box, Grid } from "@mui/joy";
import React, { useContext, useEffect, useMemo } from "react";
import { FileContext } from "../contexts/FileContext";
import { UploadCard } from "./UploadCard";
import { UploadConfirmCard } from "./UploadConfirmCard";

export const UploadWrapper: React.FC = () => {
  const { file } = useContext(FileContext);

  const current = useMemo(() => {
    if (!file) {
      return <UploadCard />;
    }

    return <UploadConfirmCard />;
  }, [file]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/ping`).then(console.log);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: "auto",
        flexGrow: 1,
      }}
    >
      <Grid container flexDirection="column" alignItems={"center"}>
        {current}
      </Grid>
    </Box>
  );
};
