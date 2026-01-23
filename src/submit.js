// submit.js

import axios from "axios";
import { useStore } from "./store";

/**
 * Function that sends pipeline data to backend
 */
export const submitPipeline = async () => {
  const { nodes, edges } = useStore.getState();

  try {
    const response = await axios.post(
      "http://localhost:8000/pipelines/parse",
      {
        nodes: nodes.map((node) => ({
          id: node.id,
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { num_nodes, num_edges, is_dag } = response.data;

    alert(
      `✅ Pipeline Parsed Successfully\n\n` +
        `Total Nodes: ${num_nodes}\n` +
        `Total Edges: ${num_edges}\n` +
        `Is DAG: ${is_dag ? "Yes" : "No"}`
    );
  } catch (error) {
    console.error("Pipeline submit failed:", error);
    alert("❌ Failed to submit pipeline");
  }
};

/**
 * Submit button component
 */
export const SubmitButton = () => {
  return (
    <button
      onClick={submitPipeline}
      style={{
        padding: "10px 16px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      Submit Pipeline
    </button>
  );
};
