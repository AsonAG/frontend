import { Stack, Typography, Link } from "@mui/material";
import { DescriptionComponent } from "../DescriptionComponent";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import { useListData, useLookupData } from "../../../hooks/useDropdownData";
import { formatCaseValue } from "../../../utils/Format";


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
  return formatCaseValue(field, t);
}

function ReadonlyDropdownDisplayComponent({field, useDataHook}) {
  const data = useDataHook(field);
  if (data.loading) {
    return "Loading...";
  }

  return data.getLabels();
}