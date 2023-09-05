import { Box, Grid } from "@mui/joy";
import React from "react";

export const UploadWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
        {children}
      </Grid>
    </Box>
  );
};
