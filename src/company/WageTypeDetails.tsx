import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WageType, WageTypeCollector } from "../models/WageType";
import { getRowGridSx } from "../payrun/utils";

const dialogColumns = getRowGridSx(
	[{ width: 150 }, { width: 150, flex: 1 }],
	2,
);

export function WageTypeDetails({
	wageType,
	onClose,
}: {
	wageType: WageType;
	onClose: () => void;
}) {
	const { t } = useTranslation();

	return (
		<Dialog open onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{wageType.displayName}</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={3}>
					{wageType.description && (
						<Box sx={dialogColumns}>
							<Typography>{t("Description")}</Typography>
							<Typography>{wageType.description}</Typography>
						</Box>
					)}
					<Box sx={dialogColumns}>
						<Typography>{t("Collectors")}</Typography>
						<WageTypeCollectors collectors={wageType.collectors} />
					</Box>
					<Box sx={dialogColumns}>
						<Typography>{t("Controlling")}</Typography>
						<Stack direction="row" flexWrap="wrap" gap={0.5}>
							{wageType.activeControllingTriggers.map((trigger) => (
								<Chip key={trigger} label={t(trigger)} size="small" />
							))}
						</Stack>
					</Box>
					<Stack direction="row" justifyContent="end">
						<Button onClick={onClose}>{t("Close")}</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

function WageTypeCollectors({ collectors }: { collectors: WageTypeCollector[] }) {
	const { t } = useTranslation();
	const [showInactive, setShowInactive] = useState(false);
	const [activeCollectors, inactiveCollectors] = useMemo(
		() => [
			collectors.filter((collector) => collector.isActive),
			collectors.filter((collector) => !collector.isActive),
		],
		[collectors],
	);

	return (
		<Stack direction="row" flexWrap="wrap" gap={0.5}>
			{activeCollectors.map((collector) => (
				<Chip
					key={collector.name}
					label={collector.displayName}
					size="small"
				/>
			))}
			{inactiveCollectors.length > 0 && !showInactive && (
				<Chip
					label={t("inactive_collector_chip", {
						count: inactiveCollectors.length,
					})}
					size="small"
					variant="outlined"
					onClick={() => setShowInactive(true)}
				/>
			)}
			{showInactive &&
				inactiveCollectors.map((collector) => (
					<Chip
						key={collector.name}
						label={collector.displayName}
						size="small"
						variant="outlined"
					/>
				))}
		</Stack>
	);
}
