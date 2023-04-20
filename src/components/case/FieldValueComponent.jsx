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

function textFieldProps(field, handleTextfieldBlur) {
  return {
    // inputMode: jsonTypeToInputMode(field.valueType),
    // type: jsonTypeToInputMode(field.valueType),
    onBlur: handleTextfieldBlur,
    // pattern: '[0-9]*'  TODO: PATTERN
    // Value types: input definitions according to a type:
    endAdornment: getAdornmentFromJsonType(field.valueType, field.id),
      // field.valueType == "Percent" ? (
      //   <InputAdornment key={"numbertype_adornment_" + field.id} position="end">
      //     %
      //   </InputAdornment>
      // ) : (
      //   <></>
      // ),
  };
}

/**
 * Input field types {Decimal/Money/Percent/Hour/Day../Distance/NumericBoolean}
 */
const FieldValueComponent = ({
  field,
  fieldValue,
  setFieldValue,
  onChange,
}) => {
  // Form validation SX options   ================================ START ================================
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isSaveButtonClicked, setIsSaveButtonClicked } =
    useContext(CaseContext);

  const dateSlotProps = (isRequired, value) => {
    return isSaveButtonClicked && isRequired && value
      ? { textField: { error: true, helperText: "Field can not be empty" } } // TODO: Change error message
      : null;
    // : { textField: { required: true } };
  };
  // Form validation SX options   ================================ END ================================
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
  };
  /* LookUp options   ================================ END ================================ */

  /* Handlers         =============================== START =============================== */
  const handleStringValueChange = (e) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
    // }
  };

  const handleBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    console.log("Blur activated");
    onChange(e.target.checked + "");
  };

  const handleDateValueChange = (dateValue) => {
    // TODO: fix wrong time zone issue
    let newDate = dateValue ? new Date(dateValue) : null;
    setFieldValue(newDate);
    onChange(newDate);
  };

  const handleTextfieldBlur = () => {
    console.log("Blur activated");
    onChange();
  };
  /* Handlers         ================================ END ================================ */

  /* Return lookup    =============================== START =============================== */
  if (field.lookupSettings && "lookupName" in field.lookupSettings) {
    return (
      <Autocomplete
        key={"field_autocomplete_" + field.id}
        // sx={{ width: 300 }}
        open={isLookupOpened}
        onOpen={() => {
          setLookupOpened(true);
        }}
        onClose={() => {
          setLookupOpened(false);
        }}
        onBlur={handleTextfieldBlur}
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
            key={"field_textfield_" + field.id}
            {...params}
            label={field.displayName}
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
    switch (field.valueType) {
      case "None":
        return (
          <Box>
            <Typography>{field.displayName}</Typography>
            <Typography fontStyle="italic">{field.description}</Typography>
          </Box>
        );
      case "Date":
        return (
          <DatePicker
            fullWidth
            name={field.name + "datepicker"}
            label={field.displayName}
            helperText={field.description}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            key={"field_textfield_" + field.id}
            slotProps={dateSlotProps(!field.optional, fieldValue)} // field validation
          ></DatePicker>
        );
      case "DateTime":
        return (
          <DateTimePicker
            fullWidth
            name={field.name}
            label={field.displayName}
            helperText={field.description}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleDateValueChange}
            key={"field_textfield_" + field.id}
            slotProps={dateSlotProps(!field.optional, fieldValue)} // field validation
          ></DateTimePicker>
        );
      case "Boolean":
        return (
          <FormControl required={!field.optional}>
            <FormControlLabel
              name={field.name}
              label={field.displayName}
              labelPlacement="end"
              control={
                <Checkbox
                  checked={
                    fieldValue ? fieldValue.toLowerCase?.() === "true" : false
                  }
                  onChange={handleBooleanValueChange}
                  key={"field_textfield_" + field.id}
                />
              }
            />
            <FormHelperText>{field.description}</FormHelperText>
          </FormControl>
        );
      default: //TextField
        return (
          <TextField
            fullWidth
            name={field.name}
            label={field.displayName}
            helperText={field.description}
            required={!field.optional}
            value={fieldValue ? fieldValue : ""}
            onChange={handleStringValueChange}
            type={getInputTypeFromJsonType(field.valueType)}
            key={"field_textfield_" + field.id}
            InputProps={textFieldProps(field, handleTextfieldBlur)}
            slotProps={{
              textField: { error: true, helperText: "Field can not be empty" },
            }} // THIS slotProps allows textField prop
          />
        );
    }
  /* Return any other type  =============================== END =============================== */
};

export default FieldValueComponent;
