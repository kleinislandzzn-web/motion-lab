import React from "react";
import { createRoot } from "react-dom/client";
import MotionLab from "../app/motion-lab";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><MotionLab /></React.StrictMode>,
);
