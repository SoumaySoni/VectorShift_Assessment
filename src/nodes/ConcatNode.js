import { BaseNode } from "./BaseNode";

export const ConcatNode = ({ id }) => {
  return (
    <BaseNode
      title="Concat"
      variant="concat"
      handles={[
        { type: "target", position: "left", id: `${id}-a`, style: { top: 40 } },
        { type: "target", position: "left", id: `${id}-b`, style: { top: 65 } },
        { type: "source", position: "right", id: `${id}-out` },
      ]}
    >
      <div>Concatenates inputs</div>
    </BaseNode>
  );
};
