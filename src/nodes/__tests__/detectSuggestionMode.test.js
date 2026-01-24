import { detectSuggestionMode } from "../textNode";

describe("detectSuggestionMode", () => {
    it("detects node mode when typing {{", () => {
        const result = detectSuggestionMode("Hello {{", 8);
        expect(result).toEqual({ mode: "node", activeNode: null });
    });

    it("detects field mode when typing {{input.", () => {
        const result = detectSuggestionMode("{{input.", 8);
        expect(result).toEqual({ mode: "field", activeNode: "input" });
    });

    it("returns null when not in variable context", () => {
        const result = detectSuggestionMode("Hello world", 5);
        expect(result).toBeNull();
    });
});
