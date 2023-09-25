import { useLoaderData, Form, useActionData, useSubmit, useRouteLoaderData, useOutletContext } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import { createContext, useRef } from "react";
import CaseIndexView from "../../components/cases/CaseIndexView";
import { CaseFormButtons } from "../../components/buttons/CaseFormButtons";
import { Container, Stack, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";

export const CaseFormContext = createContext();

function CasesForm({ defaultTitle, displayOnly = false }) {
  const { user, payroll } = useRouteLoaderData("root");
  const title = useOutletContext() || defaultTitle;
  const loaderData = useLoaderData();
  const actionData = useActionData(); 
  const caseData = actionData || loaderData;

  const formRef = useRef();
  const attachments = useRef({});
  const submit = useSubmit();
  const theme = useTheme();
  // this breakpoint was chosen because at this point the datefields + input field
  // don't have enough space
  const hideIndex = useMediaQuery(theme.breakpoints.down("md"));

  const action = (intent, attachments = {}) => {
    const submitData = { caseData, intent, attachments, userId: user.id, divisionId: payroll.divisionId };
    submit(submitData, { method: "post", encType: "application/json" });
  }
  const buildCase = () => action("buildCase");
  const handleSubmit = () => {
    if (formRef?.current?.reportValidity()) {
      action("addCase", attachments.current);
    }
  }

  const buttons = !displayOnly && <CaseFormButtons onSubmit={handleSubmit} />;

  return (
    <Stack useFlexGap direction="row">
      <Stack sx={{flex: 1}} p={4}>
        <Container maxWidth="lg" sx={{p: 0}}>
          <Header title={title} />
          <CaseFormContext.Provider value={{ buildCase, displayOnly, attachments: attachments.current }}>
            <Form method="post" ref={formRef} id="case_form">
              <Stack alignItems="flex-end" spacing={4}>
                {caseData && <CaseComponent _case={caseData} />}
                {buttons}
              </Stack>
            </Form>
          </CaseFormContext.Provider>
        </Container>
      </Stack>
      { !hideIndex && <CaseIndexView _case={caseData} /> }
    </Stack>
  )
 
}

export default CasesForm;
