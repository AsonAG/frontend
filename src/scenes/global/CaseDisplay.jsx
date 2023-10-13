import { useParams, useRouteLoaderData, useOutletContext, useAsyncValue } from "react-router-dom";
import { CaseComponent } from "../../components/case/CaseComponent";
import CaseIndexView from "../../components/cases/CaseIndexView";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { ErrorView } from "../../components/ErrorView";
import { useTranslation } from "react-i18next";
import { ReadonlyFieldComponent } from "../../components/case/field/ReadonlyFieldComponent";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";

export function AsyncCaseDisplay() {
  return <AsyncDataRoute><CaseDisplay defaultTitle="Data" /></AsyncDataRoute>
}

function CaseDisplay({ defaultTitle }) {
  const caseName = useCaseName();
  const title = useOutletContext() || defaultTitle;
  if (!caseName) return <NoDataView title={title} />;

  const { t } = useTranslation();
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
      <Stack sx={{flex: 1}} px={{xs: 4, sm: 1, lg: 4}} py={4}>
        <Header title={t(title)} />
        {content}
      </Stack>
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

function NoDataView({ title }) {
  const { t } = useTranslation();
  return (
    <Stack sx={{flex: 1}} px={{xs: 4, sm: 1, lg: 4}} py={4}>
      <Header title={t(title)} />
      <Typography>{t("No data available.")}</Typography>
    </Stack>
  )
}