import { BaseNode } from "./BaseNode";

export const DelayNode = ({ id }) => {
  return (
    <BaseNode
      title="Delay"
      variant="delay"
      handles={[
        { type: "target", position: "left", id: `${id}-in` },
        { type: "source", position: "right", id: `${id}-out` },
      ]}
    >
      <div>Delays input</div>
    </BaseNode>
  );
};
