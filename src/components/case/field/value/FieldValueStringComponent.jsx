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
    return (
      <div key={fieldKey + "_textoption"}>
        {FieldValueTextComponent(
          attributes,
          fieldValue,
          handleTextValueChange,
          required,
          handleTextBlur,
          caseIsReadOnly,
          slotInputProps,
          fieldDisplayName,
          fieldKey
        )}
      </div>
    );
};

export default FieldValueStringComponent;
