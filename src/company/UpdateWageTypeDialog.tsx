import {
	Alert,
	Button,
	Chip,
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
	WageType,
	WageTypeLocalizationLanguage,
} from "../models/WageType";

type UpdateWageTypeActionData = {
	intent?: "updateWageType";
	success?: boolean;
	error?: string;
};

export function UpdateWageTypeDialog({
	wageType,
	onClose,
}: {
	wageType: WageType;
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
	const [collectors, setCollectors] = useState(wageType.collectors);

	const setLocalization = (
		language: WageTypeLocalizationLanguage,
		value: string,
	) => {
		setNameLocalizations((current) => ({
			...current,
			[language]: value,
		}));
	};

	const toggleCollector = (collectorName: string) => {
		setCollectors((current) =>
			current.map((collector) =>
				collector.name === collectorName
					? { ...collector, isActive: !collector.isActive }
					: collector,
			),
		);
	};

	const handleSubmit = () => {
		fetcher.submit(
			{
				intent: "updateWageType",
				wageType: {
					...wageType,
					collectors,
					...(wageType.isLocalizable ? { nameLocalizations } : {}),
				},
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
	const hasChangeableCollectors = collectors.some(
		(collector) => collector.isChangeable,
	);

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
					{fetcher.data?.error && (
						<Alert severity="error">{t(fetcher.data.error)}</Alert>
					)}

					{hasChangeableCollectors && (
						<Stack spacing={2}>
							<Typography variant="h6">{t("Collectors")}</Typography>
							<Stack direction="row" flexWrap="wrap" gap={1}>
								{collectors.map((collector) => (
									<Chip
										key={collector.name}
										label={collector.displayName}
										color={collector.isActive ? "primary" : "default"}
										variant={collector.isActive ? "filled" : "outlined"}
										disabled={!collector.isChangeable}
										onClick={() => toggleCollector(collector.name)}
									/>
								))}
							</Stack>
						</Stack>
					)}

					{wageType.isLocalizable && (
						<Stack spacing={2}>
							<Typography variant="h6">
								{t("Edit wage type label")}
							</Typography>
							<TextField
								label={t("en_culturelabel")}
								value={nameLocalizations.en}
								onChange={(event) =>
									setLocalization("en", event.target.value)
								}
								fullWidth
							/>
							<TextField
								label={t("de_culturelabel")}
								value={nameLocalizations.de}
								onChange={(event) =>
									setLocalization("de", event.target.value)
								}
								fullWidth
							/>
							<TextField
								label={t("fr_culturelabel")}
								value={nameLocalizations.fr}
								onChange={(event) =>
									setLocalization("fr", event.target.value)
								}
								fullWidth
							/>
							<TextField
								label={t("it_culturelabel")}
								value={nameLocalizations.it}
								onChange={(event) =>
									setLocalization("it", event.target.value)
								}
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
