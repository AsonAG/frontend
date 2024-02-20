import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getScrollContainer } from "../hooks/useActiveCase";
export function ScrollToTop() {
  const { search } = useLocation();
  
  useEffect(() => {
    getScrollContainer()?.scrollTo(0, 0);
  }, [search]);

  return null;
}