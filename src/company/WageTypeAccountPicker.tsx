import {
	Autocomplete,
	Badge,
	Box,
	createFilterOptions,
	SxProps,
	TextField,
	Theme,
	Typography,
} from "@mui/material";
import React, { memo, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { LookupValue } from "../models/LookupSet";
import { WageType } from "../models/WageType";
import { useWageTypeDispatch, WageTypeListLoaderData } from "./WageTypeList";

type WageTypeAccountPickerProps = {
	wageType: WageType;
	accountType: "debitAccountNumber" | "creditAccountNumber";
};

const filterOptions = createFilterOptions({
	stringify: (option: LookupValue) => option.key + option.value,
});

export const WageTypeAccountPicker = memo(function WageTypeAccountPicker({
	wageType,
	accountType,
}: WageTypeAccountPickerProps) {
	const { accountMaster } = useLoaderData() as WageTypeListLoaderData;

	const dispatch = useWageTypeDispatch();

	// wageType comes from row.original, which already has the pending changes applied.
	const assignment = wageType.accountAssignment?.[accountType] ?? null;

	const value = useMemo(
		() =>
			accountMaster.values.find((account) => account.key === assignment) ??
			null,
		[accountMaster.values, assignment],
	);

	if (!wageType.isAccountingRelevant) {
		return null;
	}

	const handleChange = (selectedValue: LookupValue | null) => {
		dispatch({
			type: "set_account",
			wageTypeNumber: wageType.wageTypeNumber,
			accountType,
			value: selectedValue?.key ?? null,
		});
	};

	return (
		<Autocomplete
			value={value}
			options={accountMaster.values}
			filterOptions={filterOptions}
			renderInput={(params) => (
				<Badge
					variant={!assignment ? "dot" : "standard"}
					color="warning"
					component="div"
					sx={{ width: "100%" }}
				>
					<TextField {...params} />
				</Badge>
			)}
			onChange={(_, selectedValue) => handleChange(selectedValue)}
			getOptionLabel={(option) => `${option.key} ${option.value}`}
			renderOption={(props, option) => {
				const { key, ...optionProps } = props;

				return (
					<Box
						key={key}
						component="li"
						{...optionProps}
						sx={{
							gridColumn: "1 / -1",
							display: "grid !important",
							gridTemplateColumns: "subgrid",
							gap: 1,
						}}
					>
						<Typography display="inline-block">{option.key}</Typography>
						<Typography display="inline-block">{option.value}</Typography>
					</Box>
				);
			}}
			slotProps={{
				popper: {
					placement: "bottom-start",
					style: {
						width: "fit-content",
					},
				},
				listbox: {
					sx: {
						display: "grid",
						gridTemplateColumns: "max-content max-content",
					},
				},
			}}
			sx={autoCompleteSx}
			size="small"
		/>
	);
});

const autoCompleteSx: SxProps<Theme> = {
	".MuiAutocomplete-input": {
		paddingTop: "0 !important",
		paddingBottom: "0 !important",
	},
};
