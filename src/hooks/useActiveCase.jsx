import { useState, useEffect } from "react";
import { getMainCaseObject } from "../api/CasesApi";
import { getOutputCaseKey } from "../components/case/CaseComponent";
import { useUpdateEffect } from "usehooks-ts";

// returns a key of the case that is visible in the current viewport
export default function useActiveCase(outputCase, setActiveCaseKey) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (event) => {
    setScrollPosition(event.currentTarget.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useUpdateEffect(() => {
    if (getMainCaseObject(outputCase)) {
      iterateThroughCases(outputCase, checkIsCaseActive, setActiveCaseKey);
    }
  }, [outputCase, scrollPosition]);

  const iterateThroughCases = (cases, func, setterFunc) => {
        // TODO: add logic to iterate based on InputCase, not Output
        //   if (getMainCaseObject(outputCase)) {
        //     let outputRelatedCases = getMainCaseObject(outputCase).relatedCases;
      
        //     inputCase?.relatedCases?.every((schemaRelatedCase, id) => {
        //       const key = getCaseKey(schemaRelatedCase);
    for (const caseObj of Object.values(cases)) {
      if (func(caseObj, setterFunc)) return true;
      if (caseObj.relatedCases) {
        if (iterateThroughCases(caseObj.relatedCases, func, setterFunc))
          return true;
      }
    }
  };

  const checkIsCaseActive = (_case, setterFunc) => {
    try {
      if (
        scrollPosition + 20 < _case?.ref?.current.offsetTop &&
        scrollPosition + window.innerHeight > _case?.ref?.current.offsetTop
      ) {
        const activeCase = _case;
        const activeCaseKey = getOutputCaseKey(activeCase);
        setterFunc(activeCaseKey);
        return true;
      }
    } catch (error) {
      console.warn(JSON.stringify(error));
    }
  };
  return handleScroll;
}

const getCaseByKey = (cases, key) => {
  for (const [caseKey, caseObj] of Object.entries(cases)) {
    if (caseKey === key) return caseObj;
    else if (Object.hasOwnProperty.call(caseObj.relatedCases, key))
      return caseObj.relatedCases[key];
    else {
      const relSearchResults = getCaseByKey(caseObj.relatedCases, key);
      if (relSearchResults) return relSearchResults;
    }
  }
};
