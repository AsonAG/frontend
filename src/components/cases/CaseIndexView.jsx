import { Stack } from "@mui/material";
import { React } from "react";
import CaseIndexComponent from "./CaseIndexComponent";
import useActiveCase from "../../hooks/useActiveCase";

function CaseIndexView({ _case }) {
  // TODO AJO hide when mobile
  // const { displayOnly } =  useContext(CaseFormContext);
  // const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { activeCase, scrollAndSetActive } = useActiveCase(_case);
  return (
    <Stack sx={{overflowY: 'auto', position: 'sticky', top: 0, height: 'calc(100vh - 64px)', pb: 2, pt: 2 }}>
      <CaseIndexComponent _case={_case} indent={0} activeCase={activeCase} onSelect={scrollAndSetActive} />
    </Stack>
  );
};

export default CaseIndexView;
