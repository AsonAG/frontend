import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
	copyWageType
} from "../api/FetchClient";

export function CopyWageTypeDialog({
	wageTypeNumber,
	onClose,
}: {
	wageTypeNumber: number;
	onClose: () => void;
}) {
	const routeParams = useParams();
	const { t } = useTranslation();
	const [form, setForm] = useState({
		en: "",
		de: "",
		fr: "",
		it: "",
	});

	const handleSubmit = async () => {
		await copyWageType(routeParams, wageTypeNumber, form);
		onClose();
	};

	return (
		<Dialog open onClose={onClose}>
			<DialogTitle>{t("Record wage type labels")}</DialogTitle>

			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField
						label={t("en_culturelabel")}
						value={form.en}
						onChange={(e) =>
							setForm({ ...form, en: e.target.value })
						}
					/>

					<TextField
						label={t("de_culturelabel")}
						value={form.de}
						onChange={(e) =>
							setForm({ ...form, de: e.target.value })
						}
					/>

					<TextField
						label={t("fr_culturelabel")}
						value={form.fr}
						onChange={(e) =>
							setForm({ ...form, fr: e.target.value })
						}
					/>

					<TextField
						label={t("it_culturelabel")}
						value={form.it}
						onChange={(e) =>
							setForm({ ...form, it: e.target.value })
						}
					/>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>{t("Cancel")}</Button>
				<Button variant="contained" onClick={handleSubmit}>
					{t("Save")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}