import React, { forwardRef } from "react";
import { Stack, Typography, Theme, styled, SxProps } from "@mui/material";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { CategoryLabel } from "./CategoryLabel";

type CaseTaskProps = {
  objectId: string
  type: "C" | "E" | "HR" | "P"
  _case: {
    name: string
    displayName: string
  }
  stackSx?: SxProps<Theme>
}

export function CaseTask({ objectId, type, _case, stackSx }: CaseTaskProps) {
  const subPath = type === "C" ? "company" : `employees/${objectId}`;
  return (
    <Link to={`${subPath}/new/${encodeURIComponent(_case.name)}`}>
      <Stack spacing={1} direction="row" p={1} sx={stackSx} justifySelf="start">
        <CategoryLabel
          label={type}
          sx={{ height: 21, alignSelf: "center", width: 60 }}
        />
        <Typography>
          {_case.displayName}
        </Typography>
      </Stack>
    </Link >
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

