import { Stack, Typography, Link } from "@mui/material";
import { DescriptionComponent } from "../DescriptionComponent";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { formatDate } from "../../../utils/DateUtils";
import { useTranslation } from "react-i18next";
import { useListData, useLookupData } from "../../../hooks/useDropdownData";


export function ReadonlyFieldComponent({ field }) {
  const isMobile = useIsMobile();
  const direction = isMobile ? "column" : "row";
  return (
    <Stack spacing={1} direction={direction}>
      <Stack direction="row" spacing={1} flex={1}>
        <Typography flex={isMobile ? 1 : "initial"}>{field.displayName}</Typography>
        <DescriptionComponent description={field.description} />
      </Stack>
      <Typography fontWeight={500} flex={1}>
			  <ReadonlyValueComponent field={field} />
      </Typography>
    </Stack>
  );
};

function ReadonlyValueComponent({field}) {
  const { t } = useTranslation();
	if (field.lookupSettings && "lookupName" in field.lookupSettings) {
		return <ReadonlyDropdownDisplayComponent field={field} useDataHook={useLookupData} />;
	}
	
	if (field.attributes?.["input.list"]) {
    return <ReadonlyDropdownDisplayComponent field={field} useDataHook={useListData} />;
	} 
	switch (field.valueType) {
		case "None":
    case "Document":
			return null;
		case "Date": 
      return formatDate(field.value);
		case "DateTime":
      return formatDate(field.value, true);
		case "Boolean":
      return t(field.value ? "Yes" : "No");
		case "WebResource":
      return <Link href={field.value} target="_blank" rel="noopener">{field.value}</Link>
		case "Integer":
		case "NumericBoolean":
		case "Week":
		case "Decimal":
		case "Year":
		case "Day":
		case "Hour":
		case "Distance":
		case "Month":
		case "Percent":
		case "Money":
			return field.value;
			
		default:
			return field.value;
	}
}

function ReadonlyDropdownDisplayComponent({field, useDataHook}) {
  const data = useDataHook(field);
  if (data.loading) {
    return "Loading...";
  }

  return data.getLabels();
}