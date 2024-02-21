import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { EditFieldValueComponent } from "./value/EditFieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CaseForm";
import { useTheme } from "@emotion/react";
import { FieldPeriodSelector } from "./FieldPeriodSelector";

export const FieldContext = createContext();

export function EditFieldComponent({ field }) {
	const { buildCase, attachments } = useContext(CaseFormContext);
	const isReadonly = field.attributes?.["input.readOnly"] ?? false;
	const required = !field.optional;
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));
	const displayName = !mobile ? field.displayName : '';

	return (
		<FieldContext.Provider value={{ field, displayName, buildCase, attachments, isReadonly, required }} >
			{
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
			gridTemplateColumns="1fr 22px 135px 135px"
			alignItems="center"
			columnGap="8px"
		>
			<EditFieldValueComponent />
			<DescriptionComponent description={field.description} />
			<FieldPeriodSelector field={field} />
		</Box>
	)
}

const componentProps = {
	sx: { flex: 1 }
};

function MobileLayout({field}) {
	const renderPeriodPickerContainer = (children) => <Stack spacing={1} direction="row">{children}</Stack>;
	return (
		<Stack spacing={1}>
			<Stack direction="row" spacing={1}>
				<Typography color="disabled" flex={1}>{field.displayName}&nbsp;*</Typography>
				<DescriptionComponent description={field.description} />
			</Stack>
			<EditFieldValueComponent excludeNoneValue />
			<FieldPeriodSelector field={field} renderIntoContainer={renderPeriodPickerContainer} componentProps={componentProps} />
		</Stack>
	);
}