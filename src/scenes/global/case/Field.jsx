import { useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  IconButton,
  Checkbox,
  Autocomplete,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Field = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(false);
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(
    new Date(field.start ? field.start : null)
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    new Date(field.end ? field.end : null)
  );

  const handleInputValueChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setFieldValue(e.target.value);
      console.log(
        "input change:" + e.target.value + " fieldValue:" + fieldValue
      );
    }
  };

  const handleInputBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    handleTextfieldBlur();
  };

  const handleInputDateValueChange = (dateValue) => {
    setFieldValue(new Date(dateValue));
  };

  const handleInputStartDateChange = (dateValue) => {
    setFieldStartDate(new Date(dateValue));
    // setFieldStartDate(dateValue);
  };

  const handleInputEndDateChange = (dateValue) => {
    setFieldEndDate(new Date(dateValue));
    // setFieldEndDate(dateValue);
  };

  const handleTextfieldBlur = () => {
    console.log("Blur activated");
    onChange(fieldName, fieldValue, fieldStartDate, fieldEndDate);
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

  const transformJsonType = (jsonType) => {
    switch (jsonType) {
      case "Number":
        return "numeric";
      case "Boolean":
        return "";
      default:
        break;
    }
  };

  const buildTypedInputField = (jsonType) => {
    // if (field.lookupSettings != null) {
    //   return <Autocomplete key={"field_textfield_" + field.id}></Autocomplete>;
    // }

    switch (jsonType) {
      case "None":
        return (
        <FormControl>
          <FormControlLabel
            name={field.name}
            label={field.displayName}
            helperText={field.description}
          />
        </FormControl>);
        case "Date":
          return (
                  <DatePicker
                    fullWidth
                    name={field.name}
                    label={field.label}
                    helperText={field.description}
                    onAccept={handleTextfieldBlur}
                    required={field.required}
                    value={fieldValue}
                    onChange={handleInputDateValueChange}
                    key={"field_textfield_" + field.id}
                  ></DatePicker>
          );
          case "DateTime":
            return (
                    <DateTimePicker
                      fullWidth
                      name={field.name}
                      label={field.label}
                      helperText={field.description}
                      onAccept={handleTextfieldBlur}
                      required={field.required}
                      value={fieldValue}
                      onChange={handleInputDateValueChange}
                      key={"field_textfield_" + field.id}
                    ></DateTimePicker>
            );
      case "Boolean":
        return (
          <FormControl required={field.optional}>
            <FormControlLabel
              name={field.name}
              label={field.displayName}
              helperText={field.description}
              labelPlacement="end"
              control={
                <Checkbox
                  checked={
                    fieldValue ? fieldValue.toLowerCase?.() === "true" : false
                  }
                  onChange={handleInputBooleanValueChange}
                  key={"field_textfield_" + field.id}
                />
              }
            />
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            name={field.name}
            label={field.displayName}
            helperText={field.description}
            required={field.optional}
            value={fieldValue ? fieldValue : ""}
            onChange={handleInputValueChange}
            key={"field_textfield_" + field.id}
            InputProps={{
              inputMode: transformJsonType(field.valueType),
              onBlur: handleTextfieldBlur,
              // pattern: '[0-9]*'  TODO: PATTERN
              // Value types: input definitions according to a type:
              endAdornment:
                field.valueType == "Percent" ? (
                  <InputAdornment
                    key={"percent_adornment_" + field.id}
                    position="end"
                  >
                    %
                  </InputAdornment>
                ) : (
                  <span />
                ),
            }}
          />
        );
    }
  };

  return (
    field && (
      <Box
        display="grid"
        gridTemplateColumns="6fr 1fr 4fr"
        padding="8px"
        key={"field_inline_" + field.id}
      >
        {/* Input field types {Boolean/Date/Numeric/String} */}
        {buildTypedInputField(field.valueType)}

        {field.timeType != "Timeless" && (
          <Box key={"field_timefield_icon_wrapper" + field.id}
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
        {field.timeType != "Timeless" &&
          isTimeSettingVisible &&
          fieldStartDate && (
            <Box key={"field_textfield_dates" + field.id}
              display="inline-flex"
              justifyContent="flex-start"
              paddingLeft="10px"
              // justifyContent="space-between"
            >
              <DatePicker
                // fullWidth
                name={field.name + "start"}
                label="Start"
                InputLabelProps={{ shrink: true }}
                helperText="Start date"
                onAccept={handleTextfieldBlur}
                required={true}
                value={fieldStartDate}
                onChange={handleInputStartDateChange}
                key={"field_textfield_startdate" + field.id}
              ></DatePicker>
              {field.timeType != "Moment" && (
                <Box key={"field_box_enddate" + field.id} paddingLeft="20px">
                  <DatePicker
                    // fullWidth
                    name={field.name + "end"}
                    label="End"
                    InputLabelProps={{ shrink: true }}
                    helperText="End date"
                    onAccept={handleTextfieldBlur}
                    required={field.endMandatory}
                    value={fieldEndDate}
                    onChange={handleInputEndDateChange}
                    key={"field_textfield_enddate" + field.id}
                  ></DatePicker>
                </Box>
              )}
            </Box>
          )}
      </Box>
    )
  );
};

export default Field;
