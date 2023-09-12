import { useState, useEffect, useMemo, useLayoutEffect } from "react";

function collectCaseNames(caseData) {
  if (caseData.relatedCases) {
    const relatedCaseNames = caseData.relatedCases.flatMap(c => collectCaseNames(c));
    return [caseData.name, ...relatedCaseNames];
  }
  return [caseData.name];
}

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

export default function useActiveCase(caseData) {
  const [activeCase, setActiveCase] = useState(caseData.name);
  const [caseHeaders, setCaseHeaders] = useState([]);
  const headerNames = collectCaseNames(caseData);

  const scrollAndSetActive = async (caseName) => {
    const header = caseHeaders.find(h => h.name === caseName);
    if (header) {
      const caseForm = document.querySelector(".main");
      await scrollToAsync(caseForm, header.top);
      setActiveCase(caseName);
    }
  }
  useLayoutEffect(() => {
    const headers = Array.from(document
      .querySelectorAll('div[data-header-observable="true"]'))
      .map(e => ({name: e.id, top: e.offsetTop}))
      .toSorted((a, b) => a.top < b.top)
    setCaseHeaders(headers);
  }, [JSON.stringify(headerNames)]);

  useEffect(() => {
    const caseForm = document.querySelector(".main");
    const onScroll = (event) => {
      const scrollTop = event.currentTarget.scrollTop;
      for (const header of caseHeaders) {
        if (scrollTop >= header.top) {
          setActiveCase(header.name);
        }
      }
    }

    caseForm.addEventListener("scroll", onScroll);
    return () => {
      caseForm.removeEventListener("scroll", onScroll);
    }
  }, [caseHeaders])

  return { activeCase, scrollAndSetActive };
}