import { getProcess } from "@bgeraser/app/actions/getProcess";
import { ImageProcessCard } from "@bgeraser/app/components/ImageProcessCard";
import { UploadWrapper } from "@bgeraser/app/components/UploadWrapper";

export default async function Process({ params }: { params: { id: string } }) {
  const imageProcess = await getProcess(params.id);

  return <ImageProcessCard imageProcess={imageProcess} />;
}
