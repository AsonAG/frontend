
import { useMemo } from "react";
import {
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useParams, useRouteLoaderData, useSubmit } from "react-router-dom";
import { UserMembership } from "../models/User";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle } from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";
import { RoleSelection, useRoleSelection } from "./RoleSelection";

type UserTableData = {
  userMemberships: Array<UserMembership>
  employees: Array<Employee>
  payrolls: Array<Payroll>
}

export function UserMembershipEditDialog() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const { userMembershipId } = useParams();

  const { userMemberships, payrolls, employees } = useRouteLoaderData("userTable") as UserTableData;

  const user = useMemo(() => userMemberships.find(user => user.id === userMembershipId)!, [userMembershipId, userMemberships]);

  const [state, dispatch] = useRoleSelection(user.role);
  const onSave = () => {submit(state.role, { method: "post", encType: "application/json" })};
  return (
    <ResponsiveDialog open>
      <ResponsiveDialogContent>
        <ResponsiveDialogTitle asChild>
          <Typography variant="h6">{t("Change role of {{name}}", {name: `${user.firstName} ${user.lastName}`})}</Typography>
        </ResponsiveDialogTitle>
        <ResponsiveDialogDescription asChild>
          <Typography>{t("Choose a role")}</Typography>
        </ResponsiveDialogDescription>
        <RoleSelection state={state} dispatch={dispatch} payrolls={payrolls} employees={employees} />
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button component={Link} to="..">{t("Cancel")}</Button>
          <Button variant="contained" color="primary" onClick={onSave} disabled={state.role === null}>{t("Save")}</Button>
        </Stack>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
