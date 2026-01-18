import {BaseNode} from "./BaseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      title="LLM"
      variant="llm"
      handles={[
        { type: "target", position: "left", id: `${id}-prompt` },
        { type: "source", position: "right", id: `${id}-response` },
      ]}
    >
      <div style={{ fontSize: "12px", color: "#6b7280" }}>
        Large Language Model
      </div>
    </BaseNode>
  );
};
