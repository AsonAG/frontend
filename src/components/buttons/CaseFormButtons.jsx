import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, Stack } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigation } from "react-router-dom";
import { Link } from "react-router-dom";

const iconProps = {
	size: "1em",
	sx: {
		color: "common.white",
	},
};

function CaseFormButtons({ backPath, onSubmit }) {
	const navigation = useNavigation();
	const isSubmitting =
		navigation.state === "submitting" && navigation.json?.intent === "addCase";
	const isRedirecting =
		navigation.state === "loading" &&
		navigation.json &&
		navigation.formAction !== navigation.location.pathname;
	const isProcessing = isSubmitting || isRedirecting;
	const icon = isProcessing ? (
		<CircularProgress {...iconProps} />
	) : (
		<SendIcon {...iconProps} />
	);
	const { t } = useTranslation();

	return (
		<Stack direction="row" spacing={2} alignSelf="flex-end">
			<Button disableRipple LinkComponent={Link} to={backPath} relative="path">
				<Typography>{t("Cancel")}</Typography>
			</Button>
			<Button
				disabled={isProcessing}
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

export { CaseFormButtons };
