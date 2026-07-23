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
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router-dom";
import { Collector } from "../models/Collector";
import { WageType } from "../models/WageType";

type UpdateWageTypeActionData = {
	intent?: "updateWageType";
	success?: boolean;
	error?: string;
};

export function UpdateWageTypeDialog({
	wageType,
	collectors,
	onClose,
}: {
	wageType: WageType;
	collectors: Collector[];
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const fetcher = useFetcher<UpdateWageTypeActionData>();

	const [nameLocalizations, setNameLocalizations] = useState({
		en: wageType.nameLocalizations?.en ?? "",
		de: wageType.nameLocalizations?.de ?? "",
		fr: wageType.nameLocalizations?.fr ?? "",
		it: wageType.nameLocalizations?.it ?? "",
	});

	const setLocalization = (
		language: "en" | "de" | "fr" | "it",
		value: string,
	) => {
		setNameLocalizations((current) => ({
			...current,
			[language]: value,
		}));
	};

	const [selectedCollectors, setSelectedCollectors] = useState<string[]>(
		wageType.collectors ?? [],
	);

	const handleSubmit = () => {
		const body = {
			...wageType,
			collectors: selectedCollectors,
			...(wageType.isLocalizable && {
				nameLocalizations,
			}),
		};

		fetcher.submit(
			{
				intent: "updateWageType",
				wageTypeNumber: wageType.wageTypeNumber,
				wageType: body,
			},
			{
				method: "post",
				encType: "application/json",
			},
		);
	};

	useEffect(() => {
		if (
			fetcher.data?.intent === "updateWageType" &&
			fetcher.data.success === true
		) {
			onClose();
		}
	}, [fetcher.data, onClose]);

	const isSubmitting = fetcher.state !== "idle";

	return (
		<Dialog
			open
			onClose={isSubmitting ? undefined : onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>{t("Update wage type")}</DialogTitle>

			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					{wageType.isCollectorChangeable && (
						<Stack spacing={2}>
							<Typography variant="h6">{t("Collectors")}</Typography>

							<Stack direction="row" flexWrap="wrap" gap={1}>
								{collectors.map((collector) => {
									const active = selectedCollectors.includes(collector.name);
									const isChangeable =
										collector.attributes?.["Changeable"] === "Y";

									return (
										<Chip
											key={collector.id}
											label={collector.displayName}
											color={active ? "primary" : "default"}
											variant={active ? "filled" : "outlined"}
											disabled={!isChangeable}
											onClick={() => {
												setSelectedCollectors((current) =>
													active
														? current.filter((x) => x !== collector.name)
														: [...current, collector.name],
												);
											}}
										/>
									);
								})}
							</Stack>
						</Stack>
					)}

					{wageType.isLocalizable && (
						<Stack spacing={2}>
							<Typography variant="h6">{t("Edit wage type label")}</Typography>

							<TextField
								label={t("en_culturelabel")}
								value={nameLocalizations.en}
								onChange={(e) => setLocalization("en", e.target.value)}
								fullWidth
							/>

							<TextField
								label={t("de_culturelabel")}
								value={nameLocalizations.de}
								onChange={(e) => setLocalization("de", e.target.value)}
								fullWidth
							/>

							<TextField
								label={t("fr_culturelabel")}
								value={nameLocalizations.fr}	
								onChange={(e) => setLocalization("fr", e.target.value)}
								fullWidth
							/>

							<TextField
								label={t("it_culturelabel")}
								value={nameLocalizations.it}
								onChange={(e) => setLocalization("it", e.target.value)}
								fullWidth
							/>
						</Stack>
					)}
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
