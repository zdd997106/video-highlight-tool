import { Container, Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ padding: 2, height: "100vh" }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Typography variant="h2" gutterBottom>
          Hello World
        </Typography>
        <Typography variant="body1">
          This is a placeholder page for the app. You can replace this with your
          own later.
        </Typography>
      </Stack>
    </Container>
  );
}
