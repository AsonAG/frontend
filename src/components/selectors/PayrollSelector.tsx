import React, { useState, MouseEvent } from "react";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
	Link,
	useLoaderData,
} from "react-router-dom";
import { Tenant } from "../../models/Tenant";
import { Payroll } from "../../models/Payroll";
import { useTranslation } from "react-i18next";
import { useRole } from "../../hooks/useRole";

type LoaderData = {
	tenant: Tenant,
	payroll?: Payroll,
	payrolls: Array<Payroll>
};

export function PayrollSelector() {
	const { t } = useTranslation();
	const { tenant, payroll, payrolls } = useLoaderData() as LoaderData;
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const adminTitle = t("Admin");
	const currentSelection = payroll?.name ?? adminTitle;
	const isAdmin = useRole("admin");

	return (
		<>
			<Button
				color="primary"
				onClick={handleClick}
				endIcon={<ArrowDropDownIcon />}
				sx={{
					minWidth: 0,
					py: 0,
					borderRadius: (theme) => theme.spacing(1),
					"& .MuiButton-endIcon": {
						ml: 0.25,
						mt: -0.5,
					},
				}}
			>
				<Typography
					variant="button"
					textOverflow="ellipsis"
					overflow="hidden"
				>
					{currentSelection}
				</Typography>
			</Button>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{isAdmin && <MenuItem component={Link} to={`/tenants/${tenant.id}`} onClick={handleClose}>{adminTitle}</MenuItem>}
				{
					payrolls.map(payroll => (
						<MenuItem key={payroll.id} component={Link} to={`/tenants/${tenant.id}/payrolls/${payroll.id}`} onClick={handleClose}>
							{payroll.name}
						</MenuItem>
					))
				}
			</Menu>
		</>
	);
}
