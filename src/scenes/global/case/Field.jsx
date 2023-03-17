import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const Field = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(true);
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);

  const handleInputChange = (e) => {
    // const value = target.type === "checkbox" ? target.checked : target.value;
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
  };

  const handleInputStartDateChange = (e) => {
    setFieldValue(e.target.value);
  };
  
  const handleInputEndDateChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleTextfieldBlur = () => {
    console.log("Blur activated");
    onChange(fieldName, fieldValue);
    // onChange(fieldName, fieldValue, fieldStartDate, fieldEndDate);
  };

  const handleTimingButtonClick = () => {
    console.log(
      "Timing button clicked for field with name:",
      field.displayName,
      "popupVisible:",
      isTimeSettingVisible
    );
    setTimeSettingVisible(!isTimeSettingVisible);
    // return (
    //   <Popover></Popover>
    // )
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
        gridTemplateColumns="4fr 1fr 4fr"
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
          onChange={handleInputChange}
          key={"field_textfield_" + field.id}
        >
          {/* {...fieldInputs(field.displayName)} */}
        </TextField>
        {/* </Box> */}
        <Box
          display="flex"
          justifyContent="space-between"
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

        {isTimeSettingVisible && (
          <Box key={"field_textfield_dates" + field.id} 
          display="flex"
          justifyContent="space-between"
          >
            <TextField
              fullWidth
              name={field.name + "start"}
              // label='Start'
              helperText="Start date"
              type="date"
              inputProps={{
                onBlur: handleTextfieldBlur,
                // pattern: '[0-9]*'  TODO: PATTERN
              }}
              required={true}
              value={field.start ? field.start : ""}
              onChange={handleInputDateChange}
              key={"field_textfield_startdate" + field.id}
            ></TextField>
            <TextField
              fullWidth
              name={field.name + "end"}
              // label='End'
              helperText="End date"
              type="date"
              inputProps={{
                onBlur: handleTextfieldBlur,
                // pattern: '[0-9]*'  TODO: PATTERN
              }}
              required={true}
              value={field.end ? field.end : ""}
              onChange={handleInputDateChange}
              key={"field_textfield_enddate" + field.id}
            ></TextField>
          </Box>
        )}
      </Box>
    )
  );
};

export default Field;
