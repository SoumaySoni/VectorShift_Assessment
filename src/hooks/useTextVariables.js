import { useEffect, useRef, useState } from "react";

const extractVariables = (text) => {
  const regex = /{{\s*([\w]+)\.[\w]+\s*}}/g;
  const vars = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }

  return Array.from(vars);
};

export const useTextVariables = ({
  text,
  nodeId,
  edges,
  setEdges,
  onBlockedRemove,
}) => {
  const [variables, setVariables] = useState([]);
  const prevVarsRef = useRef([]);

  useEffect(() => {
    const newVars = extractVariables(text);
    const prevVars = prevVarsRef.current;

    // variables removed by user
    const removed = prevVars.filter((v) => !newVars.includes(v));

    // block removal if connected
    const blocked = removed.find((v) =>
      edges.some((e) => e.targetHandle === `${nodeId}-${v}`)
    );

    if (blocked) {
      onBlockedRemove(blocked);
      return;
    }

    // remove edges for removed vars
    if (removed.length > 0) {
      setEdges((state) => ({
        edges: state.edges.filter(
          (e) => !removed.includes(e.targetHandle?.replace(`${nodeId}-`, ""))
        ),
      }));
    }

    setVariables(newVars);
    prevVarsRef.current = newVars;
  }, [text, nodeId]); // 🔥 IMPORTANT: edges removed from deps

  return variables;
};
