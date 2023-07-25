import { TextField } from "@mui/material";
import ReactInputMask from "react-input-mask";
import { MASK_CHAR } from "../../../../services/validators/FieldValueValidator";
import FieldValueLookupComponent from "./selector/FieldValueLookupComponent";
import FieldValueListComponent from "./selector/FieldValueListComponent";
import FieldValueTextComponent from "./FieldValueTextComponent";

const FieldValueStringComponent = (
  fieldDisplayName,
  required,
  fieldValue,
  handleTextValueChange,
  handleTextBlur,
  fieldValueType,
  fieldKey,
  slotInputProps,
  attributes,
  caseIsReadOnly,
  lookupSettings,
  handleInputLookupValueChange
) => {
  /* Selectors    =============================== START =============================== */
  if (lookupSettings && "lookupName" in lookupSettings) {
    return FieldValueLookupComponent(
      fieldValue,
      fieldKey + "_lookup",
      handleInputLookupValueChange,
      lookupSettings,
      slotInputProps,
      fieldDisplayName,
      attributes,
      caseIsReadOnly
    );
  } else if (attributes?.["input.list"]) {
    return FieldValueListComponent(
      fieldValue,
      fieldKey + "_list",
      handleInputLookupValueChange,
      lookupSettings,
      slotInputProps,
      fieldDisplayName,
      attributes,
      caseIsReadOnly
    );
  } else
  /* Selectors          ================================ END ================================ */
    return FieldValueTextComponent(
      attributes,
      fieldValue,
      handleTextValueChange,
      required,
      handleTextBlur,
      caseIsReadOnly,
      slotInputProps,
      fieldDisplayName,
      fieldKey
    );
};

export default FieldValueStringComponent;


