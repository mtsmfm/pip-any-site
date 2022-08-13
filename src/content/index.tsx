import { createRoot } from "react-dom/client";
import * as React from "react";
import { App } from "./App";

const rootDom = document.createElement("div");
const shadowRoot = rootDom.attachShadow({ mode: "open" });

const root = createRoot(shadowRoot);
root.render(<App />);
document.body.append(rootDom);
