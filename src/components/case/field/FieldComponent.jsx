import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import FieldPeriodSelector from "./FieldPeriodSelector";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";

export const FieldContext = createContext();


function FieldComponent({ field }) {
	const { buildCase, displayOnly, attachments } = useContext(CaseFormContext);
	const fieldIsReadonly = displayOnly || (field.attributes?.["input.readOnly"] ?? false);
	const displayName = !displayOnly ? field.displayName : '';
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));

	return (
		<FieldContext.Provider value={{ field, displayName, buildCase, attachments, isReadonly: fieldIsReadonly }}  >
			{
				displayOnly ?
					<ReadonlyLayout field={field} /> :
				mobile ?
					<MobileLayout field={field} /> :
					<DefaultLayout field={field} />
			}
		</FieldContext.Provider>
	);
};

function DefaultLayout({field}) {
	return (
		<Box
			display="grid"
			gridTemplateColumns="3fr 22px minmax(135px, 1fr) minmax(135px, 1fr)"
			alignItems="center"
			columnGap="8px"
		>
			<FieldValueComponent />
			<DescriptionComponent description={field.description} />
			<FieldPeriodSelector field={field} />
		</Box>
	)
}

function ReadonlyLayout({field}) {
	return (
		<Box
			display="grid"
			gridTemplateColumns="minmax(220px, 1fr) 3fr 22px "
			alignItems="center"
			columnGap="8px"
		>
			<Typography color="disabled">{field.displayName}</Typography>
			<FieldValueComponent />
			<DescriptionComponent description={field.description} />
		</Box>
	);
}

function MobileLayout({field}) {
	return <>
		<Box
			display="grid"
			gridTemplateColumns="3fr 22px "
			alignItems="center"
			columnGap="8px"
		>
			<FieldValueComponent />
			<DescriptionComponent description={field.description} />
		</Box>
		<Box
			display="grid"
			gridTemplateColumns="1fr 1fr"
			alignItems="center"
			columnGap="8px"
		>
			<FieldPeriodSelector field={field} />
		</Box>
		</>;
}


export default FieldComponent;
