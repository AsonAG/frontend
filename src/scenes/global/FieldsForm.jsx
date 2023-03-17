import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const FieldsForm = ({ field, setOutputFields }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [fieldName, setFieldName] = useState();
  const [fieldValue, setFieldValue] = useState();

  useEffect(() => {
    setFieldName(field.name);
    setFieldValue(field.value);
  }, []);

  const handleInputChange = (e) => {
    // const value = target.type === "checkbox" ? target.checked : target.value;
    setFieldValue(e.target.value);
    console.log("input change:"+e.target.value +' fieldValue:'+fieldValue);
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

  const transformJsonType = (jsonType) => {
    switch (jsonType) {
      case 'Number':
        return 'numeric'
      case 'Boolean':
        return ''
      default:
        break;
    }
  }

  return (
    field && (
      <Box
        display="grid"
        gridTemplateColumns="2fr 3fr"
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

            onBlur: updateOutpuFields,
            // pattern: '[0-9]*'  TODO: PATTERN
          }}
          required={field.optional}
          value={fieldValue ? fieldValue : ""} // TODO: fix null issue field.?
          onChange={handleInputChange}
          key={"field_textfield_" + field.id}
        >
          {/* {...fieldInputs(field.displayName)} */}
        </TextField>
        {/* </Box> */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          key={"field_timefield_" + field.id}
        >
          <IconButton
          marginTop="10px"

            onClick={handleTimingButtonClick}
            key={"icon_" + field.id}
          >
            <HistoryOutlinedIcon key={"field_timefield_icon_" + field.id} />
          </IconButton>
        </Box>
      </Box>
    )
  );
};

export default FieldsForm;
