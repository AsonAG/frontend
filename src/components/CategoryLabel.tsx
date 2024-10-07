import { Chip, SxProps, Theme, Typography, useTheme } from "@mui/material";
import React from "react";

type CategoryLabelProps = {
	label: string,
	sx?: SxProps<Theme> | undefined
}

export function CategoryLabel({ label, sx }: CategoryLabelProps) {
	if (!label) return;
	const theme = useTheme();
	const labelComponent = (
		<Typography color="background.default" fontSize={12}>
			{label}
		</Typography>
	);
	return (
		<Chip
			label={labelComponent}
			variant="outlined"
			size="small"
			sx={{ border: 0, px: 0.5, ...sx, ...theme.bgColorFromString(label) }}
		/>
	);
}
