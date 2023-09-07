import FieldComponent from "./field/FieldComponent";

const CaseFields = ({ inputCase, setOutputCaseFields }) => {

  return (
    <>
      {inputCase.fields?.map((field) => (
        <FieldComponent
          field={field}
          // TODO AJO on change
          onChange={() => {}}
        />
      ))}
    </>
  );
};

export default CaseFields;
