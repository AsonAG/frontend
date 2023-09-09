import { Box } from "@mui/material";
import { useLoaderData, Form, useActionData, useSubmit, useRouteLoaderData } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import CasesFormWrapper from "../../components/cases/CasesFormWrapper";
import { createContext } from "react";

export const CaseFormContext = createContext();

function CasesForm({ displayOnly = false }) {
  const { user, payroll } = useRouteLoaderData("root");
  const loaderData = useLoaderData();
  const actionData = useActionData(); 
  const caseData = actionData || loaderData;
  console.log(payroll);

  const submit = useSubmit();

  const action = (intent) => {
    const submitData = { caseData, intent, userId: user.id, divisionId: payroll.divisionId };
    submit(submitData, { method: "post", encType: "application/json" });
  }
  const buildCase = () => action("buildCase");
  const handleSubmit = () => action("addCase");

  return (
    <CaseFormContext.Provider value={{ buildCase, displayOnly }}>
      <CasesFormWrapper
        // title to the right ( was employee name )
        title="Testing"
        onSubmit={handleSubmit}
        inputCase={caseData}
        outputCase={caseData}
      >
      <Form method="post">
        <Box>
          {caseData && <CaseComponent _case={caseData} />}
        </Box>
      </Form>
    </CasesFormWrapper>
  </CaseFormContext.Provider>
  )
 
}

export default CasesForm;
