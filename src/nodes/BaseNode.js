import { Handle } from "reactflow";
import "../styles/nodes.css";

export const BaseNode = ({ title, variant, children, handles = [] }) => {
  console.log("hey base")

  return (
    <div className={`base-node node-${variant}`}>
      {handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}       
          type={h.type}
          position={h.position}
          style={h.style}
        />
      ))}

      <div className="base-node__header">{title}</div>
      <div className="base-node__body">{children}</div>
    </div>
  );
};
