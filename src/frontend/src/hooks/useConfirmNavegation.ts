import { useEffect } from "react";
import { useBlocker } from "react-router";

export function useConfirmNavigation(
  shouldBlock: boolean,
  message: string,
  onBlock?: (() => void) | null,
) {
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(message);
      if (confirmLeave) {
        if (onBlock) onBlock();

        blocker.proceed();
      } else blocker.reset();
    }
  }, [blocker.state, blocker.location]);

  return blocker;
}
