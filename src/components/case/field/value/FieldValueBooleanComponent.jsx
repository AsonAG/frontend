import {
	FormControl,
	FormControlLabel,
	Checkbox,
	Switch as MuiSwitch,
	styled,
	Box,
} from "@mui/material";
import { useContext } from "react";
import { FieldContext } from "../Field";
import { useTranslation } from "react-i18next";

export function FieldValueBooleanComponent() {
	const { field, isReadonly, displayName, buildCase } =
		useContext(FieldContext);
	const checked = field.value ? field.value.toLowerCase() === "true" : false;
	// make sure null values are sent as false
	field.value = checked + "";

	function handleChange(e) {
		field.value = e.target.checked + "";
		buildCase();
	}

	const Control = field.attributes?.["input.switch"] ? Switch : Checkbox;
	return (
		<FormControl sx={{ flex: 1 }}>
			<FormControlLabel
				name={field.name}
				label={displayName}
				labelPlacement="end"
				control={
					<Control
						checked={checked}
						onChange={handleChange}
						disabled={isReadonly}
					/>
				}
			/>
		</FormControl>
	);
}

function Switch({ checked, disabled, ...props }) {
	const { t } = useTranslation();
	return (
		<Box mx={1.25} sx={{ position: "relative" }}>
			<LabelSwitch
				checked={checked}
				disabled={disabled}
				disableRipple
				{...props}
			/>
			<Box component="span" sx={getLabelSx("right", disabled)}>
				{checked ? "" : t("No")}
			</Box>
			<Box component="span" sx={getLabelSx("left", disabled)}>
				{checked ? t("Yes") : ""}
			</Box>
		</Box>
	);
}

const LabelSwitch = styled(MuiSwitch)(({ theme, disabled }) => ({
	height: 22,
	padding: 0,
	position: "relative",
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(36px)",
			"& + .MuiSwitch-track": {
				backgroundColor: disabled
					? theme.palette.action.disabledBackground
					: theme.palette.primary.main,
				opacity: 1,
				border: 0,
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: disabled
			? theme.palette.action.disabled
			: theme.palette.common.white,
		width: 18,
		height: 18,
		borderRadius: "50%",
		position: "relative",
		zIndex: 1,
	},
	"& .MuiSwitch-track": {
		borderRadius: 30,
		backgroundColor: disabled
			? theme.palette.action.disabledBackground
			: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.35)`,
		opacity: "1 !important",
		transition: theme.transitions.create(["background-color"], {
			duration: 300,
		}),
		position: "relative",
	},
}));

function getLabelSx(edge, disabled) {
	return {
		[edge]: 0,
		position: "absolute",
		px: 1,
		lineHeight: "22px",
		fontSize: "12px",
		color: (theme) =>
			disabled ? theme.palette.action.disabled : theme.palette.common.white,
		pointerEvents: "none",
	};
}
