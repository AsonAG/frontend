import { useLayoutEffect, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useActiveCase() {
  const [activeCase, setActiveCase] = useState('');

  useEffect(() => {
    const caseForm = document.querySelector(".main");

    const headers = Array.from(document
      .querySelectorAll('div[data-header-observable="true"]'))
      .map(e => ({name: e.id, top: e.offsetTop}))
      .toSorted((a, b) => a.top < b.top);

    const onScroll = (event) => {
      const scrollTop = event.currentTarget.scrollTop;
      for (const header of headers) {
        if (scrollTop >= header.top) {
          console.log("onscroll: setting active case");
          setActiveCase(header.name);
        }
      }
    }

    caseForm.addEventListener("scroll", onScroll);

    return () => {
      caseForm.removeEventListener("scroll", onScroll);
    }
  }, [])

  const { pathName, hash, key } = useLocation();

  useLayoutEffect(() => {
    if (hash === '')
      return;
    const id = decodeURIComponent(hash.replace("#", ''));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
      console.log("click: setting active case");
      setActiveCase(id);
    };
  }, [pathName, hash, key]);

  return activeCase;
}