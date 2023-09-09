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
import { FieldContext } from "../FieldComponent";

function FieldValueComponent() {
	const { field } = useContext(FieldContext);
	// TODO validation
	if (field.lookupSettings && "lookupName" in field.lookupSettings) {
		return <FieldValueLookupComponent />;
	}
	
	if (field.attributes?.["input.list"]) {
		return <FieldValueListComponent />
	} 
	switch (field.valueType) {
		case "None":
			return (
				<Box marginLeft="14px" marginBottom="5px">
					<Typography>{field.displayName}</Typography>
				</Box>
			);
		case "Document":
			return <FieldValueFileComponent />;
		case "Date": 
			return <FieldValueDateComponent propertyName="value" />;
		case "DateTime":
			return <FieldValueDateTimeComponent />;
		case "Boolean":
			return <FieldValueBooleanComponent />;
		case "WebResource":
			return (
				<Stack>
					<FieldValueTextComponent />
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
			return <FieldValueNumberComponent />;
			
		default:
			return <FieldValueTextComponent />;
	}
};

export default FieldValueComponent;
