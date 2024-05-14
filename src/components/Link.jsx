import styled from "@emotion/styled";
import { forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";

const Link = styled(
	forwardRef(function Link(itemProps, ref) {
		const { disableBgHover, flex, ...linkProps } = itemProps; // do not pass custom props to component
		return <RouterLink ref={ref} {...linkProps} role={undefined} />;
	}),
)(({ theme, flex, disableBgHover }) => {
	return {
		flex,
		display: "block",
		textDecoration: "none",
		padding: theme.spacing(1),
		borderRadius: theme.spacing(1),
		color: theme.palette.text.primary,
		"&:hover": {
			color: theme.palette.primary.main,
			backgroundColor: !disableBgHover
				? theme.palette.primary.hover
				: undefined,
		},
		"&.active": {
			color: theme.palette.primary.main,
			backgroundColor: !disableBgHover
				? theme.palette.primary.active
				: undefined,
		},
		"&.active:hover": {
			color: theme.palette.primary.light,
		},
	};
});

export { Link };
