import * as React from "react";
import { useState } from "react";

export const ElementSelector: React.FC = () => {
  const [rect, setRect] = useState<DOMRect>();

  return (
    <div
      onMouseMove={(e) => {
        const elems = document.elementsFromPoint(e.clientX, e.clientY);
        const rect = elems[1].getBoundingClientRect();
        setRect(rect);
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {rect && (
        <div
          style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            border: "1px black solid",
          }}
        />
      )}
    </div>
  );
};
