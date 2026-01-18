import { Handle } from "reactflow";
import '../styles/nodes.css'

export const BaseNode = ({ title, variant, children, handles = [] }) => {
  return (
    <div className={`base-node node-${variant}`}>
      {handles.map((h, i) => (
        <Handle
          key={i}
          type={h.type}
          position={h.position}
          id={h.id}
          style={h.style}
        />
      ))}

      <div className="base-node__header">{title}</div>
      <div className="base-node__body">{children}</div>
    </div>
  );
};
