import { useMemo, useState, useContext, Fragment, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import {
  Box,
  InputAdornment,
  Checkbox,
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../scenes/global/CasesForm";
import { UserContext } from "../../App";
import FieldValueTextComponent from "./FieldValueTextComponent";
import FieldValueAutocompleteComponent from "./FieldValueAutocompleteComponent";
import { Markup } from "interweave";

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
  small,
}) => {
  const slotInputProps = small
    ? {
        fullWidth: true,
        textField: { size: "small" },
        size: "small",
      }
    : {};
    const caseIsReadOnly = useContext(CaseContext);
  /* Validation options               =============================== START =============================== */
  // const [fieldVisited, setFieldVisited] = useState(false);
  // const [isFieldValid, setFieldValid] = useState((fieldValue ? true : !required));
  /* Validation options               ===============================  END  ================================ */
  /* Validation - turn red if visited and invalid ======== START ================================ */
  // const { isSaveButtonClicked, setIsSaveButtonClicked } = useContext(CaseContext);

  // const dateSlotProps = () => {
  //   return fieldVisited && !isFieldValid
  //     ? { textField: {
  //         error: true,
  //         helperText: "Field can not be empty"
  //       } } // TODO: Change error message
  //     : null;
  // };
  // const handleDateClose = () => {
  //   setFieldVisited(true);
  // };
  /* Validation ========================================== END ================================ */

  /* Handlers         =================================== START =============================== */
  const handleTextValueChange = (e) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    setFieldValue(e.target.value);
    // console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
  };

  const handleTextBlur = (e) => {
    onChange(e.target.value);
  };

  const handleBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    onChange(e.target.checked + "");
  };

  const handleInputLookupValueChange = (text, value) => {
    setFieldValue(text);
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
    return FieldValueAutocompleteComponent(
      fieldValue,
      fieldDescription,
      fieldKey,
      onChange={handleInputLookupValueChange},
      lookupSettings,
      slotInputProps,
      fieldDisplayName,
      attributes
    );
  } else
  /* Return Lookup          ================================ END ================================ */
  /* Return any other type  =============================== START =============================== */
    switch (fieldValueType) {
      case "None":
        return (
          <Box marginLeft="14px" marginBottom="5px">
            <Typography>{fieldDisplayName}</Typography>
            <Markup content={fieldDescription} />
          </Box>
        );
      case "Date":
        return (
          <DatePicker
            label={fieldDisplayName + (required ? "*" : "")}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly || attributes?.["input.readOnly"]}
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
            label={fieldDisplayName + (required ? "*" : "")}
            // helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            disabled={caseIsReadOnly || attributes?.["input.readOnly"]}
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
              labelPlacement="end"
              control={
                <Checkbox
                  checked={
                    fieldValue ? fieldValue.toLowerCase?.() === "true" : false
                  }
                  onChange={handleBooleanValueChange}
                  key={fieldKey}
                  disabled={caseIsReadOnly || attributes?.["input.readOnly"]}
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
              attributes
            )}
            <Box m="6px">
              <Link href={fieldValue} target="_blank" rel="noopener">
                {fieldValue}
              </Link>
            </Box>
          </Stack>
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
          attributes
        );
    }
  /* Return any other type  =============================== END =============================== */
};

export default FieldValueComponent;
