import React, { forwardRef } from "react";
import { Stack, Typography, Theme, styled } from "@mui/material";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { CategoryLabel } from "./CategoryLabel";

export function CaseTask({ objectId, type, _case }) {
  const subPath = type === "C" ? "company" : `employees/${objectId}`;
  return (
    <Link to={`${subPath}/new/${encodeURIComponent(_case.name)}`}>
      <Stack spacing={1} flex={1} direction="row" p={1}>
        <CategoryLabel
          label={type}
          sx={{ height: 21, alignSelf: "center", flex: "0 0 60px" }}
        />
        <Typography>
          {_case.displayName}
        </Typography>
      </Stack>
    </Link>
  );
}

const Link = styled(
  forwardRef<any, RouterLinkProps>((itemProps, ref) => {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  }),
)<RouterLinkProps>(({ theme }: { theme: Theme }) => {
  return {
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.hover,
    },
  };
});

