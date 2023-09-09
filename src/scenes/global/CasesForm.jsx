import { Box } from "@mui/material";
import { useLoaderData, Form, useActionData, useSubmit } from "react-router-dom";
import CaseComponent from "../../components/case/CaseComponent";
import CasesFormWrapper from "../../components/cases/CasesFormWrapper";
import { createContext } from "react";

export const CaseFormContext = createContext();

function CasesForm({ displayOnly = false }) {
  const loaderData = useLoaderData();
  const actionData = useActionData(); 
  const caseData = actionData || loaderData;

  const submit = useSubmit();

  const buildCase = () => {
    submit(caseData, { method: "post", encType: "application/json"});
  }

  const handleSubmit = () => {};

  return (
    <CaseFormContext.Provider value={{ buildCase, displayOnly }}>

      {
        // TODO fix cases form wrappre
      /* <CasesFormWrapper
        // title to the right ( was employee name )
        title="Testing"
        onSubmit={handleSubmit}
        inputCase={caseData}
        outputCase={caseData}
      > */}
      <Form method="post">
        <Box>
          {caseData && <CaseComponent _case={caseData} />}
        </Box>
      </Form>
    {/* </CasesFormWrapper> */}
  </CaseFormContext.Provider>
  )
 
}

export default CasesForm;
