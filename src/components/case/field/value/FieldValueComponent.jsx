import { useContext, useEffect, useState } from "react";
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
import FieldValueLookupComponent from "./selector/FieldValueLookupComponent";
import FieldValueNumberComponent from "./FieldValueNumberComponent";
import { useUpdateEffect } from "usehooks-ts";
import FieldValueListComponent from "./selector/FieldValueListComponent";

/**
 * Input field types {Decimal/Money/Percent/Hour/Day../Distance/NumericBoolean}
 */
const FieldValueComponent = ({
  fieldDisplayName,
  fieldKey,
  fieldValue,
  setFieldValue,
  fieldValueType,
  onChange,
  required = true,
  lookupSettings,
  attributes,
  setAttachmentFiles,
}) => {
  const caseIsReadOnly =
    useContext(CaseContext) || attributes?.["input.readOnly"];
  const [helperText, setHelperText] = useState("");
  const [isValid, setIsValid] = useState(true);
  let isInteger;

  /* Validation options               =============================== START =============================== */
  const [slotInputProps, setSlotProps] = useState({});

  useEffect(() => {
    setSlotProps({
      fullWidth: true,
      helperText: helperText,
      error: !isValid,
      textField: {
        helperText: helperText,
        error: !isValid,
      },
      // textField: { size: "small" },
      // size: "small",
    });
  }, [isValid, helperText]);

  // useUpdateEffect(() => {
  //   isValid
  //     ? setSlotProps((current) => ({
  //         ...current,
  //         error: true,
  //         textField: {
  //           helperText: helperText,
  //           error: true,
  //         },
  //       }))
  //     : setSlotProps((current) => ({
  //         ...current,
  //         error: false,
  //         textField: {
  //           helperText: helperText,
  //           error: false,
  //         },
  //       }));
  // }, [isValid]);

  const checkMinMax = (stringValue) => {
    const maxValue = attributes?.["input.maxValue"];
    const minValue = attributes?.["input.minValue"];

    const floatValue = parseFloat(stringValue);

    if (floatValue === null) setIsValid(true);
    else if (maxValue && minValue)
      setIsValid(floatValue <= maxValue && floatValue >= minValue);
    else if (maxValue) setIsValid(floatValue <= maxValue);
    else if (minValue) setIsValid(floatValue >= minValue);
    else setIsValid(true);
  };
  /* Validation ========================================== END ================================ */
  /* Handlers         =================================== START =============================== */
  const handleTextValueChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleNumberValueChange = (values, sourceInfo) => {
    setFieldValue(values.value);
  };

  const handleTextBlur = (e) => {
    onChange(e.target.value);
  };

  const handleNumberBlur = () => {
    checkMinMax(fieldValue);
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

  /* Selectors    =============================== START =============================== */
  if (lookupSettings && "lookupName" in lookupSettings) {
    return FieldValueLookupComponent(
      fieldValue,
      fieldKey,
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
      fieldKey,
      handleInputLookupValueChange,
      lookupSettings,
      slotInputProps,
      fieldDisplayName,
      attributes,
      caseIsReadOnly
    );
  } else
  /* Selectors          ================================ END ================================ */
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
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly}
            slotProps={{ ...slotInputProps }}
          />
        );
      case "DateTime":
        return (
          <DateTimePicker
            label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly}
            slotProps={{ ...slotInputProps }}
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
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
        );
      case "WebResource":
        return (
          <Stack>
            {FieldValueTextComponent(
              fieldDisplayName,
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
