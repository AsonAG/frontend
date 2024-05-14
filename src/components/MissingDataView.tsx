import React, { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "./ContentLayout";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { CategoryLabel } from "./tasks/CategoryLabel";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
	useAsyncValue,
	useFetcher,
} from "react-router-dom";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { PaginatedContent } from "./PaginatedContent";

const Link = styled(
	forwardRef<any, RouterLinkProps>((itemProps, ref) => {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)(({ theme }) => {
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
		<ContentLayout title={t("Missing data")}>
			<AsyncDataRoute>
				<EmployeeTable />
			</AsyncDataRoute>
		</ContentLayout>
	);
}

type Case = {
	id: number;
	caseName: string;
	displayCaseName: string;
	clusters: string[];
};

type Employee = {
	id: number;
	firstName: string;
	lastName: string;
	cases: Case[];
};

function EmployeeTable() {
	const employees = useAsyncValue() as Employee[];
	return (
		<Stack spacing={2}>
			{employees.map((e) => (
				<EmployeeSection key={e.id} employee={e} />
			))}
		</Stack>
	);
}

function EmployeeSection({ employee }) {
	const caseTasks = employee.cases;

	const ect = caseTasks.filter((ct: Case) => ct.clusters?.includes("ECT"));
	const hrct = caseTasks.filter((ct: Case) => ct.clusters?.includes("HRCT"));

	return (
		<Stack spacing={1}>
			<Typography variant="h6">
				{employee.firstName} {employee.lastName}
			</Typography>
			<Paper variant="outlined">
				<Stack>
					{ect.map((c: Case) => (
						<CaseTask key={c.id} employee={employee} _case={c} type="ECT" />
					))}
					{hrct.map((c: Case) => (
						<CaseTask key={c.id} employee={employee} _case={c} type="HRCT" />
					))}
				</Stack>
			</Paper>
		</Stack>
	);
}

function CaseTask({ employee, type, _case }) {
	return (
		<Link to={`${employee.id}/${encodeURIComponent(_case.name)}`}>
			<Stack spacing={1} flex={1} direction="row" p={1}>
				<CategoryLabel
					label={type}
					sx={{ height: 21, alignSelf: "center", flex: "0 0 60px" }}
				/>
				<Typography fontWeight="bold" fontSize="1rem">
					{_case.displayName}
				</Typography>
			</Stack>
		</Link>
	);
}
