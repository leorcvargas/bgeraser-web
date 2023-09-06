"use client";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Grid,
  IconButton,
} from "@mui/joy";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import UndoIcon from "@mui/icons-material/Undo";
import DownloadIcon from "@mui/icons-material/Download";
import { LoadingContext } from "../contexts/LoadingContext";
import { FileContext } from "../contexts/FileContext";

export function UploadArea() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { file, setFile } = useContext(FileContext);

  const [intervalN, setIntervalN] = useState(-1);
  const fileObjectURL = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);
  const [result, setResult] = useState<Blob>();
  const resultObjectURL = useMemo(() => {
    if (!result) return;
    return URL.createObjectURL(result);
  }, [result]);

  useEffect(() => {
    if (intervalN === -1) return;

    return () => clearInterval(intervalN);
  }, [intervalN]);

  useEffect(() => {
    if (!loading && intervalN !== -1) {
      clearInterval(intervalN);
    }
  }, [loading, intervalN]);

  const clear = () => {
    setFile(undefined);
    setResult(undefined);
  };

  const handleConfirm = async () => {
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const imageID = await createImage();
      const processID = await createProcess(imageID);
      const url = await new Promise<string>((resolve, reject) =>
        pollProcess(processID, resolve, reject)
      );
      const resultBlob = await downloadResult(url);

      setResult(resultBlob);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }

    async function downloadResult(url: string) {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "image/png",
        },
      });

      const blob = await res.blob();

      return blob;
    }

    async function pollProcess(processID: string, resolve: any, reject: any) {
      const n = window.setInterval(async () => {
        const res = await fetch(`${apiUrl}/images/process/${processID}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .catch(reject);

        if (res.data.erroredAt) {
          return reject(new Error("process failed"));
        }

        if (res.data.finishedAt) {
          return resolve(res.data.result.url);
        }
      }, 2000);

      setIntervalN(n);
    }

    async function createProcess(imageID: string) {
      const res = await fetch(
        `${apiUrl}/images/${imageID}/process/REMOVE_BACKGROUND`,
        {
          method: "POST",
        }
      );

      const { data } = (await res.json()) as {
        data: string;
      };

      return data;
    }

    async function createImage() {
      const formData = new FormData();
      formData.append("images", file as Blob);

      const res = await fetch(`${apiUrl}/images`, {
        method: "POST",
        body: formData,
      });

      const { data } = (await res.json()) as {
        data: string[];
      };

      return data[0];
    }

    function handleError(error: Error) {
      clear();

      const message = (error as Error).message;
      alert(`Something wrong happened: ${message}`);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        flexGrow: 1,
        minWidth: {
          xs: 320,
          sm: 640,
        },
        minHeight: {
          xs: 240,
          sm: 480,
        },
      }}
    >
      <CardOverflow>
        <AspectRatio objectFit="contain" ratio={1}>
          <Image
            src={result ? resultObjectURL! : file ? fileObjectURL! : ""}
            alt="image being processed"
            layout="fill"
          />
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Grid
          container
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Grid flexGrow={1}>
            <IconButton variant="outlined" onClick={clear}>
              <UndoIcon />
            </IconButton>
          </Grid>

          <Grid flexGrow={4}>
            {result && !loading && (
              <Button
                variant="soft"
                color="neutral"
                startDecorator={<DownloadIcon />}
                type="submit"
                sx={{ width: "100%" }}
                component="a"
                href={resultObjectURL}
                download="kamui-app-result.png"
              >
                Download Image
              </Button>
            )}
            {!result && (
              <Button
                variant="soft"
                color="neutral"
                startDecorator={<UploadIcon />}
                onClick={handleConfirm}
                loading={loading}
                sx={{ width: "100%" }}
              >
                Remove Background
              </Button>
            )}
          </Grid>

          <Grid flexGrow={2} />
        </Grid>
      </CardContent>
    </Card>
  );
}
