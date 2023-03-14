import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CaseDetails as CaseDetailsClass } from "../../model/CaseDetails";
import { Button, IconButton } from "@mui/material";
import { CaseFieldValue } from "../../model/CaseFieldValue"; 
import SendIcon from "@mui/icons-material/Send";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Popover from "@mui/material/Popover";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import ApiClient from "../../ApiClient";
import CasesApi from "../../api/CasesApi";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const FieldWrapper = ({ field, setPopupVisible}) => {
  const handleTimingButtonClick = () => {
    console.log("Timing button clicked for field with name:", field.name);
    setPopupVisible && setPopupVisible(true);
    // return (
    //   <Popover></Popover>
    // )
  };

  return (
    <Box display="grid" gridTemplateColumns="1fr 2fr 2fr 1fr">
      <Box fontWeight="bold">{field.name}</Box>
      <Box>{field.description}</Box>
      <Box>
        <Input defaultValue={field.value.value} required={field.optional} />
      </Box>
      <Box>
        <IconButton onClick={handleTimingButtonClick()}>
          <HistoryOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const CaseWrapper = ({ caseBase, isBase, setPopupVisible }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (panel) => (isExpanded) => {
    // TODO: send build request when clicked (?)
  };

  return (
    <Box>
      <Accordion defaultExpanded={true} elevation={5}>
        {isBase ? (
          <AccordionSummary
            onChange={handleChange("")} // TODO
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: colors.primary[300],
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {caseBase?.name}
            </Typography>
          </AccordionSummary>
        ) : (
          <AccordionSummary
            onChange={handleChange("")} // TODO
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {caseBase?.name}
            </Typography>
          </AccordionSummary>
        )}

        <AccordionDetails
          sx={{
            backgroundColor: colors.primary[400],
          }}
        >
          {/* Fields */}
          <Box borderTop={1} paddingTop="16px">
            {caseBase?.fields?.map((field, i) => (
              <FieldWrapper field={field} setPopupVisible={setPopupVisible} />
            ))}
          </Box>

          {/* Embeded related cases - IF NEEDED */}
          {/* <Box borderTop={1} paddingTop="16px">
          {caseBase?.relatedCases?.map((relatedCase, i) => (
            <CaseWrapper
              caseBase={CaseDetailsClass.constructFromObject(relatedCase)}
            />
          ))}
        </Box> */}
        </AccordionDetails>
      </Accordion>

      <Box borderTop={1} paddingTop="16px">
        {caseBase?.relatedCases?.map((relatedCase, i) => (
          <CaseWrapper
            caseBase={CaseDetailsClass.constructFromObject(relatedCase)}
          />
        ))}
      </Box>
    </Box>
  );
};

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState(new CaseDetailsClass());
  const casesApi = new CasesApi(ApiClient);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [fieldTimeEdit, setfieldTimeEdit] = useState(new CaseFieldValue());

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(
        "API called successfully. Returned data: " +
          JSON.stringify(data, null, 2)
      );
    }
    setCaseDetails(data);
  };

  useEffect(() => {
    console.log("Making api Request for a case: " + props.caseName);
    casesApi.getCaseFieldsMOCK(props.caseName, callback);
  }, []);

  return (
    <Box m="25px" display="flex" flexDirection="column" alignItems="left">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={props.caseName} subtitle="Fulfill the case details" />
      </Box>

      
      <Box>{<CaseWrapper caseBase={caseDetails} isBase={true} setPopupVisible={setPopupVisible}/>}</Box>

      <Box mt="20px" ml="auto">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CaseForm;
