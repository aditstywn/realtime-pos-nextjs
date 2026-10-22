import { useRef } from "react";

export default function useDebounce() {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debounce = (funct: () => void, delay: number) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      funct();
      debounceTimeout.current = null;
    }, delay);
  };

  return { debounce };
}
