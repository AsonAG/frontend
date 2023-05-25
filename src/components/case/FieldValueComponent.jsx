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
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { UserContext } from "../../App";
import FieldValueTextComponent from "./FieldValueTextComponent";

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
  /* Validation options               =============================== START =============================== */
  // const [fieldVisited, setFieldVisited] = useState(false);
  // const [isFieldValid, setFieldValid] = useState((fieldValue ? true : !required));
  /* Validation options               ===============================  END  ================================ */
  /* LookUp options               =============================== START =============================== */
  const [isLookupOpened, setLookupOpened] = useState(false);
  const [lookupOptions, setLookupOptions] = useState([]);
  const lookupLoading = isLookupOpened && lookupOptions?.length === 0;

  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);

  useEffect(() => {
    let active = true;
    if (!lookupLoading) {
      return undefined;
    }
    casesApi.getCaseFieldLookups(lookupSettings.lookupName, callbackLookups);
    return () => {
      active = false;
    };
  }, [lookupLoading]);

  useEffect(() => {
    if (!isLookupOpened) {
      setLookupOptions([]);
    }
  }, [isLookupOpened]);

  const callbackLookups = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      // console.log("API called successfully. Returned Lookups data: " +JSON.stringify(data, null, 2));
    }
    setLookupOptions(data[0].values);
    console.log("Lookups: " + JSON.stringify(data[0].values, null, 2));
  };

  const handleInputLookupValueChange = (e, option) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    let newValue = option
      ? JSON.parse(option.value)[lookupSettings.valueFieldName]
      : null;
    setFieldValue(newValue);
    console.log("lookup input change:" + newValue + " field text:"); //+ JSON.parse(option.value)[lookupSettings.textFieldName]);
    onChange();
  };
  /* LookUp options   ===================================== END ================================ */

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
    setFieldValue(e.target.value);
    // console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
    onChange(e.target.value);
  };

  const handleBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    onChange(e.target.checked + "");
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
    return (
      <Autocomplete
        name={fieldKey}
        // sx={{ width: 300 }}
        open={isLookupOpened}
        onOpen={() => {
          setLookupOpened(true);
        }}
        onClose={() => {
          setLookupOpened(false);
        }}
        onChange={handleInputLookupValueChange}
        isOptionEqualToValue={(option, value) =>
          JSON.parse(option.value)[lookupSettings.textFieldName] ===
          JSON.parse(value.value)[lookupSettings.textFieldName]
        }
        getOptionLabel={(option) =>
          JSON.parse(option.value)[lookupSettings.textFieldName]
        }
        options={lookupOptions}
        loading={lookupLoading}
        renderInput={(params) => (
          <TextField
            key={fieldKey}
            {...slotInputProps}
            {...params}
            label={fieldDisplayName}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {lookupLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      ></Autocomplete>
    );
  } else
  /* Return Lookup          ================================ END ================================ */
  /* Return any other type  =============================== START =============================== */
    switch (fieldValueType) {
      case "None":
        return (
          <Box>
            <Typography>{fieldDisplayName}</Typography>
            <Typography fontStyle="italic">{fieldDescription}</Typography>
          </Box>
        );
      case "Date":
        return (
          <DatePicker
            slotProps={{ ...slotInputProps }}
            label={fieldDisplayName + (required ? "*" : "")}
            helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            hidden={attributes?.["input.hidden"]}
            disabled={attributes?.["input.readOnly"]}
          ></DatePicker>
        );
      case "DateTime":
        return (
          <DateTimePicker
            slotProps={{ ...slotInputProps }}
            label={fieldDisplayName + (required ? "*" : "")}
            helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            // onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            // slotProps={dateSlotProps} // field validation
            hidden={attributes?.["input.hidden"]}
            disabled={attributes?.["input.readOnly"]}
          ></DateTimePicker>
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
                  hidden={attributes?.["input.hidden"]}
                  disabled={attributes?.["input.readOnly"]}
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
              fieldValueType,
              fieldKey,
              slotInputProps,
              attributes
            )}
            <Box m="6px">
            <Link href={fieldValue} target="_blank" rel="noopener">{fieldValue}</Link>
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
          fieldValueType,
          fieldKey,
          slotInputProps,
          attributes
        );
    }
  /* Return any other type  =============================== END =============================== */
};

export default FieldValueComponent;
