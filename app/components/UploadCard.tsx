"use client";

import {
  Card,
  CardCover,
  CardContent,
  Box,
  Typography,
  Button,
} from "@mui/joy";
import { DragEventHandler, useContext, useRef, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";

import styles from "./UploadArea.module.css";
import { FileContext } from "../contexts/FileContext";

export function UploadCard() {
  const { setFile } = useContext(FileContext);

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f: File) => {
    const validTypesMap: { [key: string]: boolean } = {
      "image/png": true,
      "image/jpeg": true,
    };
    const isValid = validTypesMap[f.type];

    if (!isValid) {
      alert("Invalid image type. Currently only JPEG and PNG are accepted");
      return;
    }

    setFile(f);
  };

  const handleDrag: DragEventHandler<HTMLFormElement | HTMLDivElement> = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      console.log("enter|over");
      setDragActive(true);
    } else if (e.type === "dragleave") {
      console.log("leave");
      setDragActive(false);
    }
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form onDragEnter={handleDrag} onDragLeave={handleDrag}>
      <Card
        variant="outlined"
        sx={{
          width: { sm: "480px", xs: "380px" },
          height: { sm: "320px", xs: "240px" },
        }}
        className={styles["card-image"]}
      >
        <CardCover
          sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
        >
          <div
            className={`${styles.bg} ${dragActive ? styles["bg-active"] : ""}`}
          />
        </CardCover>

        <CardContent
          sx={{ justifyContent: "center", alignItems: "center" }}
          className={`${styles.bg} ${dragActive ? styles["bg-active"] : ""}`}
        >
          <Box
            sx={{
              border: "3px dashed rgba(255,255,255,.4)",
              borderRadius: "var(--joy-radius-md)",
              paddingY: 2,
              paddingX: 4,
            }}
          >
            <Typography level="h4">Drop your image here</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" className={styles["card-button"]}>
        <CardContent>
          <Button
            variant="soft"
            color="neutral"
            startDecorator={<ImageIcon />}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              (fileInputRef.current as any)?.click();
            }}
          >
            Choose Image
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        onChange={(e) => {
          e.preventDefault();
          if (e?.target?.files && e?.target?.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        style={{ display: "none" }}
      />

      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={styles["drag-cover"]}
        ></div>
      )}
    </form>
  );
}
