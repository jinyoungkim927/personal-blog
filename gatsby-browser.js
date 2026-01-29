import "katex/dist/katex.min.css";
import "./src/styles/custom.css";
import * as React from "react";
import GraphButton from "./src/components/GraphButton";
import features from "./src/config/features";

export const wrapPageElement = ({ element }) => {
  return (
    <>
      {element}
      {features.graphEnabled && <GraphButton />}
    </>
  );
};
