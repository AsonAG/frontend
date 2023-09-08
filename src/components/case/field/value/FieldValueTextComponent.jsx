import { TextField } from "@mui/material";
import ReactInputMask from "react-input-mask";
import { MASK_CHAR } from "../../../../services/validators/FieldValueValidator";

function FieldValueTextComponent({ field, isReadonly }) {

  const handleChange = (e) => {
    console.log(e.target.value)
  }

  const handleBlur = () => {
    // TODO AJO validate
    // validateMask(fieldValue, attributes)
  }
  

  const textField = <TextField
    label={field.displayName}
    required
    value={field.value || ''}
    onChange={handleChange}
    onBlur={handleBlur}
    type="text"
    name={field.name}
    multiline={field.attributes?.["input.multiLine"]}
    minRows={2}
    disabled={isReadonly}
  />;

  if (!field.attributes?.["input.mask"]) {
    return textField;
  }

  return (
    <ReactInputMask
      mask={attributes["input.mask"]}
      maskChar={MASK_CHAR}
      value={fieldValue}
      onChange={handleTextValueChange}
      required={required}
      onBlur={handleTextBlur}
      disabled={caseIsReadOnly}
    >
      {() => textField }
    </ReactInputMask>
  )

};

export default FieldValueTextComponent;
