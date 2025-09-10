import { useEffect } from "react";
import { useBlocker } from "react-router";

export function useConfirmNavigation(shouldBlock: boolean) {
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(
        `¿Seguro que querés ir a ${blocker.location.pathname}?`,
      );
      if (confirmLeave) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker.state, blocker.location]);

  return blocker;
}
