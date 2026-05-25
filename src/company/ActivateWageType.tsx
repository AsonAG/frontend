import Checkbox from "@mui/material/Checkbox";
import React, { useContext } from "react";
import { WageTypeSettingsContext } from "./WageTypeControlling";

export function ActivateWageTypeCheckbox({
	wageTypeNumber,
	isActive,
}: {
	wageTypeNumber: string;
	isActive: boolean;
}) {
	const { state, dispatch } = useContext(WageTypeSettingsContext);

	const isActivatedNow = state.activatedWageTypes.includes(wageTypeNumber);
	const checked = isActive || isActivatedNow;

	return (
		<Checkbox
			checked={checked}
			disabled={isActive}
			onChange={(event) => {
				if (event.target.checked) {
					dispatch({
						type: "activate_wage_type",
						wageTypeNumber,
					});
				}
			}}
		/>
	);
}