import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import { FieldValueDateComponent } from "./value/FieldValueDateComponent";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CaseForm";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { FieldPeriodSelector } from "./FieldPeriodSelector";

export const FieldContext = createContext();


export function FieldComponent({ field }) {
	const { buildCase, displayOnly, attachments } = useContext(CaseFormContext);
	const fieldIsReadonly = displayOnly || (field.attributes?.["input.readOnly"] ?? false);
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));
	const displayName = !displayOnly && !mobile ? field.displayName : '';

	return (
		<FieldContext.Provider value={{ field, displayName, buildCase, attachments, isReadonly: fieldIsReadonly }}  >
			{
				mobile ?
					<MobileLayout field={field} /> :
					displayOnly ?
						<ReadonlyLayout field={field} /> :
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


const componentProps = {
	sx: {flex: 1},
	size: "small"
};

function MobileLayout({field}) {
	const renderPeriodPickerContainer = (children) => <Stack spacing={1} direction="row">{children}</Stack>;
	return (
		<Stack spacing={1}>
			<Stack direction="row" spacing={1}>
				<Typography color="disabled" flex={1}>{field.displayName} *</Typography>
				<DescriptionComponent description={field.description} />
			</Stack>
			<FieldValueComponent excludeNoneValue />
			<FieldPeriodSelector field={field} renderIntoContainer={renderPeriodPickerContainer} componentProps={componentProps} />
		</Stack>
	);
}

function isPeriodPickerDisabled(field) { return field.timeType === "Timeless" || field.attributes?.["input.hideStartEnd"];}