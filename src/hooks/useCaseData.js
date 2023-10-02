import { useRef, useState, useEffect } from 'react';
import { buildCase, addCase } from '../api/FetchClient';


function mapCase(_case, attachments) {
  return {
    caseName: _case.name,
    values: _case.fields.map(f => ({
      caseName: _case.name,
      caseFieldName: f.name,
      value: f.value,
      start: f.start,
      end: f.end,
      documents: attachments[f.id]
    })),
    relatedCases: _case.relatedCases.map(c => mapCase(c, attachments))
  };
}

export function useCaseData(params, user, payroll) {
    const attachments = useRef({});
    const [caseData, setCaseData] = useState(null);
    const [caseErrors, setCaseErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fatalError, setFatalError] = useState(null);

    useEffect(() => {
      const loadData = async () => {
        await _buildCase();
        setLoading(false);
      };
      loadData();
    }, []);

    function getCaseChangeSetup() {
      if (!caseData) {
        return null;
      }
      const caseChangeSetup = {
        userId: user.id,
        divisionId: payroll.divisionId,
        case: mapCase(caseData, attachments)
      }
      if (params.employeeId) {
        caseChangeSetup.employeeId = Number(params.employeeId);
      }
      return caseChangeSetup;
    }

    async function handleError(caseResponse) {
      const response = await caseResponse.json();
      if (caseResponse.status >= 400 && caseResponse.status < 500) {
        if (typeof response === "string") {
          setCaseErrors([response]);
        } else {
          setCaseErrors(response.errors.Case);
        }
      }
      else {
        setFatalError(new Error(response))
      }
    }

    async function _buildCase() {
      // setFatalError(new Error("Oops"));
      // return;
      const caseResponse = await buildCase(params, getCaseChangeSetup());
      if (caseResponse.ok) {
        setCaseData(await caseResponse.json());
        setCaseErrors([]);
      } else {
        handleError(caseResponse);
      }
    }

    async function _addCase(onCaseAdded) {
      const caseResponse = await addCase(params, getCaseChangeSetup());
      if (caseResponse.ok) {
        const newCase = await caseResponse.json();
        onCaseAdded(newCase);
        return;
      }
      else {
        handleError(caseResponse);
      }
    }

    

    return { caseData, caseErrors, fatalError, attachments, loading, buildCase: _buildCase, addCase: _addCase };
}