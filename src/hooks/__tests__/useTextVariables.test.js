import { renderHook, act } from "@testing-library/react";
import { useTextVariables } from "../useTextVariables";

describe("useTextVariables", () => {
    it("blocks removal if variable is connected", () => {
        const onBlockedRemove = jest.fn();

        const edges = [
            { targetHandle: "text-1-input" }
        ];

        const { rerender } = renderHook(
            ({ text }) =>
                useTextVariables({
                    text,
                    nodeId: "text-1",
                    edges,
                    setEdges: jest.fn(),
                    onBlockedRemove,
                }),
            {
                initialProps: {
                    text: "{{input.text}}",
                },
            }
        );

        // simulate deletion
        act(() => {
            rerender({ text: "" });
        });

        expect(onBlockedRemove).toHaveBeenCalledWith("input");
    });
});
 