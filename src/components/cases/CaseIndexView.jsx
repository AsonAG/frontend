import { Stack } from "@mui/material";
import { React } from "react";
import CaseIndexComponent from "./CaseIndexComponent";
import useActiveCase from "../../hooks/useActiveCase";

function CaseIndexView({ _case }) {
  const { activeCase, scrollAndSetActive } = useActiveCase(_case);
  return (
    <Stack sx={{overflowY: 'auto', position: 'sticky', alignSelf: "start", top: 0, pb: 2, pt: 2, width: 225 }}>
      <CaseIndexComponent _case={_case} indent={0} activeCase={activeCase} onSelect={scrollAndSetActive} />
    </Stack>
  );
};

export default CaseIndexView;
