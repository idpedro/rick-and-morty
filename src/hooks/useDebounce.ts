import { useEffect, useState } from "react";
export const useDebounce = (state: any, delay: number) => {
  const [debouncedstate, setDebouncedstate] = useState(state);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedstate(state);
    }, delay);
    return () => {
      clearTimeout(timeOut);
    };
  }, [state, delay]);
  return debouncedstate;
};
