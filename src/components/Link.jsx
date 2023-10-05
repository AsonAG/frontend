import styled from "@emotion/styled";
import { forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    display: "block",
    textDecoration: "none",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    color: theme.palette.text.primary,
    "&:hover": {
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.hover
    },
    "&.active": {
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.active
    },
    "&.active:hover": {
      "color": theme.palette.primary.light,
    }
  }
});

export { Link };