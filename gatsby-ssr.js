import * as React from "react";
import GraphButton from "./src/components/GraphButton";

export const wrapPageElement = ({ element }) => {
  return (
    <>
      {element}
      <GraphButton />
    </>
  );
};

