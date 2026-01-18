import { useState, useRef, useEffect } from "react";
import {BaseNode} from "./BaseNode.js";

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  return (
    <BaseNode
      title="Text"
      variant="text"
      handles={[
        {
          type: "source",
          position: "right",
          id: `${id}-output`,
        },
      ]}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
      />
    </BaseNode>
  );
};
