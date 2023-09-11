import { Box, Stack} from "@mui/material";
import { React } from "react";
import CaseIndexComponent from "./CaseIndexComponent";
import useActiveCase from "../../hooks/useActiveCase";

function CaseIndexView({ _case, children }) {
  // TODO AJO hide when mobile
  // const { displayOnly } =  useContext(CaseFormContext);
  // const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // TODO AJO fix scrolling
  // const handleScroll = useActiveCase( outputCase, setActiveCaseKey);

  // TODO AJO define header height?
  const activeCase = useActiveCase();
  return (
    <Stack useFlexGap sx={{overflowY: 'auto', position: 'sticky', top: 0, height: "calc(100vh - 64px)" }}>
      <Box sx={{flex: 1}}>
        <CaseIndexComponent _case={_case} indent={0} activeCase={activeCase} />
      </Box>
      {children}
    </Stack>
  );
};

export default CaseIndexView;
