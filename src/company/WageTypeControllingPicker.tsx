import {
	MenuItem,
	Select,
	SelectChangeEvent,
	SxProps,
	Theme,
	Typography,
} from "@mui/material";
import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WageTypeSettingsContext } from "./WageTypeControlling";

export function ControllingPicker({
	wageTypeNumber,
	controlTypes,
	multiple,
}: {
	wageTypeNumber: string;
	controlTypes: Map<string, string>;
	multiple: boolean;
}) {
	const { t } = useTranslation();
	const { state, dispatch } = useContext(WageTypeSettingsContext);
	const value = state.payrollControlling[wageTypeNumber] ?? [];

	const handleChange = (event: SelectChangeEvent<typeof value>) => {
		const {
			target: { value },
		} = event;
		const values =
			value === "" ? [] : typeof value === "string" ? value.split(",") : value;
		dispatch({ type: "set_controlling", wageTypeNumber, value: values });
	};
	const options = useMemo(() => {
		return [...controlTypes].map((kv) => (
			<MenuItem key={kv[0]} value={kv[0]}>
				{kv[1]}
			</MenuItem>
		));
	}, [controlTypes]);

	return (
		<Select
			multiple={multiple}
			value={value}
			sx={selectSx}
			onChange={handleChange}
			displayEmpty
			renderValue={(selected) => {
				let label = "No checks";
				if (selected.length === 1) {
					label = controlTypes.get(selected[0])!;
				} else if (selected.length > 1) {
					label = "{{count}} checks active";
				}
				return (
					<Typography noWrap>{t(label, { count: selected.length })}</Typography>
				);
			}}
			size="small"
		>
			{!multiple && (
				<MenuItem key="" value="">
					{t("No checks")}
				</MenuItem>
			)}
			{options}
		</Select>
	);
}

const selectSx: SxProps<Theme> = {
	width: "100%",
	".MuiSelect-outlined": {
		paddingTop: (theme) => theme.spacing(0.5),
		paddingBottom: (theme) => theme.spacing(0.5),
	},
};
