import { NumericFormat } from "react-number-format";
import { InputAdornment, TextField } from "@mui/material";
import { validateMinMax } from "../../../../services/validators/FieldValueValidator";
import { useContext } from "react";
import { CaseFormContext } from "../../../../scenes/global/CasesForm";

function getDecimalParams(valueType) {
  switch(valueType) {
    case "Integer":
    case "NumericBoolean":
      return { decimalScale: 0, fixedDecimalScale: true };
    case "Money":
      return { decimalScale: 2, fixedDecimalScale: true };
    default:
      return {};
  }
}

function FieldValueNumberComponent({ field, isReadonly }) {
  const { buildCase } = useContext(CaseFormContext);

  const handleBlur = () => {
    // TODO validate
    if (validateMinMax(field.value, field.attributes)) {
      
    }
  }

  const handleChange = (e) => {
    field.value = e.target.value;
  }

  return (
    <NumericFormat
      value={field.value}
      onValueChange={handleChange}

      valueIsNumericString
      // TODO AJO 
      // thousandSeparator={
      //   attributes?.["input.thousandSeparator"]
      //     ? attributes["input.thousandSeparator"]
      //     : " "
      // }
      {...getDecimalParams(field.valueType)}
      customInput={TextField}
      label={field.displayName}
      type={getInputTypeFromJsonType(field.valueType)}
      name={field.name}
      required
      onBlur={handleBlur}
      disabled={isReadonly}
      InputProps={{
        endAdornment: getAdornmentFromJsonType(
          field.valueType,
          field.attributes
        ),
        inputProps: {
          style: { textAlign: "right" },
        },
      }}
    />
  );
};

const getInputTypeFromJsonType = (jsonType) => {
  switch (jsonType) {
    case "String":
      return "text";
    case "Boolean":
      return "Boolean";
    case "Number":
    case "Money":
    case "Decimal":
      return "numeric";
    default:
      return jsonType;
  }
};

const getAdornmentFromJsonType = (jsonType, attributes) => {
  let adornment;
  switch (jsonType) {
    case "Money":
      adornment = attributes?.["input.currency"];
      break;
    case "Percent":
      adornment = "%";
      break;
    case "Decimal":
      adornment = attributes?.["input.units"];
      break;
    default:
      return <></>;
  }
  return (
    <InputAdornment position="end">
      {adornment}
    </InputAdornment>
  );
};

export default FieldValueNumberComponent;
