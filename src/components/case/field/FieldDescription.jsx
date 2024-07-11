import { useContext } from "react";
import { Box, Tooltip, styled } from "@mui/material";
import { HtmlContent } from "../../HtmlContent";
import { History, Info } from "@mui/icons-material";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import { FieldContext } from "./Field";
import { Link } from "react-router-dom";

const ButtonBox = styled("div")(({ theme }) =>
	theme.unstable_sx({
		border: 1,
		borderRadius: 1,
		borderColor: theme.palette.inputBorder,
		width: 37,
		height: 37,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: theme.palette.text.secondary,
	}),
);

export function FieldDescription() {
	const { field } = useContext(FieldContext);
	const { description, displayName } = field;
	if (!description) {
		return null;
	}

	return (
		<ResponsiveDialog title={displayName}>
			<ResponsiveDialogTrigger>
				<Tooltip
					arrow
					title={<HtmlContent content={description} />}
					placement="top"
				>
					<ButtonBox>
						<Info />
					</ButtonBox>
				</Tooltip>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<HtmlContent content={description} />
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

export function FieldHistory({ sx }) {
	const { field } = useContext(FieldContext);
	const { name } = field;

	return (
		<Tooltip
			arrow
			title="History"
			placement="top"
		>
			<Box component={Link} to={`history/${encodeURIComponent(name)}`} sx={sx}>
				<ButtonBox>
					<History />
				</ButtonBox>
			</Box>
		</Tooltip>
	);

}
