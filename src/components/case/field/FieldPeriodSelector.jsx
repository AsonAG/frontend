import { useTranslation } from "react-i18next";
import { FieldValueDateComponent } from "./value/FieldValueDateComponent";

function FieldPeriodSelector({field}) {
    const { t } = useTranslation();
    const isStartEndVisible =
        field.timeType != "Timeless" &&
        !field.attributes?.["input.hideStartEnd"];

    const startComponent = isStartEndVisible ? 
        <FieldValueDateComponent propertyName="start" displayName={t("Start")}/> : 
        <div></div>;

    const endComponent = isStartEndVisible && field.timeType != "Moment" ?
        <FieldValueDateComponent propertyName="end" displayName={t("End")} required={field.endMandatory} /> :
        <div></div>

    return <>
        {startComponent}
        {endComponent}
    </>;
}

export default FieldPeriodSelector;