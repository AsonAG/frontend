import { Stack, Typography } from "@mui/material";
import { React, forwardRef } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Assignment, Check } from "@mui/icons-material";
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


export function TaskTableFilter({stackProps}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const completed = searchParams.has("completed");
  return (
    <Stack direction="row" spacing={4} {...stackProps}>
      <FilterButton label={t("Open")} to="" active={!completed} icon={<Assignment />}/>
      <FilterButton label={t("Completed")} to="?completed=true" active={completed} icon={<Check />}/>
    </Stack>
  )
}

function FilterButton({ label, to, icon, active }) {
  return (
    <Link to={to} className={active ? 'active' : ''}>
      <Stack direction="row" spacing={0.5}>
          {icon}
          <Typography variant="button">{label}</Typography>
      </Stack>
    </Link>
  );
}