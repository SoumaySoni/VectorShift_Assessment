import { BaseNode } from "./BaseNode";

export const NumberNode = ({ id }) => {
  return (
    <BaseNode
      title="Number"
      variant="number"
      handles={[
        { type: "source", position: "right", id: `${id}-out` },
      ]}
    >
      <div>Outputs a number</div>
    </BaseNode>
  );
};
