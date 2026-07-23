import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router-dom";

type CopyWageTypeActionData = {
	intent?: "copyWageType";
	success?: boolean;
	error?: string;
};

export function CopyWageTypeDialog({
	wageTypeNumber,
	onClose,
}: {
	wageTypeNumber: number;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const fetcher = useFetcher<CopyWageTypeActionData>();

	const [form, setForm] = useState({
		en: "",
		de: "",
		fr: "",
		it: "",
	});

	const handleSubmit = () => {
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
			<DialogTitle>{t("Record wage type labels")}</DialogTitle>

			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					{fetcher.data?.error && (
						<Alert severity="error">{t(fetcher.data.error)}</Alert>
					)}

					<TextField
						label={t("en_culturelabel")}
						value={form.en}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								en: event.target.value,
							}))
						}
					/>

					<TextField
						label={t("de_culturelabel")}
						value={form.de}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								de: event.target.value,
							}))
						}
					/>

					<TextField
						label={t("fr_culturelabel")}
						value={form.fr}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								fr: event.target.value,
							}))
						}
					/>

					<TextField
						label={t("it_culturelabel")}
						value={form.it}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								it: event.target.value,
							}))
						}
					/>
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
