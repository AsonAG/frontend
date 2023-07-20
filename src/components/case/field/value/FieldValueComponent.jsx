import { useContext } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
  Link,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../../../scenes/global/CasesForm";
import FieldValueTextComponent from "./FieldValueTextComponent";
import FieldValueFileComponent from "./FieldValueFileComponent";
import FieldValueSelectorComponent from "./FieldValueSelectorComponent";
import FieldValueNumberComponent from "./FieldValueNumberComponent";

/**
 * Input field types {Decimal/Money/Percent/Hour/Day../Distance/NumericBoolean}
 */
const FieldValueComponent = ({
  fieldDisplayName,
  fieldDescription,
  fieldKey,
  fieldValue,
  setFieldValue,
  fieldValueType,
  onChange,
  required = true,
  lookupSettings,
  attributes,
  setAttachmentFiles,
  small,
}) => {
  const slotInputProps = small
    ? {
        fullWidth: true,
        textField: { size: "small" },
        size: "small",
      }
    : { fullWidth: true };
  const caseIsReadOnly =
    useContext(CaseContext) || attributes?.["input.readOnly"];
  let isInteger;
  /* Validation options               =============================== START =============================== */
  // const dateSlotProps = () => {
  //   return fieldVisited && !isFieldValid
  //     ? { textField: {
  //         error: true,
  //         helperText: "Field can not be empty"
  //       } } // TODO: Change error message
  //     : null;
  // };
  
  /* Validation ========================================== END ================================ */
  /* Handlers         =================================== START =============================== */
  const handleTextValueChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleNumberValueChange = (values, sourceInfo) => {
    setFieldValue(values.value);
  }

  const handleTextBlur = (e) => {
    onChange(e.target.value);
  };

  const handleNumberBlur = () => {
    onChange(fieldValue);
  };

  const handleBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    onChange(e.target.checked + "");
  };

  const handleInputLookupValueChange = (value) => {
    setFieldValue(value);
    onChange(value);
  };

  /**
   * if dateValue is a Date class - updates fieldValue
   */
  const handleDateValueChange = (dateValue) => {
    if (dateValue == null || isValidDate(dateValue)) {
      let newDate = dateValue ? new Date(dateValue) : null;
      setFieldValue(newDate);
      onChange(newDate);
    }
  };

  function isValidDate(date) {
    return (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    );
  }

  /* Handlers         ================================ END ================================ */

  /* Return lookup    =============================== START =============================== */
  if (lookupSettings && "lookupName" in lookupSettings) {
    return FieldValueSelectorComponent(
      fieldValue,
      fieldDescription,
      fieldKey,
      handleInputLookupValueChange,
      lookupSettings,
      slotInputProps,
      fieldDisplayName,
      attributes,
      caseIsReadOnly
    );
  } else
  /* Return Lookup          ================================ END ================================ */
  /* Return any other type  =============================== START =============================== */
    switch (fieldValueType) {
      case "None":
        return (
          <Box marginLeft="14px" marginBottom="5px">
            <Typography>{fieldDisplayName}</Typography>
          </Box>
        );
      case "Document":
        return FieldValueFileComponent(
          fieldDisplayName,
          fieldDescription,
          fieldValue,
          fieldKey,
          slotInputProps,
          attributes,
          setAttachmentFiles
        );
      case "Date":
        return (
          <DatePicker
            label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly}
            slotProps={{
              ...slotInputProps,
              textField: {
                helperText: fieldDescription,
              },
            }}
          />
        );
      case "DateTime":
        return (
          <DateTimePicker
            label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
            // helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly}
            slotProps={{
              ...slotInputProps,
              textField: {
                helperText: fieldDescription,
              },
            }}
          />
        );
      case "Boolean":
        return (
          <FormControl required={required}>
            <FormControlLabel
              name={fieldKey}
              label={fieldDisplayName}
              slotProps={{ ...slotInputProps }}
              labelPlacement="start"
              control={
                <Checkbox
                  checked={
                    fieldValue ? fieldValue.toLowerCase?.() === "true" : false
                  }
                  onChange={handleBooleanValueChange}
                  key={fieldKey}
                  disabled={caseIsReadOnly}
                />
              }
            />
            <FormHelperText>{fieldDescription}</FormHelperText>
          </FormControl>
        );
      case "WebResource":
        return (
          <Stack>
            {FieldValueTextComponent(
              fieldDisplayName,
              fieldDescription,
              required,
              fieldValue,
              handleTextValueChange,
              handleTextBlur,
              fieldValueType,
              fieldKey,
              slotInputProps,
              attributes,
              caseIsReadOnly
            )}
            <Box m="6px">
              <Link href={fieldValue} target="_blank" rel="noopener">
                {fieldValue}
              </Link>
            </Box>
          </Stack>
        );
      case "Integer":
      case "NumericBoolean":
        isInteger = true;
        return FieldValueNumberComponent(
          fieldDisplayName,
          fieldDescription,
          required,
          fieldValue,
          handleNumberValueChange,
          handleNumberBlur,
          fieldValueType,
          fieldKey,
          slotInputProps,
          attributes,
          caseIsReadOnly,
          isInteger
        );
      case "Week":
      case "Decimal":
      case "Year":
      case "Day":
      case "Hour":
      case "Distance":
      case "Month":
      case "Percent":
      case "Money":
        isInteger = false;
        return FieldValueNumberComponent(
          fieldDisplayName,
          fieldDescription,
          required,
          fieldValue,
          handleNumberValueChange,
          handleNumberBlur,
          fieldValueType,
          fieldKey,
          slotInputProps,
          attributes,
          caseIsReadOnly,
          isInteger
        );
      default: //TextField
        return FieldValueTextComponent(
          fieldDisplayName,
          fieldDescription,
          required,
          fieldValue,
          handleTextValueChange,
          handleTextBlur,
          fieldValueType,
          fieldKey,
          slotInputProps,
          attributes,
          caseIsReadOnly
        );
    }
  /* Return any other type  =============================== END =============================== */
};

export default FieldValueComponent;
