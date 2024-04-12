import { Navigate, useOutlet, useLoaderData, NavLink as RouterLink } from "react-router-dom";
import { ContentLayout, PageHeaderTitle } from "../../components/ContentLayout";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { forwardRef } from "react";
import { Edit } from "@mui/icons-material";
import { StatusChip } from "./StatusChip";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  const underline = (opacity = 1.0) => ({
    "::after": {
        opacity,
        content: '""',
        width: "100%",
        height: "0.3em",
        position: "absolute",
        bottom: 0,
        left: 0,
        background: theme.palette.primary.main
    }
  });
  return {
    display: "block",
    textDecoration: "none",
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(1),
    fontWeight: "bold",
    position: "relative",
    "&:hover": {
      "color": theme.palette.primary.main,
      ...underline(0.5)
    },
    "&.active": {
      "color": theme.palette.primary.main,
      ...underline()
    },
    "&.active:hover": {
      "color": theme.palette.primary.light,
    }
  }
});

function TabLink({to, title}) {
    return (
        <Link to={to}>
            <Typography>{title}</Typography>
        </Link>
    )
}

function EmployeeView() {
    const outlet = useOutlet();
    const { employee } = useLoaderData();
    const { t } = useTranslation();
    const isActive = employee.status === "Active";
    
    const header = employee.firstName + " " + employee.lastName;
    
    if (!outlet) {
      const to = isActive ? "new" : "events";
      return <Navigate to={to} replace />
    }
    const title = (
      <Stack direction="row" spacing={1} flex={1} alignItems="center">
        <PageHeaderTitle title={header} />
        <Tooltip title={t("Edit employee")} placement="top" arrow size="sm">
          <IconButton component={RouterLink} to="edit" color="primary" size="small">
            <Edit />
          </IconButton>
        </Tooltip>
        <StatusChip status={employee.status} />
      </Stack>
    );
    return (
        <ContentLayout title={title}>
            <Stack direction="row" spacing={2}>
                {isActive && <TabLink title={t("New event")} to="new" /> }
                <TabLink title={t("Events")} to="events" />
                <TabLink title={t("Documents")} to="documents" />
                {isActive && <TabLink title={t("Missing data")} to="missingdata" /> }
            </Stack>
            {outlet}
        </ContentLayout>
    )
}

export default EmployeeView;
