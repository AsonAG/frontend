import React, { } from "react";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "./ContentLayout";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import {
	useAsyncValue
} from "react-router-dom";
import { Paper, Stack, Typography } from "@mui/material";
import { getEmployeeDisplayString } from "../models/Employee";
import { MissingData, MissingDataCase } from "../models/MissingData";
import { useAtomValue } from "jotai";
import { CaseTask } from "./CaseTask";
import { payrollAtom } from "../utils/dataAtoms";
import { IdType } from "../models/IdType";
import { Payroll } from "../models/Payroll";

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
						<CaseTask key={c.id} objectId={data.id} _case={c} type="C" />
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
						<CaseTask key={c.id} objectId={data.id} _case={c} type="E" />
					))}
					{hrct.map((c: MissingDataCase) => (
						<CaseTask key={c.id} objectId={data.id} _case={c} type="HR" />
					))}
				</Stack>
			</Paper>
		</Stack>
	);
}
