import { ArrowRightAlt } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	SxProps,
	Theme,
	Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { LookupSet } from "../models/LookupSet";
import {
	WageType,
	WageTypeCollector,
	WageTypeLocalizationLanguage,
} from "../models/WageType";
import { WageTypeListLoaderData } from "./WageTypeList";

// A single edited field, rendered as "old value → new value". Values are already formatted
// for display; null stands for "no value", whichever of the several empty spellings the
// wage type used. labelKey is a translation key rather than a translated string so the
// summary can be built outside of a component.
type WageTypeFieldChange = {
	labelKey: string;
	from: string | null;
	to: string | null;
};

export type WageTypeChangeSummaryEntry = {
	key: string;
	wageTypeNumber: number;
	displayName: string;
	fields: WageTypeFieldChange[];
};

const localizationLanguages: WageTypeLocalizationLanguage[] = [
	"en",
	"de",
	"fr",
	"it",
];

const accountFields = [
	{ labelKey: "Debit", accountType: "debitAccountNumber" },
	{ labelKey: "Credit", accountType: "creditAccountNumber" },
] as const;

function formatAccount(
	accountNumber: string | null | undefined,
	accountMaster: LookupSet,
): string | null {
	if (!accountNumber) {
		return null;
	}

	const account = accountMaster.values.find(
		(value) => value.key === accountNumber,
	);

	return account ? `${account.key} ${account.value}` : accountNumber;
}

// The picker appends newly selected triggers in click order, so the same set of triggers
// can come back in a different order than the server sent it. Sorting the display names
// keeps that from reading as a change.
function formatControllingTriggers(
	wageType: WageType,
	triggers: string[] | null | undefined,
): string | null {
	if (!triggers?.length) {
		return null;
	}

	const displayNames = new Map(
		wageType.availableControllingTriggers.map((trigger) => [
			trigger.value,
			trigger.displayName,
		]),
	);

	return triggers
		.map((trigger) => displayNames.get(trigger) ?? trigger)
		.sort()
		.join(", ");
}

function formatCollectors(
	collectors: WageTypeCollector[] | null | undefined,
): string | null {
	const activeCollectors = (collectors ?? [])
		.filter((collector) => collector.isActive)
		.map((collector) => collector.displayName);

	return activeCollectors.length > 0 ? activeCollectors.join(", ") : null;
}

// Diffs the server wage type against the edited one field by field. Comparing the formatted
// values rather than the raw ones means a field only shows up when the change is one the
// user can actually see in the table.
function buildFieldChanges(
	originalWageType: WageType,
	editedWageType: WageType,
	accountMaster: LookupSet,
): WageTypeFieldChange[] {
	const fields: WageTypeFieldChange[] = [];

	for (const { labelKey, accountType } of accountFields) {
		const from = formatAccount(
			originalWageType.accountAssignment?.[accountType],
			accountMaster,
		);
		const to = formatAccount(
			editedWageType.accountAssignment?.[accountType],
			accountMaster,
		);

		if (from !== to) {
			fields.push({ labelKey, from, to });
		}
	}

	const controllingFrom = formatControllingTriggers(
		originalWageType,
		originalWageType.activeControllingTriggers,
	);
	const controllingTo = formatControllingTriggers(
		editedWageType,
		editedWageType.activeControllingTriggers,
	);
	if (controllingFrom !== controllingTo) {
		fields.push({
			labelKey: "payrun_period_wage_controlling",
			from: controllingFrom,
			to: controllingTo,
		});
	}

	const collectorsFrom = formatCollectors(originalWageType.collectors);
	const collectorsTo = formatCollectors(editedWageType.collectors);
	if (collectorsFrom !== collectorsTo) {
		fields.push({
			labelKey: "Collectors",
			from: collectorsFrom,
			to: collectorsTo,
		});
	}

	for (const language of localizationLanguages) {
		const from = originalWageType.nameLocalizations?.[language] || null;
		const to = editedWageType.nameLocalizations?.[language] || null;

		if (from !== to) {
			fields.push({ labelKey: `${language}_culturelabel`, from, to });
		}
	}

	return fields;
}

