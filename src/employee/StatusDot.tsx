import { Box, BoxProps, styled } from "@mui/material";


type StatusDotProps = BoxProps & {
	isEmployed: boolean
}

export const StatusDot = styled(Box, {
	shouldForwardProp: (prop) => (prop !== "isEmployed"),
})<StatusDotProps>(({ theme, isEmployed }) => {
	return {
		width: 10,
		height: 10,
		backgroundColor: isEmployed ? theme.palette.success.main : theme.palette.error.main,
		borderRadius: 6
	};
});
