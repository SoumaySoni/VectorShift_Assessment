import { renderHook } from "@testing-library/react";
import { useAutoResizeTextarea } from "../useAutoResizeTextarea";

it("resizes textarea based on content", () => {
    const textarea = document.createElement("textarea");
    Object.defineProperty(textarea, "scrollHeight", {
        value: 200,
    });

    const ref = { current: textarea };

    renderHook(() =>
        useAutoResizeTextarea(ref, "some text")
    );

    expect(textarea.style.height).toBe("200px");
});
