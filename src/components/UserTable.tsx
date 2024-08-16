import React, { Dispatch, useEffect, useReducer } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Select,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
  useRadioGroup,
} from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useFetcher, useLoaderData } from "react-router-dom";
import { User } from "../models/User";
import { Division } from "../models/Division";
import { BorderAllSharp, Edit } from "@mui/icons-material";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { Loading } from "./Loading";
import { IdType } from "../models/IdType";

type LoaderData = {
  users: Array<User>,
  divisions: Array<Division>
}

export function UserTable() {
  const { users } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Users")}>
      {users.map(user => <UserRow key={user.id} user={user} />)}
      <Outlet />
    </ContentLayout>
  );
}

function UserRow({ user }: { user: User }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack flex={1}>
        <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </Stack>
      <UserRoles user={user} />

      <EditUserRolesButton user={user} />
    </Stack>
  );
}

function UserRoles({ user }: { user: User }) {
  const role = user.role["$type"];
  const scope = "";
  return (
    <Stack>
      <Typography fontWeight={500}>{role}</Typography>
      {scope &&
        <Typography variant="body2">{scope}</Typography>
      }
    </Stack>
  );
}

function EditUserRolesButton({ user }: { user: User }) {
  return (
    <IconButton component={Link} to={`${user.id}/edit`}>
      <Edit />
    </IconButton>
  );
}
