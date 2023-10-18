import { useParams, useRouteLoaderData, useOutletContext, useAsyncValue } from "react-router-dom";
import { CaseComponent } from "../../components/case/CaseComponent";
import CaseIndexView from "../../components/cases/CaseIndexView";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { ErrorView } from "../../components/ErrorView";
import { ReadonlyFieldComponent } from "../../components/case/field/ReadonlyFieldComponent";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../../components/ContentLayout";
import { useTranslation } from "react-i18next";

export function AsyncCaseDisplay() {
  const title = useOutletContext() || "Data";
  const loading = <ContentLayout title={title}><Loading /></ContentLayout>
  return <AsyncDataRoute loadingElement={loading} skipDataCheck><CaseDisplay title={title} /></AsyncDataRoute>
}

function CaseDisplay({ title }) {
  const caseName = useCaseName();
  const { t } = useTranslation();
  if (!caseName) {
    return (
      <ContentLayout title={title} sx={{flex: 1}}>
        <Typography>{t("No data available")}</Typography>
      </ContentLayout>
    );
  }

  const { user, payroll } = useRouteLoaderData("root");
  const params = useParams();
  const caseDataParams = {caseName, ...params};
  const { caseData, fatalError, caseErrors, loading } = useCaseData(caseDataParams, user, payroll);
  
  const theme = useTheme();
  // this breakpoint was chosen because at this point the datefields + input field
  // don't have enough space
  const hideIndex = useMediaQuery(theme.breakpoints.down("md"));
  
  let content = null;
  if (fatalError || !!caseErrors.length) {
    content = <ErrorView error={fatalError} />
  } else if (loading) {
    content = <Loading />;
  } else {
    content = <Stack alignItems="stretch" spacing={4}>
      {caseData && <CaseComponent _case={caseData} FieldRenderComponent={ReadonlyFieldComponent} />}
    </Stack>
  }

  return (
    <Stack direction="row" minHeight="100%">
      <ContentLayout title={title}>
        {content}
      </ContentLayout>
      { !hideIndex && caseData && <CaseIndexView _case={caseData} /> }
    </Stack>
  )
}

function useCaseName() {
  const cases = useAsyncValue();
  if (cases && cases.length > 0) {
    return cases[0].name;
  }
  return null;
}
