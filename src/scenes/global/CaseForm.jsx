import { Form, useParams, useRouteLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import { CaseComponent } from "../../components/case/CaseComponent";
import { createContext, useRef } from "react";
import CaseIndexView from "../../components/cases/CaseIndexView";
import { CaseFormButtons } from "../../components/buttons/CaseFormButtons";
import { Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { CaseErrorComponent } from "../../components/case/CaseErrorComponent";
import { ErrorView } from "../../components/ErrorView";
import { EditFieldComponent } from "../../components/case/field/EditFieldComponent";
import { ContentLayout } from "../../components/ContentLayout";

export const CaseFormContext = createContext();

export function Component() {
  const title = useOutletContext() || "New event";
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
      addCase(() => navigate("../events"));
    }
  }

  let content = null;
  if (fatalError) {
    content = <ErrorView error={fatalError} />
  } else if (loading) {
    content = <Loading />;
  } else {
    content = <CaseFormContext.Provider value={{ buildCase, attachments }}>
      <Form method="post" ref={formRef} id="case_form">
      <Stack alignItems="stretch" spacing={4}>
        {caseData && <CaseComponent _case={caseData} FieldRenderComponent={EditFieldComponent} />}
        <CaseErrorComponent errors={caseErrors} />
        <CaseFormButtons onSubmit={handleSubmit} />
      </Stack>    
      </Form>
    </CaseFormContext.Provider>
  }

  return (
    <Stack direction="row" minHeight="100%">
      <ContentLayout defaultTitle={title} sx={{flex: 1}}>
        {content}
      </ContentLayout>
      { !hideIndex && caseData && <CaseIndexView _case={caseData} /> }
    </Stack>
  )
 
}