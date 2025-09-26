import React from "react";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "./ContentLayout";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { useAsyncValue } from "react-router-dom";
import { Paper, Stack, Typography } from "@mui/material";
import { getEmployeeDisplayString } from "../models/Employee";
import { MissingData, MissingDataCase } from "../models/MissingData";
import { CaseTask } from "./CaseTask";
import { IdType } from "../models/IdType";

export function MissingDataView() {
	const { t } = useTranslation();
	return (
		<ContentLayout title={t("Missing data")}>
			<AsyncDataRoute>
				<EmployeeTable />
			</AsyncDataRoute>
		</ContentLayout>
	);
}

function EmployeeTable() {
	const missingEmployeeData = useAsyncValue() as Map<IdType, MissingData>;
	return (
		<Stack spacing={2}>
			{Array.from(missingEmployeeData).map(([id, data]) => (
				<EmployeeSection key={id} data={data} />
			))}
		</Stack>
	);
}

function EmployeeSection({ data }) {
	const caseTasks = data.cases;

	const ect = caseTasks.filter((ct: MissingDataCase) =>
		ct.clusters?.includes("ECT"),
	);
	const hrct = caseTasks.filter((ct: MissingDataCase) =>
		ct.clusters?.includes("HRCT"),
	);

	return (
		<Stack spacing={1}>
			<Typography variant="h6">{getEmployeeDisplayString(data)}</Typography>
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
