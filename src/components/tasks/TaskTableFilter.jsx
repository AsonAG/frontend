import { Stack, Typography } from "@mui/material";
import { React, forwardRef } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Assignment, AssignmentInd } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    textDecoration: "none",
    color: theme.palette.grey[700],
    "&:hover": {
      "color": theme.palette.primary.main,
    },
    "&.active": {
      color: theme.palette.primary.main
    }
  }
});


export function TaskTableFilter() {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2}>
      <FilterButton filterName="showall" label={t("My tasks")} icon={<AssignmentInd />}/>
      <FilterButton filterName="showall" include label={t("All tasks")} icon={<Assignment />}/>
    </Stack>
  )
}

function FilterButton({label, icon, filterName, include = false}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  let active = searchParams.has(filterName);
  if (!include) {
    active = !active;
    searchParams.delete(filterName);
  } else {
    searchParams.append(filterName, "true");
  }
  const to = `?${searchParams}`;
  return (
    <Link to={to} className={active ? 'active' : ''}>
      <Stack direction="row" spacing={0.5}>
          {icon}
          <Typography variant="button">{label}</Typography>
      </Stack>
    </Link>
  );
}