import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export function FormItemButton({ label, value, onClick }) {
	return (
		<FormControl variant="outlined">
			<InputLabel shrink>{label}</InputLabel>
			<OutlinedInput
				type="button"
				value={value}
				label={label}
				notched
				sx={{ textAlign: "left" }}
				onClick={onClick}
			/>
		</FormControl>
	);
}
