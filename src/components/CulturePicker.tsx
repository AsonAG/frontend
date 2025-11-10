import {
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	MenuItem,
	FormControlProps,
} from "@mui/material";
import { t } from "i18next";
import {
	Culture,
	defaultBrowserCulture,
	supportedCultures,
} from "../models/Culture";

type CulturePickerProps = Omit<FormControlProps, "onChange"> & {
	label: string;
	culture: Culture | null;
	onChange: (lang: Culture | null) => void;
};

export function CulturePicker({
	label,
	culture,
	onChange,
	...formControlProps
}: CulturePickerProps) {
	return (
		<FormControl
			fullWidth
			variant="outlined"
			size="small"
			{...formControlProps}
		>
			<InputLabel shrink>{label}</InputLabel>
			<Select
				value={culture ?? ""}
				onChange={(e: SelectChangeEvent) =>
					onChange(e.target.value === "" ? null : (e.target.value as Culture))
				}
				label={label}
				displayEmpty
			>
				<MenuItem value="">{`${t("Automatic")} [${t(defaultBrowserCulture + "_culturelabel")}]`}</MenuItem>
				{supportedCultures.map((culture) => (
					<MenuItem key={culture} value={culture}>
						{t(`${culture}_culturelabel`)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
