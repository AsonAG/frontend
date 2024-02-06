import React, { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "./ContentLayout";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { CategoryLabel } from "./tasks/CategoryLabel";
import { Link as RouterLink, LinkProps as RouterLinkProps, useAsyncValue, useFetcher } from "react-router-dom";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";

const Link = styled(forwardRef<any, RouterLinkProps>((itemProps, ref) => {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.hover
    }
  }
});

export function MissingDataView() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Missing data")}>
      <AsyncDataRoute>
        <EmployeeTable />
      </AsyncDataRoute>
    </ContentLayout>
  )
}

type Employee = {
  id: number,
  firstName: string,
  lastName: string
}

function EmployeeTable() {
  const employees = useAsyncValue() as Employee[];
  return (
    <Stack spacing={2}>
      { employees.map(e => <EmployeeSection key={e.id} employee={e} />)}
    </Stack>
  )
}

function EmployeeSection({employee}) {
  const fetcher = useFetcher();
  const { t } = useTranslation();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(employee.id.toString());
    }
  }, [fetcher]);

  if (!fetcher.data) {
    return (
      <Stack>
        <Typography variant="h6">{employee.firstName} {employee.lastName}</Typography>
        <Skeleton height={60} />
      </Stack>
    )
  }

  const {ect, hrct} = fetcher.data;
  
  return (
    <Stack spacing={1}>
      <Typography variant="h6">{employee.firstName} {employee.lastName}</Typography>
      <Paper variant="outlined">
        <Stack>
          {ect.length == 0 && hrct.length == 0 && <Typography p={1}>{t("Data complete.")}</Typography>}
          {ect.map(c => <CaseTask key={c.id} employee={employee} _case={c} type="ECT" />)}
          {hrct.map(c => <CaseTask key={c.id} employee={employee} _case={c} type="HRCT"/>)}
        </Stack>
      </Paper>
    </Stack>
  );
}

function CaseTask({employee, type, _case}) {
  return (
    <Link to={`${employee.id}/${encodeURIComponent(_case.name)}`}>
      <Stack spacing={1} flex={1} direction="row" p={1}>
        <CategoryLabel label={type} sx={{height: 21, alignSelf: "center", flex: "0 0 60px"}}/>
        <Typography fontWeight="bold" fontSize="1rem">{_case.displayName}</Typography>
      </Stack>
    </Link>
  );
}
