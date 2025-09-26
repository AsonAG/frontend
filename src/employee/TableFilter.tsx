import {
	Badge,
	FormControlLabel,
	FormGroup,
	FormLabel,
	IconButton,
	IconButtonProps,
	Stack,
	Switch,
	SxProps,
	Theme,
} from "@mui/material";
import React, { Dispatch, useCallback, useContext } from "react";
import * as Popover from "@radix-ui/react-popover";
import { FilterAlt } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { EmployeeTableContext, TableAction } from "./EmployeeTable";

export const EmployeeTableFilter = React.forwardRef<
	HTMLButtonElement,
	IconButtonProps
>((props, ref) => {
	const { t } = useTranslation();
	const { state, dispatch } = useContext(EmployeeTableContext);

	const filterCount = [state.onlyActive, state.onlyWithMissingData].filter(
		Boolean,
	).length;
	const activeChange = useCallback(
		createHandler("toggle_show_inactive", dispatch),
		[dispatch],
	);
	const missingDataChange = useCallback(
		createHandler("toggle_only_with_missing_data", dispatch),
		[dispatch],
	);
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Badge badgeContent={filterCount} color="primary" overlap="circular">
					<IconButton
						color={filterCount > 0 ? "primary" : undefined}
						ref={ref}
						{...props}
					>
						<FilterAlt />
					</IconButton>
				</Badge>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content asChild align="center">
					<Stack
						spacing={2}
						borderRadius={2}
						mx={2}
						my={0.5}
						p={2}
						sx={popoverSx}
						alignItems="start"
					>
						<FormGroup>
							<FormLabel>{t("Filter")}</FormLabel>
							<FormControlLabel
								control={
									<Switch
										checked={state.onlyActive}
										onChange={activeChange}
										size="small"
									/>
								}
								label={t("Hide former employees")}
							/>
							<FormControlLabel
								control={
									<Switch
										checked={state.onlyWithMissingData}
										onChange={missingDataChange}
										size="small"
									/>
								}
								label={t("Only show employees with missing data")}
							/>
						</FormGroup>
					</Stack>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
});
const popoverSx: SxProps<Theme> = {
	border: 1,
	borderColor: "divider",
	bgcolor: (theme) => theme.palette.background.default,
	overflow: "hidden",
	zIndex: (theme) => theme.zIndex.appBar,
};

function createHandler(
	type: "toggle_show_inactive" | "toggle_only_with_missing_data",
	dispatch: Dispatch<TableAction>,
) {
	return () => dispatch({ type });
}
