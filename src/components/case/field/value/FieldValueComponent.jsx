import { useContext } from "react";
import {
	Box,
	Typography,
	Link,
	Stack,
} from "@mui/material";
import FieldValueFileComponent from "./FieldValueFileComponent";
import FieldValueLookupComponent from "./selector/FieldValueLookupComponent";
import FieldValueNumberComponent from "./FieldValueNumberComponent";
import FieldValueListComponent from "./selector/FieldValueListComponent";
import FieldValueTextComponent from "./FieldValueTextComponent";
import FieldValueDateComponent from "./FieldValueDateComponent";
import FieldValueDateTimeComponent from "./FieldValueDateTimeComponent";
import FieldValueBooleanComponent from "./FieldValueBooleanComponent";
import { CaseFormContext } from "../../../../scenes/global/CasesForm";

function FieldValueComponent({ field }) {
	const isReadonly =
		useContext(CaseFormContext) || 
		field.attributes?.["input.readOnly"];

	// TODO validation
	const props = {field, isReadonly}

	if (field.lookupSettings && "lookupName" in field.lookupSettings) {
		return <FieldValueLookupComponent {...props} />;
	}
	
	if (field.attributes?.["input.list"]) {
		return <FieldValueListComponent {...props} />
	} 
	switch (field.valueType) {
		case "None":
			return (
				<Box marginLeft="14px" marginBottom="5px">
					<Typography>{field.displayName}</Typography>
				</Box>
			);
		case "Document":
			return <FieldValueFileComponent {...props} />;
		case "Date": 
			return <FieldValueDateComponent {...props} propertyName="value" />;
		case "DateTime":
			return <FieldValueDateTimeComponent {...props} />;
		case "Boolean":
			return <FieldValueBooleanComponent {...props} />;
		case "WebResource":
			return (
				<Stack>
					<FieldValueTextComponent {...props} />
					<Box m="6px">
						<Link href={field.value} target="_blank" rel="noopener">
							{field.value}
						</Link>
					</Box>
				</Stack>
			);
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
			return <FieldValueNumberComponent {...props} />;
			
		default:
			return <FieldValueTextComponent {...props} />;
	}
};

export default FieldValueComponent;
