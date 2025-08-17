import {
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { UserMembership } from "../models/User";
import { Edit } from "@mui/icons-material";

type LoaderData = {
  userMemberships: Array<UserMembership>
}

export function UserMembershipTable() {
  const { userMemberships } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Users")}>
      <Stack spacing={1}>
        {userMemberships.map(membership => <UserMembershipRow key={membership.id} membership={membership} />)}
      </Stack>
      <Outlet />
    </ContentLayout>
  );
}

function UserMembershipRow({ membership }: { membership: UserMembership }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="body1" flex={1}>{membership.firstName} {membership.lastName}</Typography>
      <UserRoles membership={membership} />

      <EditUserRolesButton membership={membership} />
    </Stack>
  );
}

function UserRoles({ membership }: { membership: UserMembership }) {
  const role = membership.role["$type"];
  return (
    <Stack>
      <Typography fontWeight={500}>{role}</Typography>
    </Stack>
  );
}

function EditUserRolesButton({ membership }: { membership: UserMembership }) {
  const disabled = membership.role.$type === "Owner";
  return (
    <IconButton component={Link} to={`${membership.id}/edit`} disabled={disabled} size="small">
      <Edit />
    </IconButton>
  );
}
