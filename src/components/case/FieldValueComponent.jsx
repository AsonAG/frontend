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
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { UserContext } from "../../App";

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
  required=true,
  field, // todo: remove later, used only for LookupSettings
}) => {
  const [fieldVisited, setFieldVisited] = useState(false);
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
    casesApi.getCaseFieldLookups(
      field.lookupSettings.lookupName,
      callbackLookups
    );
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
      console.log(
        "API called successfully. Returned Lookups data: " +
          JSON.stringify(data, null, 2)
      );
    }
    setLookupOptions(data[0].values);
    console.log("Lookups: " + JSON.stringify(data[0].values, null, 2));
  };

  const handleInputLookupValueChange = (e, option) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    let newValue = option
      ? JSON.parse(option.value)[field.lookupSettings.valueFieldName]
      : null;
    setFieldValue(newValue);
    console.log("lookup input change:" + newValue + " field text:"); //+ JSON.parse(option.value)[field.lookupSettings.textFieldName]);
    onChange();
  };
  /* LookUp options   ================================ END ================================ */

  // Form validation SX options   ================================ START ================================
  const { isSaveButtonClicked, setIsSaveButtonClicked } =
    useContext(CaseContext);

  const dateSlotProps = (isRequired) => {
    return fieldVisited && isRequired && !fieldValue
      ? { textField: { error: true, helperText: "Field can not be empty" } } // TODO: Change error message
      : null;
    // : { textField: { required: true } };
  };
  // Form validation SX options   ================================ END ================================

  /* Handlers         =============================== START =============================== */
  const handleTextValueChange = (e) => {
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
    onChange(e.target.value);
  };

  const handleBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    onChange(e.target.checked + "");
  };

  const handleDateValueChange = (dateValue) => {
    // TODO: fix wrong time zone issue
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldValue(newDate);
    onChange(newDate);
  };

  const handleDateClose = () => {
    setFieldVisited(true);
  };
  /* Handlers         ================================ END ================================ */

  /* Return lookup    =============================== START =============================== */
  if (field.lookupSettings && "lookupName" in field.lookupSettings) {
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
          JSON.parse(option.value)[field.lookupSettings.textFieldName] ===
          JSON.parse(value.value)[field.lookupSettings.textFieldName]
        }
        getOptionLabel={(option) =>
          JSON.parse(option.value)[field.lookupSettings.textFieldName]
        }
        options={lookupOptions}
        loading={lookupLoading}
        renderInput={(params) => (
          <TextField
          key={fieldKey}

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
            fullWidth
            label={fieldDisplayName + (required ? "*" : "")}
            helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            slotProps={dateSlotProps(required)} // field validation
          ></DatePicker>
        );
      case "DateTime":
        return (
          <DateTimePicker
            fullWidth
            label={fieldDisplayName + (required ? "*" : "")}
            helperText={fieldDescription}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            onClose={handleDateClose}
            name={fieldKey}
            key={fieldKey}
            slotProps={dateSlotProps(required)} // field validation
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
                />
              }
            />
            <FormHelperText>{fieldDescription}</FormHelperText>
          </FormControl>
        );
      default: //TextField
        return (
          <TextField
            fullWidth
            label={fieldDisplayName}
            helperText={fieldDescription}
            required={required}
            value={fieldValue ? fieldValue : ""}
            onChange={handleTextValueChange}
            type={getInputTypeFromJsonType(fieldValueType)}
            name={fieldKey}
            key={fieldKey}
            InputProps={{
              endAdornment: getAdornmentFromJsonType(fieldValueType, fieldKey),
            }}
          />
        );
    }
  /* Return any other type  =============================== END =============================== */
};

const getInputTypeFromJsonType = (jsonType) => {
  switch (jsonType) {
    case "String":
      return "text";
    case "Boolean":
      return "Boolean";
    case "Number":
      return "numeric";
    case "Decimal":
      return "numeric";
    default:
      return jsonType;
  }
};

const getAdornmentFromJsonType = (jsonType, fieldId) => {
  let adornment;
  switch (jsonType) {
    case "Money":
      adornment = "CHF";
      break;
    case "Percent":
      adornment = "%";
      break;
    case "Distance":
      adornment = "m";
      break;
    default:
      return <></>;
  }
  return (
    <InputAdornment key={"numbertype_adornment_" + fieldId} position="end">
      {adornment}
    </InputAdornment>
  );
};

export default FieldValueComponent;
