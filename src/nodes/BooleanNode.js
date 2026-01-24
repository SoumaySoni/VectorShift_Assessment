import { BaseNode } from "./BaseNode";

export const BooleanNode = ({ id }) => {
  return (
    <BaseNode
      title="Boolean"
      variant="boolean"
      handles={[
        { type: "source", position: "right", id: `${id}-out` },
      ]}
    >
      <div>true / false</div>
    </BaseNode>
  );
};
