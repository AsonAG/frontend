import { useContext } from "react";
import {
	Box,
	Typography,
	Link,
	Stack,
} from "@mui/material";
import { FieldValueFileComponent } from "./FieldValueFileComponent";
import { FieldValueLookupComponent, FieldValueListComponent } from "./FieldValueDropdownComponent";
import { FieldValueNumberComponent } from "./FieldValueNumberComponent";
import { FieldValueTextComponent } from "./FieldValueTextComponent";
import { FieldValueDateComponent } from "./FieldValueDateComponent";
import { FieldValueBooleanComponent } from "./FieldValueBooleanComponent";
import { FieldContext } from "../EditFieldComponent";

export function EditFieldValueComponent() {
	const { field } = useContext(FieldContext);
	if (field.attributes["input.hidden"])
		return null;
	if (field.lookupSettings && "lookupName" in field.lookupSettings) {
		return <FieldValueLookupComponent />;
	}
	
	if (field.attributes?.["input.list"]) {
		return <FieldValueListComponent />
	} 
	switch (field.valueType) {
		case "None":
			const fontWeight = field.attributes?.["text.bold"] ? "bold" : undefined;
			return (
				<Box sx={{display: "flex", flexDirection: "column", justifyContent: 'center'}}>
					<Typography fontWeight={fontWeight}>{field.displayName}</Typography>
				</Box>
			);
		case "Document":
			return <FieldValueFileComponent />;
		case "Date": 
			return <FieldValueDateComponent />;
		case "DateTime":
			return <FieldValueDateComponent variant="datetime" />;
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