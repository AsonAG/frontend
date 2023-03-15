import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const FieldsForm = ({ field, outputFields, setOutputFields }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [fieldName, setFieldName] = useState();
  const [fieldValue, setFieldValue] = useState();

  const handleInputChange = (e) => {
    // const value = target.type === "checkbox" ? target.checked : target.value;
    setFieldName(e.target.name);
    setFieldValue(e.target.value);
  };

  const updateOutpuFields = () => {
    console.log("Blur activated");
    setOutputFields((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const handleTimingButtonClick = () => {
    console.log(
      "Timing button clicked for field with name:",
      field.displayName
    );
    setPopupVisible && setPopupVisible(true);
    // return (
    //   <Popover></Popover>
    // )
  };

  return (
    <Box display="grid" gridTemplateColumns="3fr 1fr" padding="8px">
      {/* <Box fontWeight="bold">{field.displayName}</Box> */}
      {/* <Box>{field.description}</Box> */}
      <Box>
        <TextField
          fullWidth
          name={field.displayName}
          label={field.displayName}
          id={field.displayName}
          helperText={field.description}
          inputProps={{
            inputMode: field.valueType,
            onBlur:  updateOutpuFields ,
            // pattern: '[0-9]*'  TODO: PATTERN
          }}
          defaultValue={field.defaultValue}
          required={field.optional}
          value={outputFields[field.displayName]}
          onChange={handleInputChange}
        >
          {/* {...fieldInputs(field.displayName)} */}
        </TextField>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton onClick={handleTimingButtonClick}>
          <HistoryOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FieldsForm;
