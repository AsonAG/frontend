import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRevalidator } from "react-router-dom";
import { WageType } from "../models/WageType";
import { Collector } from "../models/Collector";
import { updateWageType } from "../api/FetchClient";
import Chip from "@mui/material/Chip";

export function UpdateWageTypeDialog({
	wageType,
	collectors,
	onClose,
}: {
	wageType: WageType;
	collectors: Collector[];
	onClose: () => void;
}) {
	const routeParams = useParams();
	const { t } = useTranslation();
	const revalidator = useRevalidator();

	const [nameLocalizations, setNameLocalizations] = useState({
		en: wageType.nameLocalizations?.en ?? "",
		de: wageType.nameLocalizations?.de ?? "",
		fr: wageType.nameLocalizations?.fr ?? "",
		it: wageType.nameLocalizations?.it ?? "",
	});

	const [selectedCollectors, setSelectedCollectors] = useState<string[]>(
		wageType.collectors ?? [],
	);

	const handleSubmit = async () => {
		const body = {
			...wageType,
			collectors: selectedCollectors,
			...(wageType.isChangeable && {
				nameLocalizations,
			}),
		};

		await updateWageType(routeParams, wageType.wageTypeNumber, body);
		revalidator.revalidate();
		onClose();
	};

	return (
		<Dialog open onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{t("Update wage type")}</DialogTitle>

			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					{wageType.attributes?.["Collectors.Change"] === "Y" && (<Stack spacing={2}>
						<Typography variant="h6">{t("Collectors")}</Typography>

						<Stack direction="row" flexWrap="wrap" gap={1}>
							{collectors.map((collector) => {
								const active = selectedCollectors.includes(collector.name);
								const isChangeable = collector.attributes?.["Changeable"] === "Y";

								return (
									<Chip
										key={collector.id}
										label={collector.displayName}
										color={active ? "primary" : "default"}
										variant={active ? "filled" : "outlined"}
										clickable={isChangeable}
										disabled={!isChangeable}
										onClick={
											isChangeable
												? () => {
													setSelectedCollectors((current) =>
														active
															? current.filter((x) => x !== collector.name)
															: [...current, collector.name],
													);
												}
												: undefined
										}
									/>
								);
							})}
						</Stack>
					</Stack>
					)}

					{wageType.isChangeable && (
						<Stack spacing={2}>
							<Typography variant="h6">
								{t("Edit wage type label")}
							</Typography>

							<TextField
								label={t("en_culturelabel")}
								value={nameLocalizations.en}
								onChange={(e) =>
									setNameLocalizations({
										...nameLocalizations,
										en: e.target.value,
									})
								}
								fullWidth
							/>

							<TextField
								label={t("de_culturelabel")}
								value={nameLocalizations.de}
								onChange={(e) =>
									setNameLocalizations({
										...nameLocalizations,
										de: e.target.value,
									})
								}
								fullWidth
							/>

							<TextField
								label={t("fr_culturelabel")}
								value={nameLocalizations.fr}
								onChange={(e) =>
									setNameLocalizations({
										...nameLocalizations,
										fr: e.target.value,
									})
								}
								fullWidth
							/>

							<TextField
								label={t("it_culturelabel")}
								value={nameLocalizations.it}
								onChange={(e) =>
									setNameLocalizations({
										...nameLocalizations,
										it: e.target.value,
									})
								}
								fullWidth
							/>
						</Stack>
					)}
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