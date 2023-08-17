import { useState, useEffect } from "react";
import { getMainCaseObject } from "../api/CasesApi";
import { getOutputCaseKey } from "../components/case/CaseComponent";

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

  useEffect(() => {
    if (getMainCaseObject(outputCase)) {
      iterateThroughCases(outputCase, checkIsCaseActive, setActiveCaseKey);
    }
  }, [scrollPosition]);

  const iterateThroughCases = (cases, func, setterFunc) => {
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
        scrollPosition < _case?.ref?.current.offsetTop &&
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

  //   if (getMainCaseObject(outputCase)) {
  //     let outputRelatedCases = getMainCaseObject(outputCase).relatedCases;

  //     inputCase?.relatedCases?.every((schemaRelatedCase, id) => {
  //       const key = getCaseKey(schemaRelatedCase);
  //       if (Object.hasOwnProperty.call(outputRelatedCases, key)) {
  //         const relatedCase = outputRelatedCases[key];
  //         checkRelationToScreenPosition(relatedCase, key);
  //       }
  //       return true;
  //     });
  //   }

  return handleScroll;
}

const getCaseByKey = (cases, key) => {
  //   if (!Object.keys(outputCase)) return null;

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
