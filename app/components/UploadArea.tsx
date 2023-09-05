"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  Grid,
  Typography,
} from "@mui/joy";
import Image from "next/image";
import React, { useContext } from "react";
import styles from "./UploadArea.module.css";
import dropAreaBg from "@bgeraser/public/upload-area-bg.svg";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { UploadWrapper } from "./UploadWrapper";
import { LoadingContext } from "../contexts/LoadingContext";

export function UploadArea() {
  const { loading, setLoading } = useContext(LoadingContext);

  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File>();
  const [intervalN, setIntervalN] = React.useState(-1);

  const fileInputRef = React.useRef(null);

  const fileObjectURL = React.useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    if (intervalN === -1) return;

    return () => clearInterval(intervalN);
  }, [intervalN]);

  React.useEffect(() => {
    if (!loading && intervalN !== -1) {
      clearInterval(intervalN);
    }
  }, [loading, intervalN]);

  const handleDrag: React.DragEventHandler<HTMLFormElement | HTMLDivElement> = (
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

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const image = await createImage();
      const process = await createProcess(image.id);

      const resultFilename = await new Promise<string>((resolve, reject) =>
        pollProcess(process.id, resolve, reject)
      );
      setResult(`http://127.0.0.1:8080/i/${resultFilename}`);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }

    async function pollProcess(processID: string, resolve: any, reject: any) {
      const n = window.setInterval(async () => {
        const res = await fetch(
          `http://localhost:8080/images/process/${processID}`,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .catch(reject);

        if (res.data.erroredAt) {
          return reject(new Error("process failed"));
        }

        if (res.data.finishedAt) {
          return resolve(res.data.result.originalFilename);
        }
      }, 2000);

      setIntervalN(n);
    }

    async function createProcess(imageID: string) {
      const res = await fetch(
        `http://localhost:8080/images/${imageID}/process/REMOVE_BACKGROUND`,
        {
          method: "POST",
        }
      );

      const { data } = (await res.json()) as {
        data: { id: string };
      };

      return data;
    }

    async function createImage() {
      const formData = new FormData();
      formData.append("images", file as Blob);

      const res = await fetch("http://localhost:8080/images", {
        method: "POST",
        body: formData,
      });

      const { data } = (await res.json()) as {
        data: Array<{
          format: string;
          originalFilename: string;
          size: number;
          id: string;
        }>;
      };

      return data[0];
    }

    function handleError(error: Error) {
      const message = (error as Error).message;
      alert(`Something wrong happened: ${message}`);
    }
  };

  if (result) {
    return (
      <UploadWrapper>
        <Grid>
          <Card
            variant="outlined"
            sx={{
              width: { sm: "480px", xs: "380px" },
              height: { sm: "320px", xs: "240px" },
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottom: "unset",
            }}
          >
            <CardCover
              sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <Image
                src={result}
                alt="image dropped"
                width={480}
                height={320}
                className={`${styles.bg} ${
                  dragActive ? styles["bg-active"] : ""
                }`}
              />
            </CardCover>
          </Card>
        </Grid>

        <Grid width={"100%"}>
          <Card
            variant="soft"
            className={styles["button-area"]}
            sx={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTop: "unset",
            }}
          >
            <CardContent>
              <form method="get" action={result}>
                <Button
                  variant="soft"
                  color="success"
                  startDecorator={<DownloadIcon />}
                  type="submit"
                >
                  Download Image
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </UploadWrapper>
    );
  }

  if (file) {
    return (
      <UploadWrapper>
        <Grid>
          <Card
            variant="outlined"
            sx={{
              width: { sm: "480px", xs: "380px" },
              height: { sm: "320px", xs: "240px" },
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottom: "unset",
            }}
          >
            <CardCover
              sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <Image
                src={fileObjectURL}
                alt="image dropped"
                width={480}
                height={320}
                className={`${styles.bg} ${
                  dragActive ? styles["bg-active"] : ""
                }`}
              />
            </CardCover>
          </Card>
        </Grid>

        <Grid width={"100%"}>
          <Card
            variant="soft"
            className={styles["button-area"]}
            sx={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTop: "unset",
            }}
          >
            <CardContent>
              <Button
                variant="soft"
                color="neutral"
                startDecorator={<UploadIcon />}
                onClick={handleConfirm}
                loading={loading}
              >
                Remove Background
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </UploadWrapper>
    );
  }

  return (
    <UploadWrapper>
      <form
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onSubmit={(e) => {
          e.preventDefault();
          console.log(e);
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: { sm: "480px", xs: "380px" },
            height: { sm: "320px", xs: "240px" },
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottom: "unset",
          }}
        >
          <CardCover
            sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <Image
              src={dropAreaBg}
              alt="upload area background"
              width={480}
              height={320}
              className={`${styles.bg} ${
                dragActive ? styles["bg-active"] : ""
              }`}
            />
          </CardCover>

          <CardContent sx={{ justifyContent: "center", alignItems: "center" }}>
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

        <Card
          variant="outlined"
          className={styles["button-area"]}
          sx={{
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderTop: "unset",
          }}
        >
          <CardContent>
            <Button
              variant="soft"
              color="neutral"
              startDecorator={<ImageIcon />}
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
    </UploadWrapper>
  );
}
