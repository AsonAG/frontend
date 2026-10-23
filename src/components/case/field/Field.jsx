import {
	Box,
	FormControl,
	FormControlLabel,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import {
	FieldValueComponent,
	hasInputLabel,
} from "./value/FieldValueComponent";
import { FieldDetails } from "./FieldDescription";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CaseForm";
import { useTheme } from "@emotion/react";
import { FieldPeriodSelector } from "./FieldPeriodSelector";

export const FieldContext = createContext();

export function Field({ field, labelAbove = false }) {
	const { buildCase, attachments, renderFieldPeriods } =
		useContext(CaseFormContext);
	const isReadonly = field.attributes?.["input.readOnly"] ?? false;
	const required = !field.optional;
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));
	const showLabelAbove = labelAbove && !mobile && hasInputLabel(field);
	const displayName = !mobile && !showLabelAbove ? field.displayName : "";

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
				<MobileLayout field={field} renderPeriodSelector={renderFieldPeriods} />
			) : showLabelAbove ? (
				<FormControl fullWidth>
					<FormControlLabel
						label={field.displayName}
						labelPlacement="top"
						required={required}
						slotProps={{ typography: { variant: "inherit" } }}
						sx={{
							m: 0,
							gap: 0.5,
							alignItems: "stretch",
							color: "text.secondary",
							typography: "body2",
						}}
						control={
							<DefaultLayout
								field={field}
								renderPeriodSelector={renderFieldPeriods}
							/>
						}
					/>
				</FormControl>
			) : (
				<DefaultLayout
					field={field}
					renderPeriodSelector={renderFieldPeriods}
				/>
			)}
		</FieldContext.Provider>
	);
}

function DefaultLayout({ field, renderPeriodSelector }) {
	if (!renderPeriodSelector) {
		return <EditWithDescription />;
	}
	return (
		<Box display="grid" gridTemplateColumns="1fr 135px 135px" columnGap="8px">
			<EditWithDescription />
			<FieldPeriodSelector field={field} />
		</Box>
	);
}

function EditWithDescription() {
	return (
		<Stack direction="row" spacing={1}>
			<FieldValueComponent />
			<FieldDetails />
		</Stack>
	);
}

function MobileLayout({ field, renderPeriodSelector }) {
	if (field.valueType === "None" || !renderPeriodSelector) {
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
			</Stack>
		</Stack>
	);
}
