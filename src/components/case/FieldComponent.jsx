import { useState, useContext, useEffect, createContext } from "react";
import { Box, IconButton } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FieldValueComponent from "./FieldValueComponent";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useUpdateEffect } from "usehooks-ts";

export const getFieldKey = (name, id) => "field_" + name + "_" + id;

export const FieldAttachmentFileContext = createContext();

const FieldComponent = ({ field, onChange }) => {
  const fieldName = field.name;
  const fieldKey = getFieldKey(field.name, field.id);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(
    field.start ? new Date(field.start) : null
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    field.end ? new Date(field.end) : null
  );
  const caseIsReadOnly = useContext(CaseContext);
  const [isStartEndVisible, asd] = useState(
    field.timeType != "Timeless" &&
      !caseIsReadOnly &&
      !field.attributes?.["input.hideStartEnd"]
  );

  const [attachmentFiles, setAttachmentFiles] = useState({});

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
      // gridTemplateColumns={caseIsReadOnly ? "1fr" : "1fr 40px 1fr"}
      gridTemplateColumns="3fr 2fr"
      padding="2px 8px"
      key={"field_inline_" + field.id}
      // marginBottom="5px"
    >
      <FieldAttachmentFileContext.Provider value={{attachmentFiles, setAttachmentFiles}}>
        <FieldValueComponent
          fieldDisplayName={field.displayName}
          fieldDescription={field.description}
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
      {/* {field.timeType != "Timeless" && (!caseIsReadOnly) && (
        <Box
          key={"field_timefield_icon_wrapper" + field.id}
          display="flex"
          flexDirection="row-reverse"
          marginBottom="22px"
          height="50px"
        >
          <IconButton
            onClick={handleTimingButtonClick}
            key={"icon_" + field.id}
          >
            <HistoryOutlinedIcon key={"field_timefield_icon_" + field.id} />
          </IconButton>
        </Box>
      )} */}

      {isStartEndVisible && (
        <Box
          key={"field_textfield_dates" + field.id}
          display="inline-flex"
          justifyContent="flex-start"
          paddingLeft="10px"
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
      )}
    </Box>
  );
};

export default FieldComponent;
