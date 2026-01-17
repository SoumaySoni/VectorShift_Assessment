import { Handle } from 'reactflow';

export const BaseNode = ({title,children,handles = [],width =200,height = 80,
}) => {
  return (
    <div
      style={{
        width,
        height,
        border: '1px solid black',
        padding: 8,
        boxSizing: 'border-box',
      }}
    >
      {/* Render handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
        />
      ))}

      {/* Title */}
      <div>
        <span>{title}</span>
      </div>

      {/* Node-specific content */}
      <div>
        {children}
      </div>
    </div>
  );
};
