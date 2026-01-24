import { BaseNode } from "./BaseNode";

export const ConditionNode = ({ id }) => {
  return (
    <BaseNode
      title="Condition"
      variant="condition"
      handles={[
        { type: "target", position: "left", id: `${id}-cond` },
        { type: "source", position: "right", id: `${id}-true`, style: { top: 40 } },
        { type: "source", position: "right", id: `${id}-false`, style: { top: 65 } },
      ]}
    >
      <div>If / Else logic</div>
    </BaseNode>
  );
};
