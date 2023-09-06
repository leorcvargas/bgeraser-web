"use client";

import UndoIcon from "@mui/icons-material/Undo";
import UploadIcon from "@mui/icons-material/Upload";
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
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { FileContext } from "../contexts/FileContext";
import { LoadingContext } from "../contexts/LoadingContext";

export function UploadConfirmCard() {
  const router = useRouter();

  const { loading, setLoading } = useContext(LoadingContext);
  const { file, setFile } = useContext(FileContext);

  const fileObjectURL = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const clear = () => {
    setFile(undefined);
  };

  const handleConfirm = async () => {
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const imageID = await createImage();
      const processID = await createProcess(imageID);

      router.push(`/images/process/${processID}`);
    } catch (error) {
      handleError(error as Error);
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
            src={fileObjectURL}
            alt="image being processed"
            blurDataURL={fileObjectURL}
            placeholder="blur"
            fill
            sizes="100vw"
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
          </Grid>

          <Grid flexGrow={2} />
        </Grid>
      </CardContent>
    </Card>
  );
}
