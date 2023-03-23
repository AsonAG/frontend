import { useMemo, useState, Fragment, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ApiClient from "../../../ApiClient";
import CasesApi from "../../../api/CasesApi";
import {
  Box,
  InputAdornment,
  IconButton,
  Checkbox,
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Field = ({ field, onChange }) => {
  const [isTimeSettingVisible, setTimeSettingVisible] = useState(
    field.start || field.end
  );
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldValue, setFieldValue] = useState(field.value);
  const [fieldStartDate, setFieldStartDate] = useState(
    field.start ? new Date(field.start) : null
  );
  const [fieldEndDate, setFieldEndDate] = useState(
    field.end ? new Date(field.end) : null
  );
// LookUp options ================================ START ================================
  const [isLookupOpened, setLookupOpened] = useState(false);
  const [lookupOptions, setLookupOptions] = useState([]);
  const lookupLoading = isLookupOpened && lookupOptions?.length === 0;
  const casesApi = useMemo(() => new CasesApi(ApiClient), []);
  useEffect(() => {
    let active = true;
    if (!lookupLoading) {
      return undefined;
    }
    casesApi.getCaseFieldLookups(field.lookupSettings.lookupName, callbackLookups);
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
    console.log(
      "Lookups: " +
        JSON.stringify(data[0].values, null, 2)
    );
  };

  const handleInputLookupValueChange = (e, option) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    let newValue = option ? JSON.parse(option.value)[field.lookupSettings.valueFieldName] : null;
    setFieldValue(newValue);
    console.log("lookup input change:" + newValue + " field text:" );//+ JSON.parse(option.value)[field.lookupSettings.textFieldName]);
  };
// LookUp options ================================ END ================================ 


  const handleInputValueChange = (e) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    setFieldValue(e.target.value);
    console.log("input change:" + e.target.value + " fieldValue:" + fieldValue);
    // }
  };

  const handleInputBooleanValueChange = (e) => {
    console.log("input change: boolean clicked." + e.target.checked);
    setFieldValue(e.target.checked + "");
    console.log("Blur activated");
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      e.target.checked+'',
      fieldStartDate,
      fieldEndDate,
      field.caseSlot
    );
  };

  const handleInputDateValueChange = (dateValue) => {
    dateValue && setFieldValue(new Date(dateValue));
  };

  const handleInputStartDateChange = (dateValue) => {
    dateValue && setFieldStartDate(new Date(dateValue));
    // setFieldStartDate(dateValue);
  };

  const handleInputEndDateChange = (dateValue) => {
    dateValue && setFieldEndDate(new Date(dateValue));
    // setFieldEndDate(dateValue);
  };

  const handleTextfieldBlur = () => {
    console.log("Blur activated");
    onChange(
      field.caseSlot ? fieldName + "_" + field.caseSlot : fieldName,
      fieldName,
      fieldValue,
      fieldStartDate,
      fieldEndDate,
      field.caseSlot
    );
  };

  const handleTimingButtonClick = () => {
    console.log(
      "Timing button clicked for field with name:",
      field.displayName,
      "popupVisible:",
      isTimeSettingVisible
    );
    setTimeSettingVisible(!isTimeSettingVisible);
  };

  const transformJsonType = (jsonType) => {
    switch (jsonType) {
      case "Number":
        return "numeric";
      case "Boolean":
        return "";
      default:
        break;
    }
  };

  const buildTypedInputField = (jsonType) => {
    if (field.lookupSettings && "lookupName" in field.lookupSettings) {
      return (
        <Autocomplete
          key={"field_textfield_" + field.id}
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
          isOptionEqualToValue={(option, value) => JSON.parse(option.value)[field.lookupSettings.textFieldName] === JSON.parse(value.value)[field.lookupSettings.textFieldName]}
          getOptionLabel={(option) => JSON.parse(option.value)[field.lookupSettings.textFieldName]}
          options={lookupOptions}
          loading={lookupLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.displayName}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {lookupLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}

        // <Autocomplete key={"field_textfield_" + field.id}
        //   multiple
        //   fullWidth
        //   name={field.name}
        //   value={fieldValue}
        //   onChange={(event, newValue) => {
        //     setValue([
        //       ...fixedOptions,
        //       ...newValue.filter(
        //         (option) => fixedOptions.indexOf(option) === -1
        //       ),
        //     ]);
        //   }}
        //   options={top100Films}
        //   getOptionLabel={(option) => option.title}
        //   renderTags={(tagValue, getTagProps) =>
        //     tagValue.map((option, index) => (
        //       <Chip
        //         label={option.title}
        //         {...getTagProps({ index })}
        //         disabled={fixedOptions.indexOf(option) !== -1}
        //       />
        //     ))
        //   }
        //   style={{ width: 500 }}
        //   renderInput={(params) => (
        //     <TextField {...params}
        //       label="field.displayName"
        //       helperText={field.description}
        //       required={!field.optional}
        //       placeholder="Favorites" />
        //   )}
        ></Autocomplete>
      );
    }

    switch (jsonType) {
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
            onAccept={handleTextfieldBlur}
            required={!field.optional}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleInputDateValueChange}
            key={"field_textfield_" + field.id}
          ></DatePicker>
        );
      case "DateTime":
        return (
          <DateTimePicker
            fullWidth
            name={field.name}
            label={field.displayName}
            helperText={field.description}
            onAccept={handleTextfieldBlur}
            required={!field.optional}
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={handleInputDateValueChange}
            key={"field_textfield_" + field.id}
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
                  onChange={handleInputBooleanValueChange}
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
            onChange={handleInputValueChange}
            key={"field_textfield_" + field.id}
            InputProps={{
              inputMode: transformJsonType(field.valueType),
              onBlur: handleTextfieldBlur,
              // pattern: '[0-9]*'  TODO: PATTERN
              // Value types: input definitions according to a type:
              endAdornment:
                field.valueType == "Percent" ? (
                  <InputAdornment
                    key={"numbertype_adornment_" + field.id}
                    position="end"
                  >
                    %
                  </InputAdornment>
                ) : (
                  <span />
                ),
            }}
          />
        );
    }
  };

  return (
    field && (
      <Box
        display="grid"
        gridTemplateColumns="1fr 40px 1fr"
        padding="8px"
        key={"field_inline_" + field.id}
      >
        {/* Input field types {Decimal/Money/Percent/Hour/Day../Distance/NumericBoolean} */}
        {buildTypedInputField(field.valueType)}

        {field.timeType != "Timeless" && (
          <Box
            key={"field_timefield_icon_wrapper" + field.id}
            display="flex"
            flexDirection="row-reverse"
            marginBottom="22px"
          >
            <IconButton
              onClick={handleTimingButtonClick}
              key={"icon_" + field.id}
            >
              <HistoryOutlinedIcon key={"field_timefield_icon_" + field.id} />
            </IconButton>
          </Box>
        )}
        {field.timeType != "Timeless" && isTimeSettingVisible && (
          // fieldStartDate &&
          <Box
            key={"field_textfield_dates" + field.id}
            display="inline-flex"
            justifyContent="flex-start"
            paddingLeft="10px"
            // justifyContent="space-between"
          >
            <DatePicker
              name={field.name + "start"}
              label="Start"
              helperText="Start date"
              onAccept={handleTextfieldBlur}
              required={true}
              value={fieldStartDate}
              onChange={handleInputStartDateChange}
              key={"field_textfield_startdate" + field.id}
            ></DatePicker>
            {field.timeType != "Moment" && (
              <Box key={"field_box_enddate" + field.id} paddingLeft="20px">
                <DatePicker
                  name={field.name + "end"}
                  label="End"
                  helperText="End date"
                  onAccept={handleTextfieldBlur}
                  required={field.endMandatory}
                  value={fieldEndDate}
                  onChange={handleInputEndDateChange}
                  key={"field_textfield_enddate" + field.id}
                ></DatePicker>
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  );
};

export default Field;
