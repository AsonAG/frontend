import { useState, useContext } from "react";
import { Box, IconButton } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FieldValueComponent from "./FieldValueComponent";

const FieldComponent = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(
    // field.start || field.end
    true
  );
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(
    field.start ? new Date(field.start) : null
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    field.end ? new Date(field.end) : null
  );

  const onValueChange = (value) => {
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      value ? value : fieldValue,
      fieldStartDate,
      fieldEndDate,
      field.caseSlot
    );
  };

  const handleInputStartDateChange = (dateValue) => {
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldStartDate(newDate);
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      fieldValue,
      newDate,
      fieldEndDate,
      field.caseSlot
    );
  };

  const handleInputEndDateChange = (dateValue) => {
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldEndDate(newDate);
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      fieldValue,
      fieldStartDate,
      newDate,
      field.caseSlot
    );
  };

  const handleTimingButtonClick = () => {
    console.log(
      "Timing button clicked for field with name:",
      field.displayName,
      "popupVisible:",
      isTimeSettingVisible
    );
    setTimeSettingVisible(!isTimeSettingVisible);
  };

  return (
    field && (
      <Box
        display="grid"
        gridTemplateColumns="1fr 40px 1fr"
        padding="8px"
        key={"field_inline_" + field.id}
      >
        <FieldValueComponent
          fieldName={fieldName}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          field={field}
          fieldValueType={field.valueType}
          fieldDescription={field.description}
          onChange={onValueChange}
        />

        {field.timeType != "Timeless" && (
          <Box
            key={"field_timefield_icon_wrapper" + field.id}
            display="flex"
            flexDirection="row-reverse"
            marginBottom="22px"
          >
            <IconButton
              onClick={handleTimingButtonClick}
              key={"icon_" + field.id}
            >
              <HistoryOutlinedIcon key={"field_timefield_icon_" + field.id} />
            </IconButton>
          </Box>
        )}

        {field.timeType != "Timeless" && isTimeSettingVisible && (
          // fieldStartDate &&
          <Box
            key={"field_textfield_dates" + field.id}
            display="inline-flex"
            justifyContent="flex-start"
            paddingLeft="10px"
            // justifyContent="space-between"
          >
            {/* <DatePicker
              name={field.name + "start"}
              label="Start"
              value={fieldStartDate}
              onChange={handleInputStartDateChange}
              key={"field_textfield_startdate" + field.id}
            /> */}

            <FieldValueComponent
              fieldDisplayName={"Start"}
              fieldValue={fieldStartDate}
              setFieldValue={setFieldStartDate}
              field={field}
              fieldValueType={'Date'}
              onChange={handleInputStartDateChange}
            />

            {field.timeType != "Moment" && (
              <Box key={"field_box_enddate" + field.id} paddingLeft="20px">
                <FieldValueComponent
                  fieldDisplayName={"End"}
                  fieldValue={fieldEndDate}
                  setFieldValue={setFieldEndDate}
                  field={field}
                  fieldValueType={'Date'}
                  onChange={handleInputEndDateChange}
                  required={field.endMandatory}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  );
};

export default FieldComponent;
