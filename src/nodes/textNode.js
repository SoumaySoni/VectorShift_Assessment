import { useState, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

/**
 * Extract variable names from:
 *  {{input}}
 *  {{input.text}}
 */
const extractVariables = (text) => {
  const regex = /{{\s*([\w]+)\.[\w]+\s*}}/g;
  const vars = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]); // input1, input2
  }

  return Array.from(vars);
};

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("node"); // node | field
  const [activeNode, setActiveNode] = useState(null);
  const [variables, setVariables] = useState([]);

  const textareaRef = useRef(null);
  const nodes = useStore((state) => state.nodes);

  // Only Input nodes
  const inputNodes = nodes.filter((n) => n.type === "customInput");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    data.text = value;

    const cursor = e.target.selectionStart;
    const beforeCursor = value.slice(0, cursor);

    // Match {{input
    const nodeMatch = beforeCursor.match(/{{\s*([\w]*)$/);

    // Match {{input.
    const fieldMatch = beforeCursor.match(/{{\s*([\w]+)\.\s*([\w]*)$/);

    if (fieldMatch) {
      setMode("field");
      setActiveNode(fieldMatch[1]);
      setQuery(fieldMatch[2]);
      setShowSuggestions(true);
    } else if (nodeMatch) {
      setMode("node");
      setActiveNode(null);
      setQuery(nodeMatch[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setQuery("");
      setActiveNode(null);
    }

    // Update handles
    const vars = extractVariables(value);
    setVariables(vars);
    data.variables = vars;
  };

  const insertNode = (nodeName) => {
    const textarea = textareaRef.current;
    const cursor = textarea.selectionStart;

    const before = text.slice(0, cursor).replace(/{{\s*[\w]*$/, "");
    const after = text.slice(cursor);

    // IMPORTANT: no dot here
    const variable = `{{${nodeName}`;

    const updatedText = before + variable + after;
    setText(updatedText);
    data.text = updatedText;

    setShowSuggestions(false);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        before.length + variable.length;
    });
  };

  const insertField = (field) => {
    const textarea = textareaRef.current;
    const cursor = textarea.selectionStart;

    const before = text
      .slice(0, cursor)
      .replace(/{{\s*[\w]+\.\s*[\w]*$/, "");

    const after = text.slice(cursor);

    // ✅ NEW (correct – no closing braces)
    const variable = `{{${activeNode}.${field}`;

    const updatedText = before + variable + after;
    setText(updatedText);
    data.text = updatedText;

    setShowSuggestions(false);
    setActiveNode(null);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        before.length + variable.length;
    });
  };

  // Create dynamic handles
  const variableHandles = variables.map((v) => ({
    type: "target",
    position: "left",
    id: `${id}-${v}`,
  }));

  return (
    <BaseNode
      title="Text"
      variant="text"
      handles={[
        ...variableHandles,
        {
          type: "source",
          position: "right",
          id: `${id}-output`,
        },
      ]}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Type text… use {{ to insert variables"
        style={{
          resize: "none",
          width: "100%",
          minHeight: "60px",
        }}
      />

      {showSuggestions && (
        <div className="variable-suggestions">
          {mode === "node" &&
            inputNodes
              .filter((n) =>
                n.data?.name?.toLowerCase().includes(query.toLowerCase())
              )
              .map((node) => (
                <div
                  key={node.id}
                  className="variable-suggestion"
                  onClick={() => insertNode(node.data.name)}
                >
                  {node.data.name}
                </div>
              ))}

          {mode === "field" &&
            ["text"].map((field) => (
              <div
                key={field}
                className="variable-suggestion"
                onClick={() => insertField(field)}
              >
                {field}
              </div>
            ))}
        </div>
      )}
    </BaseNode>
  );
};
