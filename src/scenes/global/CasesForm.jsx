import { useLoaderData, Form, useActionData, useSubmit, useRouteLoaderData, useOutletContext } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import { createContext, useRef } from "react";
import CaseIndexView from "../../components/cases/CaseIndexView";
import CasesSaveButton from "../../components/buttons/CasesSaveButton";
import { Stack } from "@mui/material";
import Header from "../../components/Header";

export const CaseFormContext = createContext();

function CasesForm({ displayOnly = false }) {
  const { user, payroll } = useRouteLoaderData("root");
  const title = useOutletContext();
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
    <Stack useFlexGap direction="row">
      <Stack sx={{flex: 1}} p={4}>
          <Header title={title} />
          <CaseFormContext.Provider value={{ buildCase, displayOnly, attachments: attachments.current }}>
            <Form method="post" ref={formRef} id="case_form">
              {caseData && <CaseComponent _case={caseData} />}
              {submitButton}
            </Form>
          </CaseFormContext.Provider>
      </Stack>
      <CaseIndexView _case={caseData} />
    </Stack>
  )
 
}

export default CasesForm;
