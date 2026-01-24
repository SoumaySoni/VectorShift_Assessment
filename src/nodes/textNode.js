import { useState, useRef, useEffect, useMemo } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";
import { useUpdateNodeInternals } from "reactflow";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { useTextVariables } from "../hooks/useTextVariables";

// Helper 

export const detectSuggestionMode = (text, cursor) => {
  const before = text.slice(0, cursor);

  const fieldMatch = before.match(/{{\s*([\w]+)\.\s*([\w]*)$/);
  if (fieldMatch) {
    return { mode: "field", activeNode: fieldMatch[1] };
  }

  const nodeMatch = before.match(/{{\s*([\w]*)$/);
  if (nodeMatch) {
    return { mode: "node", activeNode: null };
  }

  return null;
};

// Component 

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);

  const [text, setText] = useState(data?.text || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState("node");
  const [activeNode, setActiveNode] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const inputNodes = useMemo(
    () => nodes.filter((n) => n.type === "customInput"),
    [nodes]
  );

  const variableHandles = useMemo(
    () =>
      variables.map((v, i) => ({
        type: "target",
        position: "left",
        id: `${id}-${v}`,
        style: { top: 40 + i * 24 },
        label: v,
      })),
    [variables, id]
  );

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables.length]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    data.text = value;

    const detected = detectSuggestionMode(
      value,
      e.target.selectionStart
    );

    if (detected) {
      setMode(detected.mode);
      setActiveNode(detected.activeNode);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setActiveNode(null);
    }
  };

  const insertAtCursor = (insertValue) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const before = text.slice(0, cursor).replace(/{{\s*[\w.]*$/, "");
    const after = text.slice(cursor);

    const nextText = before + insertValue + after;
    setText(nextText);
    data.text = nextText;

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = before.length + insertValue.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
    });
  };

  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];

    if (mode === "node") {
      return inputNodes.map((n) => ({
        label: n.data.name,
        value: `{{${n.data.name}`,
      }));
    }

    if (mode === "field" && activeNode) {
      return [
        {
          label: "text",
          value: `{{${activeNode}.text`,
        },
      ];
    }

    return [];
  }, [showSuggestions, mode, inputNodes, activeNode]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        i === 0 ? suggestions.length - 1 : i - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      insertAtCursor(suggestions[activeIndex].value);
      setShowSuggestions(false);
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (showSuggestions) setActiveIndex(0);
  }, [showSuggestions, mode]);

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
        onKeyDown={handleKeyDown}
        placeholder="Type text… use {{ }}"
        style={{ resize: "none", width: "100%" }}
      />

      {showSuggestions && (
        <div className="variable-suggestions">
          {suggestions.map((s, i) => (
            <div
              key={s.label}
              className={`variable-suggestion ${i === activeIndex ? "active" : ""
                }`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                insertAtCursor(s.value);
                setShowSuggestions(false);
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
    </BaseNode>
  );
};
