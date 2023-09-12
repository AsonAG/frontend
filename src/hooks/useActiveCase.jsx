import { useState, useEffect } from "react";

function scrollToAsync(element, offset) {
  return new Promise(res => {
    const onScrollPromise = function() {
      res();
      element.removeEventListener('scroll', onScrollPromise);
    };

    element.addEventListener('scroll', onScrollPromise);
    const scrollTop = element.scrollTop;
    element.scrollTop = offset;
    if (scrollTop === element.scrollTop) {
      // we already are at the bottom
      element.removeEventListener('scroll', onScrollPromise);
      res();
    }
  })
}

function getCaseForm() {return document.querySelector(".main");}

export default function useActiveCase(caseData) {
  const [activeCase, setActiveCase] = useState(caseData.name);

  const scrollAndSetActive = async (caseName) => {
    const element = document.getElementById(caseName);
    if (element) {
      await scrollToAsync(getCaseForm(), element.offsetTop);
      setActiveCase(caseName);
    }
  }

  useEffect(() => {
    const caseForm = getCaseForm();
    const onScroll = (event) => {
      const headers = Array.from(document
        .querySelectorAll('div[data-header-jump-anchor="true"]'))
        .map(e => ({name: e.id, top: e.offsetTop}))
        .toSorted((a, b) => a.top < b.top);
      const scrollTop = event.currentTarget.scrollTop;
      for (const header of headers) {
        if (scrollTop >= header.top) {
          setActiveCase(header.name);
        }
      }
    }

    caseForm.addEventListener("scroll", onScroll);
    return () => {
      caseForm.removeEventListener("scroll", onScroll);
    }
  }, [])

  return { activeCase, scrollAndSetActive };
}