import { useContext } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { FieldContext } from "../Field";
import { useLookupData, useListData } from "../../../../hooks/useDropdownData";

export function FieldValueLookupComponent() {
	return <FieldValueDropdownComponent useDataHook={useLookupData} />;
}
export function FieldValueListComponent() {
	return <FieldValueDropdownComponent useDataHook={useListData} />;
}

function FieldValueDropdownComponent({ useDataHook }) {
	const { field, isReadonly, required, displayName, buildCase } =
		useContext(FieldContext);

	function onChange(value) {
		field.value = value;
		buildCase();
	}

	const { getLabels: _, ...data } = useDataHook(field, onChange);
	const variant = field.attributes["input.highlighted"] ? "filled" : "outlined";

	return (
		<Autocomplete
			{...data}
			variant={variant}
			disabled={isReadonly}
			fullWidth
			disableClearable={field.attributes["input.disableClear"]}
			renderInput={(params) => (
				<TextField
					{...params}
					required={required}
					variant={variant}
					label={displayName}
					slotProps={{
						input: {
							...params.InputProps,
							endAdornment: (
								<>
									{data.loading ? (
										<CircularProgress color="inherit" size={20} />
									) : null}
									{params.InputProps.endAdornment}
								</>
							)
						},
						htmlInput: {
							...params.inputProps,
							required: required && (data.value?.length ?? 0) === 0,
						}
					}}
					sx={{ flex: 1 }}
				/>
			)}
		/>
	);
}
