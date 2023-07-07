import { useState, useContext, useEffect, createContext } from "react";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FieldValueComponent from "./FieldValueComponent";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useUpdateEffect } from "usehooks-ts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

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
      // gridTemplateColumns={caseIsReadOnly ? "2fr 3fr 20px" : "3fr 20px 2fr"}
      // gridTemplateColumns="3fr 20px 2fr"
      gridTemplateColumns="repeat( auto-fill, minmax(400px, 1fr) )"
      padding="2px 8px"
      key={"field_inline_" + field.id}
      marginBottom="8px"
      gridGap="10px"
    >
      {caseIsReadOnly && (
        <Stack direction="column" justifyContent="center">
          <Typography variant="h5" alignCenter color="primary">
            {field.displayName}
          </Typography>
        </Stack>
      )}

      <Box display="inline-flex" maxWidth="400px">
        <FieldAttachmentFileContext.Provider
          value={{ attachmentFiles, setAttachmentFiles }}
        >
          <FieldValueComponent
            fieldDisplayName={fieldDisplayName}
            // fieldDescription={" "}
            fieldKey={fieldKey}
            fieldValue={fieldValue}
            setFieldValue={setFieldValue}
            fieldValueType={field.valueType}
            onChange={handleValueChange}
            lookupSettings={field.lookupSettings}
            attributes={field.attributes}
            key={"field_valuecomponent_" + field.id}
          />

          {field.description ? (
            <Box margin="0 5px">
              <Tooltip arrow title={field.description} placement="top">
                <HelpOutlineOutlinedIcon small color="secondary" />
              </Tooltip>
            </Box>
          ) : (
            <div></div>
          )}
        </FieldAttachmentFileContext.Provider>
      </Box>

      {isStartEndVisible ? (
        <Box
          key={"field_textfield_dates" + field.id}
          display="inline-flex"
          justifyContent="flex-start"
          paddingLeft="10px"
          width="400px"
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

          {field.timeType != "Moment" && (
            <Box key={"field_box_enddate" + field.id} paddingLeft="20px">
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
            </Box>
          )}
        </Box>
      ) : (
        <div></div>
      )}
    </Box>

  );
};

export default FieldComponent;
