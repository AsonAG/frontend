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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRevalidator } from "react-router-dom";
import { copyWageType } from "../api/FetchClient";

export function CopyWageTypeDialog({
	wageTypeNumber,
	onClose,
}: {
	wageTypeNumber: number;
	onClose: () => void;
}) {
	const routeParams = useParams();
	const { t } = useTranslation();
	const revalidator = useRevalidator();

	const [form, setForm] = useState({
		en: "",
		de: "",
		fr: "",
		it: "",
	});

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);

		try {
			const response = await copyWageType(
				routeParams,
				wageTypeNumber,
				wageTypeNumber,
				form,
			);

			if (
				response &&
				typeof response === "object" &&
				"status" in response &&
				Number(response.status) !== 201
			) {
				setError(
					t("The maximum number of copies has been reached."),
				);
				return;
			}

			await revalidator.revalidate();
			onClose();
		} catch {
			setError(
				t("The maximum number of copies has been reached."),
			);
		}
	};

	return (
		<Dialog open onClose={onClose}>
			<DialogTitle>
				{t("Record wage type labels")}
			</DialogTitle>

			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					{error && (
						<Alert severity="error">
							{error}
						</Alert>
					)}

					<TextField
						label={t("en_culturelabel")}
						value={form.en}
						onChange={(event) =>
							setForm({
								...form,
								en: event.target.value,
							})
						}
					/>

					<TextField
						label={t("de_culturelabel")}
						value={form.de}
						onChange={(event) =>
							setForm({
								...form,
								de: event.target.value,
							})
						}
					/>

					<TextField
						label={t("fr_culturelabel")}
						value={form.fr}
						onChange={(event) =>
							setForm({
								...form,
								fr: event.target.value,
							})
						}
					/>

					<TextField
						label={t("it_culturelabel")}
						value={form.it}
						onChange={(event) =>
							setForm({
								...form,
								it: event.target.value,
							})
						}
					/>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>
					{t("Cancel")}
				</Button>

				<Button
					variant="contained"
					onClick={handleSubmit}
				>
					{t("Save")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}