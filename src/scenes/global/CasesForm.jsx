import { Form, useParams, useRouteLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import { createContext, useRef } from "react";
import CaseIndexView from "../../components/cases/CaseIndexView";
import { CaseFormButtons } from "../../components/buttons/CaseFormButtons";
import { Stack, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { CaseErrorComponent } from "../../components/case/CaseErrorComponent";
import { ErrorView } from "../../components/ErrorView";
import { useTranslation } from "react-i18next";

export const CaseFormContext = createContext();

export function CaseForm({ defaultTitle, displayOnly = false }) {
  const { t } = useTranslation();
  const title = useOutletContext() || defaultTitle;
  const navigate = useNavigate();
  const { user, payroll } = useRouteLoaderData("root");
  const params = useParams();
  const { caseData, caseErrors, fatalError, attachments, loading, buildCase, addCase } = useCaseData(params, user, payroll);
  const formRef = useRef();
  

  const theme = useTheme();
  // this breakpoint was chosen because at this point the datefields + input field
  // don't have enough space
  const hideIndex = useMediaQuery(theme.breakpoints.down("md"));
  
  const handleSubmit = () => {
    if (formRef?.current?.reportValidity()) {
      addCase(() => navigate(".."));
    }
  }

  let content = null;
  if (fatalError) {
    content = <ErrorView error={fatalError} />
  } else if (loading) {
    content = <Loading />;
  } else {
    content = <CaseFormContext.Provider value={{ buildCase, displayOnly, attachments }}>
      <Form method="post" ref={formRef} id="case_form">
      <Stack alignItems="stretch" spacing={4}>
        {caseData && <CaseComponent _case={caseData} />}
        <CaseErrorComponent errors={caseErrors} />
        {!displayOnly && <CaseFormButtons onSubmit={handleSubmit} />}
      </Stack>    
      </Form>
    </CaseFormContext.Provider>
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