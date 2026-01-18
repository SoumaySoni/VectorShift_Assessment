import { useState } from "react";
import {BaseNode} from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.name || "");

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
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
