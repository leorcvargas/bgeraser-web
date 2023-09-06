import { ImageProcess } from "../entities/imageProcess";

type Response = {
  data: ImageProcess;
};

export async function getProcess(processID: string): Promise<ImageProcess> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const endpointURL = `${apiURL}/images/process/${processID}`;

  const res = await fetch(endpointURL, { cache: "no-cache" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const { data } = (await res.json()) as Response;

  return data;
}
