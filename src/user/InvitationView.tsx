import {
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLoaderData, useSubmit } from "react-router-dom";
import { UserMembershipInvitation } from "../models/User";
import { Centered } from "../components/Centered";

export function InvitationView() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const invitation = useLoaderData() as UserMembershipInvitation;


  const onAccept = () => {
    submit(invitation, { method: "post", encType: "application/json" });
  };

  return (
    <Centered>
      <Paper sx={{p: 2, minWidth: 500}}>
        <Stack spacing={2}>
          <Typography variant="h6">{t("Invitation")}</Typography>
          {!!invitation ?
            <Typography>{t("You have been invited to join the organization {{orgName}}.", {orgName: invitation.tenantIdentifier})}</Typography> :
            <Typography>{t("The invitation is invalid")}</Typography>
          }
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button component={Link} to="/orgs">{t("Go back")}</Button>
            {!!invitation && <Button variant="contained" color="primary" onClick={onAccept}>{t("Join")}</Button>}
          </Stack>
        </Stack>
      </Paper>
    </Centered>
  );
}