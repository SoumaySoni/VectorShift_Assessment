import { useState, useEffect } from "react";
import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(
    data?.name || `input${id.replace(/\D/g, "")}`
  );

  const [inputType, setInputType] = useState(data?.inputType || "text");

  // Keep node data in sync
  useEffect(() => {
    if (data) {
      data.name = name;
      data.inputType = inputType;
    }
  }, [name, inputType, data]);
console.log("hey input")

  return (
    <BaseNode
      title="Input"
      variant="input"
      handles={[
        {
          type: "source",
          position: "right",
          id: `${id}-output`,
        },
      ]}
    >
      {/* Input name */}
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="input0"
        />
      </label>

      {/* Input type selector */}
      <label>
        Type
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="file">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
