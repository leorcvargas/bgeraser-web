import { Box, Container } from "@mui/joy";
import { UploadArea } from "./components/UploadArea";
import { UploadWrapper } from "./components/UploadWrapper";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ display: "flex", flex: "1" }}>
      <UploadWrapper>
        <UploadArea />
      </UploadWrapper>
    </Container>
  );
}
