import {
	MenuItem,
	Select,
	SelectChangeEvent,
	SxProps,
	Theme,
	Typography,
} from "@mui/material";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WageType } from "../models/WageType";
import { useWageTypeDispatch } from "./WageTypeControlling";

export const ControllingPicker = memo(function ControllingPicker({
	wageType,
}: {
	wageType: WageType;
}) {
	const { t } = useTranslation();
	const dispatch = useWageTypeDispatch();
	// wageType comes from row.original, which already has the pending changes applied.
	const value = wageType.activeControllingTriggers ?? [];

	const options = useMemo(
		() =>
			(wageType.availableControllingTriggers ?? []).map((trigger) => (
				<MenuItem key={trigger.value} value={trigger.value}>
					{trigger.displayName}
				</MenuItem>
			)),
		[wageType.availableControllingTriggers],
	);

	const displayNames = useMemo(
		() =>
			new Map(
				(wageType.availableControllingTriggers ?? []).map((trigger) => [
					trigger.value,
					trigger.displayName,
				]),
			),
		[wageType.availableControllingTriggers],
	);

	if (wageType.availableControllingTriggers.length === 0) {
		return <Typography noWrap>{t("automatic")}</Typography>;
	}

	const handleChange = (event: SelectChangeEvent<string[]>) => {
		const selectedValue = event.target.value;
		const values =
			typeof selectedValue === "string"
				? selectedValue.split(",")
				: selectedValue;

		dispatch({
			type: "set_controlling",
			wageTypeNumber: wageType.wageTypeNumber,
			value: values,
		});
	};

	return (
		<Select
			multiple
			value={value}
			sx={selectSx}
			onChange={handleChange}
			displayEmpty
			renderValue={(selected) => {
				if (selected.length === 0) {
					return <Typography noWrap>{t("No checks")}</Typography>;
				}
				if (selected.length === 1) {
					return (
						<Typography noWrap>
							{displayNames.get(selected[0]) ?? selected[0]}
						</Typography>
					);
				}
				return (
					<Typography noWrap>
						{t("{{count}} checks active", { count: selected.length })}
					</Typography>
				);
			}}
			size="small"
		>
			{options}
		</Select>
	);
});

const selectSx: SxProps<Theme> = {
	width: "100%",
	".MuiSelect-outlined": {
		paddingTop: (theme) => theme.spacing(0.5),
		paddingBottom: (theme) => theme.spacing(0.5),
	},
};
