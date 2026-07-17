import { IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageType, WageTypeDetailed } from "../models/WageType";
import { useTranslation } from "react-i18next";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";
import { useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControllingLoaderData";
import { WageTypeDetails } from "./WageTypeDetails";
import { Add, Refresh, Info } from "@mui/icons-material";
import { ControllingPicker } from "./WageTypeControllingPicker";
import { ActivateWageTypeCheckbox } from "./ActivateWageType";
import { CopyWageTypeDialog } from "./CopyWageTypeDialog";
import { UpdateWageTypeDialog } from "./UpdateWageTypeDialog";


const columnHelper = createColumnHelper<WageTypeDetailed>();
function createColumns() {
	return [
		columnHelper.accessor("wageTypeNumber", {
			cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
			header: ({ t }) => t("Number"),
			size: 80,
		}),
		columnHelper.accessor("displayName", {
			cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
			header: ({ t }) => t("Name"),
			size: 250,
			meta: {
				flex: 1,
			},
		}),
		columnHelper.accessor("isActive", {
			id: "isActive",
			cell: (props) => {
				const wageType = props.row.original;

				return (
					<ActivateWageTypeCheckbox
						wageTypeNumber={wageType.wageTypeNumber.toString()}
						isActive={props.getValue() === true}
					/>
				);
			},
			header: ({ t }) => t("Active"),
			size: 100,
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
			cell: (props) => {
				const { t } = useTranslation();
				const { controlTypesMap } =
					useLoaderData() as WageTypeControllingLoaderData;
				const wageType = props.row.original;
				const wageTypeNumber = wageType.wageTypeNumber.toString();
				const payrollControlling = wageType.attributes?.["PayrollControlling"];
				const automaticControlling =
					!payrollControlling ||
					payrollControlling === "N" ||
					!controlTypesMap.has(wageTypeNumber);
				if (automaticControlling)
					return <Typography noWrap>{t("automatic")}</Typography>;
				return (
					<ControllingPicker
						wageTypeNumber={wageTypeNumber}
						controlTypes={controlTypesMap.get(wageTypeNumber)!}
						multiple={payrollControlling === "Multi"}
					/>
				);
			},
			header: ({ t }) => t("payrun_period_wage_controlling"),
			size: 180,
		}),
		columnHelper.display({
			id: "details",
			cell: (props) => {
				const { t } = useTranslation();
				const [open, setOpen] = useState<boolean>(false);
				return (
					<>
						<Tooltip title={t("Details")}>
							<IconButton size="small" onClick={() => setOpen(true)}>
								<Info />
							</IconButton>
						</Tooltip>
						{open && (
							<WageTypeDetails
								wageType={props.row.original}
								onClose={() => setOpen(false)}
							/>
						)}
					</>
				);
			},
			size: 40,
			meta: {
				alignment: "center",
			},
		}),

		columnHelper.display({
			id: "copy wage type",
			cell: (props) => {
				const { t } = useTranslation();
				const [open, setOpen] = useState<boolean>(false);

				if (!props.row.original.isCopyable) {
					return null;
				}

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
			meta: {
				alignment: "center",
			},
		}),

		columnHelper.display({
			id: "update wage type",
			cell: (props) => {
				const { t } = useTranslation();
				const { collectors } = useLoaderData() as WageTypeControllingLoaderData;
				const [open, setOpen] = useState<boolean>(false);
				const collectorsChangeable = props.row.original.attributes?.["Collectors.Change"] === "Y";
				const wageTypeiIsChangeable = props.row.original.isChangeable;
				if (!collectorsChangeable && !wageTypeiIsChangeable) {
					return null;
				}
				return (
					<>
						<Tooltip title={t("Update wage type")}>
							<IconButton size="small" onClick={() => setOpen(true)}>
								<Refresh />
							</IconButton>
						</Tooltip>

						{open && (
							<UpdateWageTypeDialog
								wageType={props.row.original as WageType}
								collectors={collectors}
								onClose={() => setOpen(false)}
							/>
						)}
					</>
				);
			},
			size: 40,
			meta: {
				alignment: "center",
			},
		}),
	];
}
export const columns = createColumns();
