import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router-dom";
import {
	localizationLanguages,
	WageTypeLocalizationLanguage,
} from "../models/WageType";

type CopyWageTypeActionData = {
	intent?: "copyWageType";
	success?: boolean;
	error?: string;
};

export function WageTypeCopyDialog({
	wageTypeNumber,
	onClose,
}: {
	wageTypeNumber: number;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const fetcher = useFetcher<CopyWageTypeActionData>();

	const [form, setForm] = useState<
		Record<WageTypeLocalizationLanguage, string>
	>({
		en: "",
		de: "",
		fr: "",
		it: "",
	});
	const [showErrors, setShowErrors] = useState(false);

	const isMissing = (language: WageTypeLocalizationLanguage) =>
		!form[language].trim();
	const hasMissing = localizationLanguages.some(isMissing);

	const handleSubmit = () => {
		// Every label is required, so keep the dialog open until all are filled in.
		if (hasMissing) {
			setShowErrors(true);
			return;
		}
		fetcher.submit(
			{
				intent: "copyWageType",
				wageTypeNumber,
				copyFromWageTypeNumber: wageTypeNumber,
				nameLocalizations: form,
			},
			{
				method: "post",
				encType: "application/json",
			},
		);
	};

	useEffect(() => {
		if (
			fetcher.data?.intent === "copyWageType" &&
			fetcher.data.success === true
		) {
			onClose();
		}
	}, [fetcher.data, onClose]);

	const isSubmitting = fetcher.state !== "idle";

	return (
		<Dialog open onClose={isSubmitting ? undefined : onClose}>
			<DialogTitle sx={{ pb: 0 }}>{t("Copy wage type")}</DialogTitle>

			<DialogContent sx={{ width: 400 }}>
				<Typography variant="subtitle1" color="text.secondary">
					{t("Record wage type labels")}
				</Typography>

				<Stack spacing={2} sx={{ mt: 2 }}>
					{fetcher.data?.error && (
						<Alert severity="error">{t(fetcher.data.error)}</Alert>
					)}

					{localizationLanguages.map((language) => (
						<TextField
							key={language}
							label={t(`${language}_culturelabel`)}
							value={form[language]}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									[language]: event.target.value,
								}))
							}
							required
							error={showErrors && isMissing(language)}
							helperText={
								showErrors && isMissing(language)
									? t("This label is required.")
									: undefined
							}
						/>
					))}
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					{t("Cancel")}
				</Button>

				<Button
					variant="contained"
					onClick={handleSubmit}
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					{t("Save")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
