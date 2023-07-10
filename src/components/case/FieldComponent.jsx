import { useState, useContext, useEffect, createContext } from "react";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FieldValueComponent from "./FieldValueComponent";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useUpdateEffect } from "usehooks-ts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FieldDescriptionText from "./FieldDescriptionText";

export const getFieldKey = (name, id) => "field_" + name + "_" + id;

export const FieldAttachmentFileContext = createContext();

const FieldComponent = ({ field, onChange }) => {
  const fieldName = field.name;
  const fieldKey = getFieldKey(field.name, field.id);
  const [fieldValue, setFieldValue] = useState(field.value ? field.value : ""); // TODO: test if works properly
  const [fieldStartDate, setFieldStartDate] = useState(
    field.start ? new Date(field.start) : null
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    field.end ? new Date(field.end) : null
  );
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const caseIsReadOnly = useContext(CaseContext);
  const isStartEndVisible =
    field.timeType != "Timeless" &&
    !caseIsReadOnly &&
    !field.attributes?.["input.hideStartEnd"];

  const fieldDisplayName = caseIsReadOnly ? "" : field.displayName;

  // initial build
  useEffect(() => {
    onChange(fieldKey, fieldName, fieldValue, fieldStartDate, fieldEndDate);
  }, []);

  // update input values when request with newly built field comes
  useUpdateEffect(() => {
    setFieldValue(field.value);
    setFieldStartDate(field.start ? new Date(field.start) : null);
    setFieldEndDate(field.end ? new Date(field.end) : null);
  }, [field]);

  // handle new document upload
  useUpdateEffect(() => {
    onChange(
      fieldKey,
      fieldName,
      fieldValue,
      fieldStartDate,
      fieldEndDate,
      attachmentFiles
    );
  }, [attachmentFiles]);

  // handle user manuall value change
  const handleValueChange = (value) => {
    onChange(
      fieldKey,
      fieldName,
      // value ? value : fieldValue,
      value,
      fieldStartDate,
      fieldEndDate
    );
  };

  const handleInputStartDateChange = (dateValue) => {
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldStartDate(newDate);
    onChange(fieldKey, fieldName, fieldValue, newDate, fieldEndDate);
  };

  const handleInputEndDateChange = (dateValue) => {
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldEndDate(newDate);
    onChange(fieldKey, fieldName, fieldValue, fieldStartDate, newDate);
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat( auto-fill, 400px 21px)"
      key={"field_grid_" + field.id}
      rowGap="10px"
      columnGap="4px"
      padding="4px 0px 10px 10px"
    >
      <FieldAttachmentFileContext.Provider
        value={{ attachmentFiles, setAttachmentFiles }}
      >
        <FieldValueComponent
          fieldDisplayName={fieldDisplayName}
          fieldKey={fieldKey}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          fieldValueType={field.valueType}
          onChange={handleValueChange}
          lookupSettings={field.lookupSettings}
          attributes={field.attributes}
          key={"field_valuecomponent_" + field.id}
        />
      </FieldAttachmentFileContext.Provider>
      <FieldDescription fieldDescription={field.description} fieldKey />

      {caseIsReadOnly ? (
        // Read-Only case display
        <Stack direction="column" justifyContent="center">
          <Typography variant="h5" alignCenter color="primary">
            {field.displayName}
          </Typography>
        </Stack>
      ) : isStartEndVisible ? (
        // Start-end input
        <Box
          key={"field_textfield_dates" + field.id}
          display="grid"
          gridTemplateColumns="1fr 1fr"
          columnGap="14px"
        >
          <FieldValueComponent
            fieldDisplayName={"Start"}
            fieldKey={fieldKey + "_start"}
            fieldValue={fieldStartDate}
            setFieldValue={setFieldStartDate}
            fieldValueType={
              field.attributes["input.pickerStart"] ? "DateTime" : "Date"
            }
            onChange={handleInputStartDateChange}
            key={"field_startdate" + field.id}
          />

          <Box key={"field_box_enddate" + field.id}>
            {field.timeType != "Moment" && (
              <FieldValueComponent
                fieldDisplayName={"End"}
                fieldKey={fieldKey + "_end"}
                fieldValue={fieldEndDate}
                setFieldValue={setFieldEndDate}
                fieldValueType={
                  field.attributes["input.pickerEnd"] ? "DateTime" : "Date"
                }
                onChange={handleInputEndDateChange}
                required={field.endMandatory}
                key={"field_enddate" + field.id}
              />
            )}
          </Box>
        </Box>
      ) : (
        <div></div>
      )}
    </Box>
  );
};

function FieldDescription({ fieldDescription, fieldKey }) {
  return (
    <Box>
      {fieldDescription ? (
        <Tooltip
          arrow
          title={FieldDescriptionText(fieldDescription, fieldKey)}
          placement="top"
        >
          <HelpOutlineOutlinedIcon small color="secondary" />
        </Tooltip>
      ) : (
        <div></div>
      )}
    </Box>
  );
}

export default FieldComponent;
