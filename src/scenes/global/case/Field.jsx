import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDay()),
  ].join('-');
}

const Field = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(true);
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  // const [fieldStartDate, setFieldStartDate] = useState(field.start);
  const [fieldStartDate, setFieldStartDate] = useState(new Date(field.start ? field.start : null));
  const [fieldEndDate, setFieldEndDate] = useState(new Date(field.end ? field.end : null));
  // const [fieldEndDate, setFieldEndDate] = useState(field.end);

  const handleInputValueChange = (e) => {
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
  };

  const handleInputStartDateChange = (dateValue) => {
    setFieldStartDate(new Date(dateValue));
    console.log("input date change:" + dateValue + " date value:" + fieldStartDate);

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

  return (
    field && (
      <Box
        display="grid"
        gridTemplateColumns="6fr 1fr 4fr"
        padding="8px"
        key={"field_inline_" + field.id}
      >
        {/* <Box fontWeight="bold">{field.displayName}</Box> */}
        {/* <Box>{field.description}</Box> */}
        {/* <Box key={"field_inline_textwrap_"+field.id}> */}
        <TextField
          fullWidth
          name={field.name}
          label={field.displayName}
          // id={field.id}
          helperText={field.description}
          // type={transformJsonType(field.valueType)} // TODO: remove later, use custom validation
          inputProps={{
            inputMode: transformJsonType(field.valueType),

            onBlur: handleTextfieldBlur,
            // pattern: '[0-9]*'  TODO: PATTERN
          }}
          required={field.optional}
          value={fieldValue ? fieldValue : ""}
          onChange={handleInputValueChange}
          key={"field_textfield_" + field.id}
        >
        </TextField>
        {/* </Box> */}
        <Box
          display="flex"
          flexDirection="row-reverse"
          key={"field_timefield_icon_wrapper" + field.id}
          marginBottom="22px"
        >
          <IconButton
            onClick={handleTimingButtonClick}
            key={"icon_" + field.id}
          >
            <HistoryOutlinedIcon key={"field_timefield_icon_" + field.id} />
          </IconButton>
        </Box>

        {isTimeSettingVisible && field.timeType != "Timeless" && (
          <Box
            key={"field_textfield_dates" + field.id}
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
