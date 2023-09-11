import { useLoaderData, Form, useActionData, useSubmit, useRouteLoaderData } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import { createContext, useRef } from "react";
import CaseIndexView from "../../components/cases/CaseIndexView";
import CasesSaveButton from "../../components/buttons/CasesSaveButton";
import { Stack, Box } from "@mui/material";

export const CaseFormContext = createContext();

function CasesForm({ displayOnly = false }) {
  const { user, payroll } = useRouteLoaderData("root");
  const loaderData = useLoaderData();
  const actionData = useActionData(); 
  const caseData = actionData || loaderData;

  const formRef = useRef();
  const attachments = useRef({});
  const submit = useSubmit();

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

  const submitButton = !displayOnly && <CasesSaveButton onSubmit={handleSubmit} />;

  return (
    <CaseFormContext.Provider value={{ buildCase, displayOnly, attachments: attachments.current }}>
      <Stack
        useFlexGap
        direction="row"
      >
        <Box sx={{flex: 1, position: 'relative'}}>
          <Form method="post" ref={formRef} id="case_form">
            {caseData && <CaseComponent _case={caseData} />}
          </Form>
        </Box>
        <CaseIndexView _case={caseData}>
          {submitButton}
        </CaseIndexView>
      </Stack>
    </CaseFormContext.Provider>
  )
 
}

export default CasesForm;
