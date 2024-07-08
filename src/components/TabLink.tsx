import {
  NavLinkProps,
  NavLink as RouterLink,
} from "react-router-dom";
import { Badge, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Ref, forwardRef } from "react";
import React from "react";


const Link = styled(
  forwardRef(function Link(itemProps: NavLinkProps, ref: Ref<HTMLAnchorElement>) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  }),
)(({ theme }) => {
  const underline = (opacity = 1.0) => ({
    "::after": {
      opacity,
      content: '""',
      width: "100%",
      height: "0.3em",
      position: "absolute",
      bottom: 0,
      left: 0,
      background: theme.palette.primary.main,
    },
  });
  return {
    display: "block",
    textDecoration: "none",
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(1),
    fontWeight: "bold",
    position: "relative",
    "&:hover": {
      color: theme.palette.primary.main,
      ...underline(0.5),
    },
    "&.active": {
      color: theme.palette.primary.main,
      ...underline(),
    },
    "&.active:hover": {
      color: theme.palette.primary.light,
    },
  };
});

export function TabLink({ to, title, badgeCount }: { to: string, title: string, badgeCount?: number }) {
  return (
    <Badge badgeContent={badgeCount} color="primary" variant="oob">
      <Link to={to}>
        <Typography>{title}</Typography>
      </Link>
    </Badge>
  );
}
