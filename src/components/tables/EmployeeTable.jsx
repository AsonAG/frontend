import { React, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncValue, useLoaderData, Await } from "react-router-dom";
import { Divider, Stack, useMediaQuery } from "@mui/material";
import Header from "../Header";
import { EmployeeRow } from "./EmployeeRow";
import { ErrorView } from "../ErrorView";
import { Loading } from "../Loading";
import { useTheme } from "@emotion/react";

export function EmployeeTableRoute() {
  const { t } = useTranslation();
  const routeData = useLoaderData();
  
  return (
      <Stack p={4} spacing={2} sx={{minHeight: "100%"}}>
          <Header title={t("Employees")} />
          <Suspense fallback={<Loading />}>
              <Await resolve={routeData.data} errorElement={<ErrorView />}>
                  <EmployeeTable />
              </Await>
          </Suspense>
          
      </Stack>
  )
}

export function EmployeeTable() {
  const employees = useAsyncValue();
  const theme = useTheme();
  const variant = useMediaQuery(theme.breakpoints.down("md")) ? "dense" : "default";

  return (
    <Stack gap={1.5} divider={<Divider />}>
      {employees.map((employee, index) => <EmployeeRow key={index} employee={employee} variant={variant} />)}
    </Stack>
  );
};