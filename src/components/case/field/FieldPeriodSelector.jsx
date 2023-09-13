import FieldValueDateComponent from "./value/FieldValueDateComponent";

function FieldPeriodSelector({field}) {
    const isStartEndVisible =
        field.timeType != "Timeless" &&
        !field.attributes?.["input.hideStartEnd"];

    const startComponent = isStartEndVisible ? 
        <FieldValueDateComponent propertyName="start" displayName="Start"/> : 
        <div></div>;

    const endComponent = isStartEndVisible && field.timeType != "Moment" ?
        <FieldValueDateComponent propertyName="end" displayName="End" required={field.endMandatory} /> :
        <div></div>

    return <>
        {startComponent}
        {endComponent}
    </>;
}

export default FieldPeriodSelector;