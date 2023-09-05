import FieldComponent from "./field/FieldComponent";

const CaseFields = ({ inputCase, setOutputCaseFields }) => {

  const handleFieldChange = (
    fieldId,
    fieldName,
    fieldValue,
    fieldStartDate,
    fieldEndDate,
    attachmentFiles
  ) => {
    setOutputCaseFields((current) => ({
      ...current,
      [fieldId]: {
        caseName: inputCase.name,
        caseFieldName: fieldName,
        value: fieldValue,
        start: fieldStartDate,
        end: fieldEndDate,
        documents: attachmentFiles
      },
    }));
  };

  return (
    <>
      {inputCase.fields?.map((field) => (
        <FieldComponent
          field={field}
          onChange={handleFieldChange}
          key={"field_" + field.id}
        />
      ))}
    </>
  );
};

export default CaseFields;
