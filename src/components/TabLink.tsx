import {
  NavLinkProps,
  NavLink as RouterLink,
} from "react-router-dom";
import { Badge, Typography } from "@mui/material";
import { styled, Theme } from "@mui/system";
import { Ref, forwardRef } from "react";
import React from "react";



const styling = (theme: Theme) => {
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
    cursor: "pointer",
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
};

const Link = styled(
  forwardRef(function Link(itemProps: NavLinkProps, ref: Ref<HTMLAnchorElement>) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  }),
)(({ theme }) => styling(theme));

const Button = styled("div")(({ theme }) => styling(theme));

export function TabLink({ to, title, badgeCount }: { to: string, title: string, badgeCount?: number }) {
  return (
    <Badge badgeContent={badgeCount} color="warning" variant="oob">
      <Link to={to}>
        <Typography>{title}</Typography>
      </Link>
    </Badge>
  );
}

export function TabButton({ active, title, badgeCount, badgeColor, onClick }) {
  return (
    <Badge badgeContent={badgeCount} color={badgeColor} variant="oob" showZero>
      <Button className={active ? "active" : undefined} onClick={onClick}>
        <Typography>{title}</Typography>
      </Button>
    </Badge>

  )
}
