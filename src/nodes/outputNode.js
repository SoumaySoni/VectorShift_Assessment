import { useState } from "react";
import {BaseNode} from "./BaseNode";

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || "");
  const [type, setType] = useState(data?.outputType || "Text");

  return (
    <BaseNode
      title="Output"
      variant="output"
      handles={[
        {
          type: "target",
          position: "left",
          id: `${id}-input`,
        },
      ]}
    >
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
