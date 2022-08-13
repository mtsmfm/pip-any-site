import { createRoot } from "react-dom/client";
import * as React from "react";
import { ElementSelector } from "./ElementSelector";

export const getPipRect = async () => {
  const rootDom = document.createElement("div");
  const shadowRoot = rootDom.attachShadow({ mode: "open" });

  const root = createRoot(shadowRoot);
  root.render(<ElementSelector />);
  document.body.append(rootDom);
};
