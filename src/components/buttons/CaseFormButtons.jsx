import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, Stack } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigation } from "react-router-dom";

const iconProps = {
	size: "1em",
	sx: {
		color: "common.white",
	},
};

export function CaseFormButtons({ backPath, onSubmit, submitting }) {
	const navigation = useNavigation();
	const redirecting = navigation.state === "loading" && navigation.location.state === "case_added";
	const processing = submitting || redirecting;
	const icon = processing ? (
		<CircularProgress {...iconProps} />
	) : (
		<SendIcon {...iconProps} />
	);
	const { t } = useTranslation();

	return (
		<Stack direction="row" spacing={2}>
			<Button disableRipple LinkComponent={Link} to={backPath} relative="path">
				<Typography>{t("Cancel")}</Typography>
			</Button>
			<Button
				disabled={processing}
				disableRipple
				variant="contained"
				color="primary"
				size="large"
				onClick={onSubmit}
				endIcon={icon}
			>
				<Typography fontWeight="bold" color="common.white">
					{t("Save")}
				</Typography>
			</Button>
		</Stack>
	);
}
