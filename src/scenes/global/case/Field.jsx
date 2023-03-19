import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const Field = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(true);
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(field.value);
  const [fieldEndDate, setFieldEndDate] = useState(field.value);

  const handleInputValueChange = (e) => {
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
  };

  const handleInputStartDateChange = (e) => {
    setFieldStartDate(e.target.value);
  };
  
  const handleInputEndDateChange = (e) => {
    setFieldEndDate(e.target.value);
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
          {/* {...fieldInputs(field.displayName)} */}
        </TextField>
        {/* </Box> */}
        <Box
          display="flex"
          // justifyContent="space-between"
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

        {isTimeSettingVisible && (
          <Box key={"field_textfield_dates" + field.id} 
          display="inline-flex"
          justifyContent='flex-start' 
          paddingLeft="10px"
          // justifyContent="space-between"
          >
            <TextField
              // fullWidth
              name={field.name + "start"}
              label='Start'
              InputLabelProps={{ shrink: true }}
              helperText="Start date"
              type="date"
              inputProps={{
                onBlur: handleTextfieldBlur,
                // pattern: '[0-9]*'  TODO: PATTERN
              }}
              required={true}
              value={field.start ? field.start : ""}
              onChange={handleInputStartDateChange}
              key={"field_textfield_startdate" + field.id}
            ></TextField>
            <Box
            key={"field_box_enddate" + field.id}
            paddingLeft="20px"
            >
            <TextField
          // fullWidth
              name={field.name + "end"}
              label='End'
              InputLabelProps={{ shrink: true }}
              helperText="End date"
              type="date"
              inputProps={{
                onBlur: handleTextfieldBlur,
                // pattern: '[0-9]*'  TODO: PATTERN
              }}
              required={field.endMandatory}
              value={field.end ? field.end : ""}
              onChange={handleInputEndDateChange}
              key={"field_textfield_enddate" + field.id}
            ></TextField>
          </Box>
          </Box>
        )}
      </Box>
    )
  );
};

export default Field;
