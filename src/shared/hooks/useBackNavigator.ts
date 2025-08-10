import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const useBackNavigator = (
  isChanged: boolean,
  handleModalOn: () => void,
  newPath: string,
  isConfirmed?: boolean,
) => {
  const router = useRouter();
  const initialized = useRef(false);

  const memoizedHandleModalOn = useCallback(() => {
    handleModalOn();
  }, [handleModalOn]);

  const handleBeforeunload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isChanged && !isConfirmed) {
        e.preventDefault();
      }
    },
    [isChanged, isConfirmed],
  );

  const handlePopState = useCallback(() => {
    if (isChanged && !isConfirmed) {
      memoizedHandleModalOn();
    } else {
      router.push(newPath);
    }
  }, [isChanged, isConfirmed, memoizedHandleModalOn, newPath, router]);

  useEffect(() => {
    if (!initialized.current) {
      window.history.pushState(null, "", window.location.href);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isConfirmed) {
      window.addEventListener("beforeunload", handleBeforeunload);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isConfirmed, handleBeforeunload, handlePopState]);

  useEffect(() => {
    if (isConfirmed) {
      router.push(newPath);
    }
  }, [isConfirmed, newPath, router]);
};

export default useBackNavigator;
