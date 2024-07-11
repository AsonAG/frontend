import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { FieldValueComponent } from "./value/FieldValueComponent";
import { FieldDescription, FieldHistory } from "./FieldDescription";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CaseForm";
import { useTheme } from "@emotion/react";
import { FieldPeriodSelector } from "./FieldPeriodSelector";

export const FieldContext = createContext();

export function Field({ field }) {
	const { buildCase, attachments } = useContext(CaseFormContext);
	const isReadonly = field.attributes?.["input.readOnly"] ?? false;
	const required = !field.optional;
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));
	const displayName = !mobile ? field.displayName : "";

	return (
		<FieldContext.Provider
			value={{
				field,
				displayName,
				buildCase,
				attachments,
				isReadonly,
				required,
			}}
		>
			{mobile ? (
				<MobileLayout field={field} />
			) : (
				<DefaultLayout field={field} />
			)}
		</FieldContext.Provider>
	);
}

function DefaultLayout({ field }) {
	return (
		<Box display="grid" gridTemplateColumns="1fr 135px 135px 37px" columnGap="8px">
			<EditWithDescription />
			<FieldPeriodSelector field={field} />
			<FieldHistory sx={{ gridColumn: 4 }} />
		</Box>
	);
}

function EditWithDescription() {
	return (
		<Stack direction="row" spacing={1}>
			<FieldValueComponent />
			<FieldDescription />
		</Stack>
	);
}

function MobileLayout({ field }) {
	if (field.valueType === "None") {
		return <EditWithDescription />;
	}
	return (
		<Stack spacing={1}>
			<Typography color="disabled" flex={1}>
				{field.displayName}&nbsp;*
			</Typography>
			<EditWithDescription />
			<Stack direction="row" spacing={1}>
				<FieldPeriodSelector field={field} />
				<FieldHistory sx={{ gridColumn: 4 }} />
			</Stack>
		</Stack>
	);
}
