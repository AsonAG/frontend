import { Stack, Button, CircularProgress, ButtonGroup, Paper, ClickAwayListener, MenuList, MenuItem, Grow, Popper } from "@mui/material";
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
import { useAtomValue } from "jotai";
import { userAtom } from "../utils/dataAtoms";
import { ArrowDropDown } from "@mui/icons-material";


export function AsyncReportView() {
  const user = useAtomValue(userAtom);
  const params = useParams();
  const { state } = useLocation();
  const [reportFile, setReportFile] = useState<Promise<ReportFile> | null>(null);
  const { reportData, loading, isGenerating, buildReport, generateReport } = useReportBuilder(
    {
      tenantId: params.tenantId!,
      payrollId: params.payrollId!,
      reportId: params.reportId!,
      user: user,
      onReportGenerated: file => setReportFile(Promise.resolve(file))
    }
  );
  
  
  const { t } = useTranslation();

  if (loading) {
    const reportName = state?.reportName ? state.reportName : t("Loading...");
    return <ContentLayout title={reportName}><Loading /></ContentLayout>;
  }
  return (
    <ContentLayout title={reportData.displayName}>
      <Stack spacing={2}>
        <CaseFormContext.Provider value={{buildCase: buildReport}}>
          {
            reportData.parameters.map(p => (
              <FieldContext.Provider value={{field: p, displayName: p.displayName, required: p.mandatory, buildCase: buildReport}}>
                <EditFieldValueComponent key={p.id} />
              </FieldContext.Provider>
            ))
          }
        </CaseFormContext.Provider>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="end">
        <Button component={Link} to="..">{t("Back")}</Button>
        <GenerateButton generate={generateReport} isGenerating={isGenerating}/>
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
  reportId: string,
  user: {id: number, language: string},
  onReportGenerated: (file: ReportFile) => void
}

type DocumentFormat = "pdf" | "word" | "excel" | "xml" | "xmlraw";

function useReportBuilder({tenantId, payrollId, reportId, user, onReportGenerated}: ReportBuilderParams) {

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setGenerating] = useState(false);

  function getReportRequest() {
    const reportRequest = {
      "language": user.language,
      "userId": user.id,
      "parameters": {}
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

  }, [tenantId, payrollId, reportId, user.id]);


  async function _buildReport(signal?: AbortSignal) {
    const reportResponse = await getReport({tenantId, payrollId, reportId}, getReportRequest(), signal);
    if (reportResponse.ok && !signal?.aborted) {
      const report = await reportResponse.json();
      processReportParameters(report.parameters);
      setReportData(report);
    }
  }

  async function _generateReport(format: DocumentFormat) {
    try {
      setGenerating(true);
      const reportResponse = await generateReport({tenantId, payrollId, reportId}, getReportRequest(), format);
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

function GenerateButton({generate, isGenerating}: {generate: (format: DocumentFormat) => void, isGenerating: boolean}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { t } = useTranslation();

  const handleMenuItemClick = (format: DocumentFormat) => {
    generate(format);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const icon = isGenerating ? <CircularProgress size="1em" sx={{color: "common.white"}} /> : null;

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" disabled={isGenerating}>
        <Button onClick={() => generate('pdf')} startIcon={icon}>{t("Create PDF")}</Button>
        <Button
          size="small"
          onClick={handleToggle}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  <MenuItem onClick={() => handleMenuItemClick("word")}>{t("Create Word")}</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("excel")}>{t("Create Excel")}</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("xml")}>{t("Create XML")}</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("xmlraw")}>{t("Create XML Raw")}</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}