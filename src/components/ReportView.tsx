import { Stack, Button, CircularProgress } from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { Loading } from "./Loading";
import { useTranslation } from "react-i18next";
import { useLocation, Link, useParams } from "react-router-dom";
import { FieldContext } from "./case/field/EditFieldComponent";
import { CaseFormContext } from "../scenes/global/CaseForm";
import { EditFieldValueComponent } from "./case/field/value/EditFieldValueComponent";
import React, { useEffect, useState } from "react";
import { generateReport, getReport } from "../api/FetchClient";
import dayjs from "dayjs";
import { DocumentDialog } from "./DocumentDialog";


export function AsyncReportView() {
  const params = useParams();
  const { state } = useLocation();
  const [reportFile, setReportFile] = useState<Promise<ReportFile> | null>(null);
  const { reportData, loading, isGenerating, buildReport, generateReport } = useReportBuilder(
    {
      tenantId: params.tenantId!,
      payrollId: params.payrollId!,
      regulationId: params.regulationId!,
      reportId: params.reportId!,
      userId: "805",
      onReportGenerated: file => setReportFile(Promise.resolve(file))
    }
  );
  
  
  const { t } = useTranslation();

  if (loading) {
    const reportName = state?.reportName ? state.reportName : t("Loading...");
    return <ContentLayout title={reportName}><Loading /></ContentLayout>;
  }
  const icon = isGenerating ? <CircularProgress size="1em" sx={{color: "common.white"}} /> : null;
  return (
    <ContentLayout title={reportData.displayName}>
      <Stack spacing={2}>
        <CaseFormContext.Provider value={{buildCase: buildReport}}>
          {
            reportData.parameters.map(p => (
              <FieldContext.Provider value={{field: p, displayName: p.displayName, required: p.mandatory, buildCase: buildReport}}>
                <EditFieldValueComponent />
              </FieldContext.Provider>
            ))
          }
        </CaseFormContext.Provider>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="end">
        <Button component={Link} to="..">{t("Back")}</Button>
        <Button variant="contained" disabled={isGenerating} onClick={generateReport} startIcon={icon}>{t("Create")}</Button>
      </Stack>
      {reportFile && <DocumentDialog documentPromise={reportFile} onClose={() => setReportFile(null)}/> }
    </ContentLayout>
  );
}

type ReportFile = {
  name: string,
  content: string,
  contentType: string
};

interface ReportBuilderParams {
  tenantId: string,
  payrollId: string
  regulationId: string,
  reportId: string,
  userId: string,
  onReportGenerated: (file: ReportFile) => void
}

function useReportBuilder({tenantId, payrollId, regulationId, reportId, userId, onReportGenerated}: ReportBuilderParams) {

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setGenerating] = useState(false);

  function getReportRequest() {
    const reportRequest = {
      "language": "English",
      "userId": userId,
      "payrollId": payrollId,
      "parameters": {
        "RegulationId": regulationId,
        "Language": "German"
      }
    };

    if (reportData?.parameters) {
      for(const parameter of reportData.parameters) {
        if (parameter.attributes["input.hidden"])
          continue;

        reportRequest.parameters[parameter.name] = parameter.value;
      }
    }
    return reportRequest;
  }


  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        await _buildReport(controller.signal);
        setLoading(false);
      }
      catch (e) {
      }
    };
    loadData();

    return () => controller.abort();

  }, [tenantId, payrollId, regulationId, reportId, userId]);


  async function _buildReport(signal?: AbortSignal) {
    const reportResponse = await getReport({tenantId, payrollId, regulationId, reportId}, getReportRequest(), signal);
    if (reportResponse.ok && !signal?.aborted) {
      const report = await reportResponse.json();
      processReportParameters(report.parameters);
      setReportData(report);
    }
  }

  async function _generateReport() {
    try {
      setGenerating(true);
      const reportResponse = await generateReport({tenantId, payrollId, regulationId, reportId}, getReportRequest());
      if (reportResponse.ok) {
        const report = await reportResponse.json();
        onReportGenerated(report);
        return;
      }
    }
    finally {
      setGenerating(false);
    }
  }

  return {
    reportData,
    loading,
    isGenerating,
    buildReport: _buildReport,
    generateReport: _generateReport
  }
}

function processReportParameters(parameters) {

  for(const parameter of parameters) {
    if (parameter.valueType === "Date") {
      if (parameter.value === "today") {
        parameter.value = dayjs().utc().startOf('day').toISOString();
      }
    }
    if (parameter.valueType === "String") {
      if (parameter.attributes["input.listSelection"]) {
        const listSelection = JSON.parse(parameter.attributes["input.listSelection"]);
        parameter.attributes["input.list"] = listSelection["dictionary"];
        if (!parameter.value) {
          parameter.value = listSelection["dictionary"][listSelection.selected];
        }
        parameter.attributes["input.disableClear"] = true;
      }
    }
    if (parameter.attributes["lookupSettings"]) {
      parameter.lookupSettings = parameter.attributes["lookupSettings"];
    }
  }
}