
import { useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useActionData, useLoaderData, useParams, useRouteLoaderData, useSubmit } from "react-router-dom";
import { UserMembershipInvitation, UserRole } from "../models/User";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle } from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";
import { Share } from "@mui/icons-material";
import { toast } from "../utils/dataAtoms";
import { RoleSelection, useRoleSelection } from "./RoleSelection";

type LoaderData = {
  employeeEmail: string | null
}

type UserTableData = {
  employees: Array<Employee>
  payrolls: Array<Payroll>
}

export function UserMembershipInviteDialog() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const { employeeId } = useParams();
  const { employeeEmail } = useLoaderData() as LoaderData;
  const { employees, payrolls } = useRouteLoaderData("userTable") as UserTableData;
  const [email, setEmail] = useState<string>(employeeEmail ?? "");
  const invitation = useActionData() as UserMembershipInvitation | undefined;

  const initialRole: UserRole = !!employeeId ? {"$type": "SelfService", employeeId} : {"$type": "Admin"};
  const [state, dispatch] = useRoleSelection(initialRole);

  const onInvite = () => {
    submit({
      email,
      role: state.role
    }, { method: "post", encType: "application/json" });
  };

  if (invitation) {
    const link = `${window.location.origin}/invitation/${invitation.id}`;
    function onShare() {
      navigator.clipboard.writeText(link);
      toast("success", "Copied to clipboard");
    }
    return (
      <ResponsiveDialog open>
        <ResponsiveDialogContent>
          <ResponsiveDialogTitle asChild>
            <Typography variant="h6">{t("User has been invited!")}</Typography>
          </ResponsiveDialogTitle>
          <Typography>{t("The user has been sent an invitation link to {{email}}", {email: invitation.email})}</Typography>
          <Stack direction="row" spacing={1}>
            <TextField value={link} label={t("Invitation link")} fullWidth disabled/>
            <IconButton onClick={onShare}><Share /></IconButton>
          </Stack>
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button component={Link} to="..">{t("Go back")}</Button>
          </Stack>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  return (
    <ResponsiveDialog open>
      <ResponsiveDialogContent>
        <ResponsiveDialogTitle asChild>
          <Typography variant="h6">{t("Invite to organization")}</Typography>
        </ResponsiveDialogTitle>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <ResponsiveDialogDescription asChild>
          <Typography>{t("Choose a role")}:</Typography>
        </ResponsiveDialogDescription>
        <RoleSelection state={state} dispatch={dispatch} payrolls={payrolls} employees={employees} />
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button component={Link} to="..">{t("Cancel")}</Button>
          <Button variant="contained" color="primary" onClick={onInvite} disabled={state.role === null}>{t("Invite")}</Button>
        </Stack>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}