export function buildWageTypeChangeSummary(
	changedWageTypeKeys: Iterable<string>,
	originalWageTypesByNumber: Record<string, WageType>,
	wageTypesByNumber: Record<string, WageType>,
	accountMaster: LookupSet,
): WageTypeChangeSummaryEntry[] {
	const entries: WageTypeChangeSummaryEntry[] = [];

	for (const key of changedWageTypeKeys) {
		const originalWageType = originalWageTypesByNumber[key];
		const editedWageType = wageTypesByNumber[key];
		if (!originalWageType || !editedWageType) {
			continue;
		}

		const fields = buildFieldChanges(
			originalWageType,
			editedWageType,
			accountMaster,
		);
		if (fields.length === 0) {
			continue;
		}

		entries.push({
			key,
			wageTypeNumber: originalWageType.wageTypeNumber,
			displayName: editedWageType.displayName,
			fields,
		});
	}

	return entries.sort((a, b) => a.wageTypeNumber - b.wageTypeNumber);
}

type WageTypeSaveConfirmDialogProps = {
	changedWageTypeKeys: Iterable<string>;
	originalWageTypesByNumber: Record<string, WageType>;
	wageTypesByNumber: Record<string, WageType>;
	onCancel: () => void;
	onConfirm: () => void;
};

export function WageTypeSaveConfirmDialog({
	changedWageTypeKeys,
	originalWageTypesByNumber,
	wageTypesByNumber,
	onCancel,
	onConfirm,
}: WageTypeSaveConfirmDialogProps) {
	const { t } = useTranslation();
	const { accountMaster } = useLoaderData() as WageTypeListLoaderData;

	const entries = useMemo(
		() =>
			buildWageTypeChangeSummary(
				changedWageTypeKeys,
				originalWageTypesByNumber,
				wageTypesByNumber,
				accountMaster,
			),
		[
			changedWageTypeKeys,
			originalWageTypesByNumber,
			wageTypesByNumber,
			accountMaster,
		],
	);

	return (
		<Dialog open onClose={onCancel} maxWidth="md" fullWidth>
			<DialogTitle>{t("Apply changes")}</DialogTitle>

			<DialogContent dividers>
				{entries.length === 0 ? (
					<Typography>{t("There are no changes to save.")}</Typography>
				) : (
					<Stack spacing={2}>
						<Typography color="text.secondary">
							{t("{{count}} wage types will be updated", {
								count: entries.length,
							})}
						</Typography>

						<Stack divider={<Divider />} spacing={1.5}>
							{entries.map((entry) => (
								<Stack key={entry.key} spacing={0.5}>
									<Typography fontWeight="medium">
										{entry.wageTypeNumber} — {entry.displayName}
									</Typography>

									{entry.fields.map((field) => (
										<WageTypeFieldChangeRow
											key={field.labelKey}
											field={field}
										/>
									))}
								</Stack>
							))}
						</Stack>
					</Stack>
				)}
			</DialogContent>

			<DialogActions>
				<Button onClick={onCancel}>{t("Cancel")}</Button>

				<Button
					variant="contained"
					color="primary"
					onClick={onConfirm}
					disabled={entries.length === 0}
				>
					{t("Save")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const fieldRowSx: SxProps<Theme> = {
	display: "grid",
	gridTemplateColumns: "minmax(120px, 180px) 1fr auto 1fr",
	alignItems: "center",
	columnGap: 1,
};

function WageTypeFieldChangeRow({ field }: { field: WageTypeFieldChange }) {
	const { t } = useTranslation();

	return (
		<Box sx={fieldRowSx}>
			<Typography variant="body2" color="text.secondary" noWrap>
				{t(field.labelKey)}
			</Typography>

			<WageTypeChangeValue value={field.from} isPreviousValue />

			<ArrowRightAlt fontSize="small" sx={{ color: "text.disabled" }} />

			<WageTypeChangeValue value={field.to} />
		</Box>
	);
}

function WageTypeChangeValue({
	value,
	isPreviousValue = false,
}: {
	value: string | null;
	isPreviousValue?: boolean;
}) {
	const { t } = useTranslation();

	if (!value) {
		return (
			<Typography variant="body2" color="text.disabled" fontStyle="italic">
				{t("Not set")}
			</Typography>
		);
	}

	return (
		<Typography
			variant="body2"
			color={isPreviousValue ? "text.secondary" : "text.primary"}
			sx={{ textDecoration: isPreviousValue ? "line-through" : undefined }}
		>
			{value}
		</Typography>
	);
}
