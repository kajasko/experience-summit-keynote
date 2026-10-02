import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/stage.css";
import "./styles/ui-interface.css";
import "./styles/ui-result.css";
import "./styles/ui-wall.css";
import "./styles/adapt-redesign.css";
import "./styles/distrust-redesign.css";
import "./styles/polish.css";
import "./styles/finale-b.css";
import "./styles/mobile.css";

if (new URLSearchParams(window.location.search).get("thumbs") === "1") {
  document.documentElement.classList.add("thumbs-capture");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
