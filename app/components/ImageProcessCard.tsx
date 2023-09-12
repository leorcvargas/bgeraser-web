"use client";

import { ImageProcess } from "../entities/imageProcess";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Grid,
  IconButton,
} from "@mui/joy";
import Image from "next/image";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import UndoIcon from "@mui/icons-material/Undo";
import DownloadIcon from "@mui/icons-material/Download";
import { useRouter } from "next/navigation";
import { FileContext } from "../contexts/FileContext";
import { LoadingContext } from "../contexts/LoadingContext";

type Props = {
  imageProcess: ImageProcess;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export function ImageProcessCard({ imageProcess }: Props) {
  const router = useRouter();
  const { file, setFile } = useContext(FileContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const [resultImageURL, setResultImageURL] = useState<string>(
    imageProcess.result?.url
  );

  const fileObjectURL = useMemo(() => {
    if (!file) {
      return;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const reset = useCallback(() => {
    setFile(undefined);
    setLoading(false);

    router.push("/");
  }, [router, setFile, setLoading]);

  useEffect(() => {
    let intervalID: number;

    const handleError = (error: Error) => {
      const message = (error as Error).message;
      alert(`Something wrong happened: ${message}`);
      reset();
    };

    const pollProcess = async (
      processID: string,
      resolve: any,
      reject: any
    ) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      intervalID = window.setInterval(async () => {
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
      }, 1000);
    };

    const handleConfirm = async () => {
      try {
        const url = await new Promise<string>((resolve, reject) =>
          pollProcess(imageProcess.id, resolve, reject)
        );

        setResultImageURL(url);
      } catch (error) {
        handleError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!resultImageURL) {
      handleConfirm().catch(handleError);
    }

    return () => clearInterval(intervalID);
  }, [imageProcess.id, reset, resultImageURL, setLoading]);

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
            {resultImageURL && (
              <AspectRatio objectFit="contain" ratio={1}>
                <Image
                  src={resultImageURL}
                  alt="image being processed"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(700, 475)
                  )}`}
                  fill
                  style={{
                    maxWidth: "100%",
                  }}
                />
              </AspectRatio>
            )}

            {fileObjectURL && !resultImageURL && (
              <AspectRatio objectFit="contain" ratio={1}>
                <Image
                  src={fileObjectURL}
                  alt="image being processed"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(700, 475)
                  )}`}
                  fill
                  style={{
                    maxWidth: "100%",
                  }}
                />
              </AspectRatio>
            )}
          </CardOverflow>

          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Grid flexGrow={1}>
                <IconButton variant="outlined" onClick={reset}>
                  <UndoIcon />
                </IconButton>
              </Grid>

              <Grid flexGrow={4}>
                <Button
                  variant="soft"
                  color="neutral"
                  type="submit"
                  sx={{ width: "100%" }}
                  component="a"
                  href={resultImageURL ?? fileObjectURL}
                  download="kamui-app-result.png"
                  loading={loading}
                  startDecorator={resultImageURL && <DownloadIcon />}
                >
                  Download Image
                </Button>
              </Grid>

              <Grid flexGrow={2} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
