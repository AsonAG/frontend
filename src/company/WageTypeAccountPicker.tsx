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
import React, { memo, useContext, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { LookupValue } from "../models/LookupSet";
import { WageType } from "../models/WageType";
import {
	WageTypeContext,
	WageTypeControllingLoaderData,
} from "./WageTypeControlling";

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
	const { accountMaster, wageTypes } =
		useLoaderData() as WageTypeControllingLoaderData;

	const { state, dispatch } = useContext(WageTypeContext);

	const wageTypeNumber = wageType.wageTypeNumber.toString();

	const currentWageType = state.wageTypesByNumber[wageTypeNumber] ?? wageType;

	const assignment = currentWageType.accountAssignment?.[accountType] ?? null;

	const value = useMemo(
		() =>
			accountMaster.values.find((account) => account.key === assignment) ??
			null,
		[accountMaster.values, assignment],
	);

	const accountingRelevant =
		currentWageType.accountAssignment !== null ||
		!Number.isInteger(currentWageType.wageTypeNumber);

	if (!accountingRelevant) {
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
					<Box key={key} component="li" {...optionProps} sx={{ gap: 1 }}>
						<Typography width={70}>{option.key}</Typography>

						<Typography>{option.value}</Typography>
					</Box>
				);
			}}
			size="small"
			sx={autoCompleteSx}
		/>
	);
});

const autoCompleteSx: SxProps<Theme> = {
	".MuiAutocomplete-input": {
		paddingTop: "0 !important",
		paddingBottom: "0 !important",
	},
};
