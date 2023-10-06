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
import { FieldValueDateComponent, FieldValueDateTimeComponent } from "./FieldValueDateComponent";
import FieldValueBooleanComponent from "./FieldValueBooleanComponent";
import { FieldContext } from "../FieldComponent";

function FieldValueComponent({ excludeNoneValue = false }) {
	const { field } = useContext(FieldContext);
	if (field.lookupSettings && "lookupName" in field.lookupSettings) {
		return <FieldValueLookupComponent />;
	}
	
	if (field.attributes?.["input.list"]) {
		return <FieldValueListComponent />
	} 
	switch (field.valueType) {
		case "None":
			return (!excludeNoneValue &&
				<Box sx={{display: "flex", flexDirection: "column", justifyContent: 'center'}}>
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
					{field.value && <Box m={0.75}>
						<Link href={field.value} target="_blank" rel="noopener">
							{field.value}
						</Link>
					</Box>}
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
