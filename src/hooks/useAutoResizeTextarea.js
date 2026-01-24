import { useEffect } from "react";

export const useAutoResizeTextarea = (ref, value) => {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);
};
