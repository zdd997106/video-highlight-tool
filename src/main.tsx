import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";

import "./global.css";
import Pages from "./pages";
import { theme } from "./theme";
import { DialogsProvider } from "gexii/dialogs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <DialogsProvider>
        <Pages />
      </DialogsProvider>
    </ThemeProvider>
  </StrictMode>
);
