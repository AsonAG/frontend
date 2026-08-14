import { Add } from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { WageType } from "../models/WageType";
import { ActivateWageTypeCheckbox } from "./ActivateWageType";
import { CopyWageTypeDialog } from "./CopyWageTypeDialog";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";
import { WageTypeCollectorsChip } from "./WageTypeCollectorsChip";
import { ControllingPicker } from "./WageTypeControllingPicker";
import { WageTypeDetails } from "./WageTypeDetails";
import { WageTypeNameLocalizationEdit } from "./WageTypeNameLocalizationEdit";

const columnHelper = createColumnHelper<WageType>();

function createColumns() {
	return [
		columnHelper.accessor("wageTypeNumber", {
			cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
			header: ({ t }) => t("Number"),
			size: 80,
		}),
		columnHelper.accessor("displayName", {
			cell: (props) => (
				<WageTypeNameLocalizationEdit wageType={props.row.original} />
			),
			header: ({ t }) => t("Name"),
			meta: { flex: 1 },
		}),
		columnHelper.accessor("isActive", {
			id: "isActive",
			cell: (props) => (
				<ActivateWageTypeCheckbox
					wageTypeNumber={props.row.original.wageTypeNumber}
					isActive={props.getValue()}
				/>
			),
			header: ({ t }) => t("Active"),
			size: 55,
		}),
		columnHelper.display({
			id: "debit",
			cell: (props) => (
				<WageTypeAccountPicker
					wageType={props.row.original}
					accountType="debitAccountNumber"
				/>
			),
			header: ({ t }) => t("Debit"),
			size: 180,
		}),
		columnHelper.display({
			id: "credit",
			cell: (props) => (
				<WageTypeAccountPicker
					wageType={props.row.original}
					accountType="creditAccountNumber"
				/>
			),
			header: ({ t }) => t("Credit"),
			size: 180,
		}),
		columnHelper.display({
			id: "controlling",
			cell: (props) => <ControllingPicker wageType={props.row.original} />,
			header: ({ t }) => t("payrun_period_wage_controlling"),
			size: 180,
		}),
		columnHelper.display({
			id: "collectors",
			cell: (props) => <WageTypeCollectorsChip wageType={props.row.original} />,
			header: ({ t }) => t("Collectors"),
			size: 90,
		}),
		columnHelper.display({
			id: "details",
			cell: (props) => <WageTypeDetails wageType={props.row.original} />,
			size: 40,
			meta: { alignment: "center" },
		}),
		columnHelper.display({
			id: "copy",
			cell: (props) => {
				const { t } = useTranslation();
				const [open, setOpen] = useState(false);
				if (!props.row.original.isCopyable) return null;

				return (
					<>
						<Tooltip title={t("Copy wage type")}>
							<IconButton size="small" onClick={() => setOpen(true)}>
								<Add />
							</IconButton>
						</Tooltip>
						{open && (
							<CopyWageTypeDialog
								wageTypeNumber={props.row.original.wageTypeNumber}
								onClose={() => setOpen(false)}
							/>
						)}
					</>
				);
			},
			size: 40,
			meta: { alignment: "center" },
		}),
	];
}

export const columns = createColumns();
