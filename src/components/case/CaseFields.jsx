import { format } from "date-fns";
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

// TODO: replace iso date with date without time for Date value types
const getDateWithoutTime = (date) => {
  return date ? format(new Date(date), "yyyy-MM-dd") : null;
}

export default CaseFields;
