import { React, forwardRef } from "react";
import { useAsyncValue, NavLink as RouterLink, Outlet } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import styled from "@emotion/styled";
import { TextSnippet } from '@mui/icons-material';

export function AsyncPayrunJobsView() {
  const { t } = useTranslation();
  return (
    <AsyncDataRoute>
      <PayrunJobsView />
    </AsyncDataRoute>
);
}

function PayrunJobsView() {
  const payrunJobs = useAsyncValue().items;
  
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        {
          payrunJobs.map(payrun => <PayrunCard key={payrun.id} payrun={payrun} />)
        }
      </Stack>
      <Outlet />
    </Stack>
  );
}


const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme, variant}) => ({
  display: "flex",
  width: variant === "small" ? 100 : 200,
  height: 100,
  textDecoration: "none",
  padding: theme.spacing(1),
  borderWidth: "thin",
  borderColor: theme.palette.primary.main,
  borderStyle: "solid",
  borderRadius: theme.spacing(1.5),
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.hover,
  },
  "&.active": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}));

function PayrunCard({payrun}) {
  return (
    <Link to={`${payrun.id}/jobs`}>
      <Stack width="100%">
        <Box flex={1} alignContent="center">
          <TextSnippet fontSize="large"/>
        </Box>
        <Typography noWrap>{payrun.name}</Typography>
      </Stack>
    </Link>
  );
}

