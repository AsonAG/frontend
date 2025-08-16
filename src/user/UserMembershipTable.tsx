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
      {userMemberships.map(membership => <UserMembershipRow key={membership.id} membership={membership} />)}
      <Outlet />
    </ContentLayout>
  );
}

function UserMembershipRow({ membership }: { membership: UserMembership }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack flex={1}>
        <Typography variant="body1">{membership.firstName} {membership.lastName}</Typography>
        <Typography variant="body2">{membership.email}</Typography>
      </Stack>
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
  return (
    <IconButton component={Link} to={`${membership.id}/edit`}>
      <Edit />
    </IconButton>
  );
}
