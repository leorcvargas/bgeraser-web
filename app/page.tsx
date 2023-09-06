import { Container } from "@mui/joy";
import { UploadWrapper } from "./components/UploadWrapper";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ display: "flex", flex: "1" }}>
      <UploadWrapper />
    </Container>
  );
}
