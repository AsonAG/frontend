import React, { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "./ContentLayout";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { CategoryLabel } from "./CategoryLabel";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
	useAsyncValue
} from "react-router-dom";
import { Paper, Stack, Theme, Typography, styled } from "@mui/material";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { MissingData, MissingDataCase } from "../models/MissingData";
import { useAtomValue } from "jotai";
import { payrollAtom } from "../utils/dataAtoms";
import { IdType } from "../models/IdType";
import { Payroll } from "../models/Payroll";

const Link = styled(
	forwardRef<any, RouterLinkProps>((itemProps, ref) => {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)<RouterLinkProps>(({ theme }: { theme: Theme }) => {
	return {
		textDecoration: "none",
		color: theme.palette.text.primary,
		"&:hover": {
			color: theme.palette.primary.main,
			backgroundColor: theme.palette.primary.hover,
		},
	};
});

export function MissingDataView() {
	const { t } = useTranslation();
	return (
		<ContentLayout title={t("Controlling")}>
			<AsyncDataRoute>
				<EmployeeTable />
			</AsyncDataRoute>
		</ContentLayout>
	);
}

function EmployeeTable() {
	const { t } = useTranslation();
	const missingData = useAsyncValue() as Map<IdType, MissingData>;
	const payroll = useAtomValue(payrollAtom) as Payroll;
	const payrollMissingData = missingData.get(payroll.id);
	return (
		<Stack spacing={2}>
			{(payrollMissingData?.cases.length ?? 0) > 0 &&
				<CompanySection title={t("Company")} data={payrollMissingData} />
			}
			{Array.from(missingData).map(([id, data]) => {
				if (id === payroll.id)
					return;
				return <EmployeeSection key={id} data={data} />;
			})}
		</Stack>
	);
}


function CompanySection({ title, data }) {
	return (
		<Stack spacing={1}>
			<Typography variant="h6">
				{title}
			</Typography>
			<Paper variant="outlined">
				<Stack>
					{data.cases.map((c: MissingDataCase) => (
						<CaseTask key={c.id} objectId={data.id} _case={c} type="CCT" />
					))}
				</Stack>
			</Paper>
		</Stack>
	);

}

function EmployeeSection({ data }) {
	const caseTasks = data.cases;

	const ect = caseTasks.filter((ct: MissingDataCase) => ct.clusters?.includes("ECT"));
	const hrct = caseTasks.filter((ct: MissingDataCase) => ct.clusters?.includes("HRCT"));

	return (
		<Stack spacing={1}>
			<Typography variant="h6">
				{getEmployeeDisplayString(data)}
			</Typography>
			<Paper variant="outlined">
				<Stack>
					{ect.map((c: MissingDataCase) => (
						<CaseTask key={c.id} objectId={data.id} _case={c} type="ECT" />
					))}
					{hrct.map((c: MissingDataCase) => (
						<CaseTask key={c.id} objectId={data.id} _case={c} type="HRCT" />
					))}
				</Stack>
			</Paper>
		</Stack>
	);
}

function CaseTask({ objectId, type, _case }) {
	const subPath = type === "CCT" ? "company" : `employee/${objectId}`;
	return (
		<Link to={`${subPath}/${encodeURIComponent(_case.name)}`}>
			<Stack spacing={1} flex={1} direction="row" p={1}>
				<CategoryLabel
					label={type}
					sx={{ height: 21, alignSelf: "center", flex: "0 0 60px" }}
				/>
				<Typography>
					{_case.displayName}
				</Typography>
			</Stack>
		</Link>
	);
}
