import { useMemo, useState, useContext, Fragment, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import {
  Box,
  InputAdornment,
  IconButton,
  Checkbox,
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { UserContext } from "../../App";
import FieldValueComponent from "./FieldValueComponent";

const FieldWrapper = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(
    field.start || field.end
  );
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(
    field.start ? new Date(field.start) : null
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    field.end ? new Date(field.end) : null
  );
  // Form validation SX options ================================ START ================================
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isSaveButtonClicked, setIsSaveButtonClicked } =
    useContext(CaseContext);

  const dateSlotProps = (isRequired, value) => {
    return isSaveButtonClicked && isRequired && value
      ? { textField: { error: true, helperText: "Field can not be empty" } }
      : null;
  };
  // Form validation SX options ================================ END ================================


  const onValueChange = (value) => {
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      value ? value : fieldValue,
      fieldStartDate,
      fieldEndDate,
      field.caseSlot
    );
  }


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
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          field={field} 
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
            <DatePicker
              name={field.name + "start"}
              label="Start"
              value={fieldStartDate}
              onChange={handleInputStartDateChange}
              key={"field_textfield_startdate" + field.id}
              slotProps={dateSlotProps(true, fieldStartDate)} // field validation
            />
            {field.timeType != "Moment" && (
              <Box key={"field_box_enddate" + field.id} paddingLeft="20px">
                <DatePicker
                  name={field.name + "end"}
                  label="End"
                  value={fieldEndDate}
                  onChange={handleInputEndDateChange}
                  key={"field_textfield_enddate" + field.id}
                  slotProps={dateSlotProps(field.endMandatory, fieldEndDate)} // field validation
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  );
};

export default FieldWrapper;
