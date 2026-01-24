import { useState, useRef, useEffect } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";
import { useUpdateNodeInternals } from "reactflow";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { useTextVariables } from "../hooks/useTextVariables";

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);

  const [text, setText] = useState(data?.text || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState("node");

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const setEdges = useStore.setState;

  useAutoResizeTextarea(textareaRef, text);

  const variables = useTextVariables({
    text,
    nodeId: id,
    edges,
    setEdges,
    onBlockedRemove: (v) =>
      alert(`Cannot remove "{{${v}}}" because it is connected.`),
  });

  const inputNodes = nodes.filter((n) => n.type === "customInput");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    data.text = value;

    const cursor = e.target.selectionStart;
    const before = value.slice(0, cursor);

    const fieldMatch = before.match(/{{\s*([\w]+)\.\s*([\w]*)$/);
    const nodeMatch = before.match(/{{\s*([\w]*)$/);

    if (fieldMatch) {
      setMode("field");
      setShowSuggestions(true);
    } else if (nodeMatch) {
      setMode("node");
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const variableHandles = variables.map((v, i) => ({
    type: "target",
    position: "left",
    id: `${id}-${v}`,
    style: { top: 40 + i * 24 },
    label: v,
  }));

  useEffect(() => {
  updateNodeInternals(id);
}, [variables]);

console.log("hey text")
  return (
    <BaseNode
      title="Text"
      variant="text"
      handles={[
        ...variableHandles,
        { type: "source", position: "right", id: `${id}-output` },
      ]}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Type text… use {{ }}"
        style={{ resize: "none", width: "100%" }}
      />

      {showSuggestions && (
        <div className="variable-suggestions">
          {mode === "node" &&
            inputNodes.map((n) => (
              <div key={n.id}>{n.data.name}</div>
            ))}
          {mode === "field" && <div>text</div>}
        </div>
      )}
    </BaseNode>
  );
};
