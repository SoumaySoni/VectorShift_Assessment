import { useEffect, useRef, useState } from "react";

export const extractVariables = (text) => {
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
}) => {
  const [variables, setVariables] = useState([]);
  const prevVarsRef = useRef([]);

  useEffect(() => {
    const newVars = extractVariables(text);
    const prevVars = prevVarsRef.current;

    const removed = prevVars.filter((v) => !newVars.includes(v));

    if (removed.length > 0) {
      setEdges((state) => ({
        edges: state.edges.filter(
          (e) =>
            !removed.includes(
              e.targetHandle?.replace(`${nodeId}-`, "")
            )
        ),
      }));
    }

    setVariables(newVars);
    prevVarsRef.current = newVars;
  }, [text, nodeId, edges, setEdges]);

  return variables;
};
