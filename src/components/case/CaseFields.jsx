import FieldComponent from "./FieldComponent";

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
        start: isoDateWithoutTimeZone(fieldStartDate),
        end: isoDateWithoutTimeZone(fieldEndDate),
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

const isoDateWithoutTimeZone = (date) => {
  if (date == null) return date;
  let timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
  let correctDate = new Date(timestamp);
  return correctDate.toISOString();
};

export default CaseFields;
