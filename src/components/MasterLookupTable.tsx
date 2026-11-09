import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	SxProps,
	TextField,
	Theme,
	Tooltip,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/system/colorManipulator";
import React, { useState } from "react";
import { useBlocker, useFetcher, useLoaderData } from "react-router-dom";
import { PayrollLookupValue } from "../models/LookupSet";
import { Delete, Replay, RestartAlt } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getStickySx } from "../payrun/utils";

type LoaderData = {
	values: PayrollLookupValue[];
	keyName: string;
	canDelete?: (key: string) => [boolean, string | null];
};

type ActionData = { success?: boolean };

type EditRow = {
	// stable across edits, so a row keeps its inputs (and focus) while its key is typed
	id: string;
	key: string;
	value: string;
	valueLocalizations?: Record<string, string> | null;
	// undefined for rows added since the last load
	original?: PayrollLookupValue;
	// marked for deletion, or for a reset to the regulation value on overrides
	removed: boolean;
};

let nextNewRowId = 0;

function createNewRowId() {
	return `new-${nextNewRowId++}`;
}

function isBlankRow(row: EditRow) {
	return !row.original && row.key.trim() === "" && row.value.trim() === "";
}

function createRows(values: PayrollLookupValue[]): EditRow[] {
	return values.map((value) => ({
		id: `saved-${value.key}`,
		key: value.key,
		value: value.value,
		valueLocalizations: value.valueLocalizations,
		original: value,
		removed: false,
	}));
}

function isRowChanged(row: EditRow) {
	if (isBlankRow(row)) return false;
	return !row.original || row.removed || row.value !== row.original.value;
}

function getKeyError(row: EditRow, rows: EditRow[]): string | null {
	if (row.original || isBlankRow(row)) return null;
	const key = row.key.trim();
	if (key === "") return "Required";
	if (rows.some((r) => r !== row && r.key.trim() === key)) {
		return "Key already exists";
	}
	return null;
}

const changedRowSx: SxProps<Theme> = {
	backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
	borderRadius: 1,
};

const removedValueSx: SxProps<Theme> = {
	"& input": { textDecoration: "line-through" },
};

export function MasterLookupTable() {
	const { t } = useTranslation();
	const { values } = useLoaderData() as LoaderData;
	const fetcher = useFetcher<ActionData>();
	const [rows, setRows] = useState(() => createRows(values));
	const [sourceValues, setSourceValues] = useState(values);
	// id the empty row at the end will keep once typed into, so its inputs stay mounted and focused
	const [draftRowId, setDraftRowId] = useState(createNewRowId);
	const draftRow: EditRow = {
		id: draftRowId,
		key: "",
		value: "",
		removed: false,
	};

	// the loader refetches after a successful save, which becomes the new baseline
	if (sourceValues !== values) {
		setSourceValues(values);
		setRows(createRows(values));
	}

	const dirty = rows.some(isRowChanged);
	const hasErrors = rows.some((row) => getKeyError(row, rows));

	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			dirty && currentLocation.pathname !== nextLocation.pathname,
	);

	const updateRow = (id: string, update: Partial<EditRow>) =>
		setRows((rows) =>
			rows.map((row) => (row.id === id ? { ...row, ...update } : row)),
		);

	const addDraftRow = (update: Partial<EditRow>) => {
		setRows((rows) => [...rows, { ...draftRow, ...update }]);
		setDraftRowId(createNewRowId());
	};

	const removeRow = (row: EditRow) => {
		if (row.original) {
			updateRow(row.id, { removed: true });
		} else {
			setRows((rows) => rows.filter((r) => r.id !== row.id));
		}
	};

	// a new row that was emptied again is dropped once it loses focus
	const onRowBlur = (row: EditRow) =>
		setRows((rows) => rows.filter((r) => r.id !== row.id || !isBlankRow(r)));

	const onSave = () => {
		const payload = rows
			.filter((row) => !row.removed && !isBlankRow(row))
			.map(({ key, value, valueLocalizations }) => ({
				key: key.trim(),
				value,
				valueLocalizations: valueLocalizations ?? null,
			}));
		fetcher.submit(payload, { method: "PUT", encType: "application/json" });
	};

	return (
		<Stack spacing={1}>
			<TableHeader />
			{/* the draft row shares the array with the rows, so React carries it over by key once added */}
			{[...rows, draftRow].map((row) => (
				<ValueRow
					key={row.id}
					row={row}
					keyError={getKeyError(row, rows)}
					onChange={(update) =>
						row === draftRow ? addDraftRow(update) : updateRow(row.id, update)
					}
					onRemove={() => removeRow(row)}
					onUndo={() => updateRow(row.id, { removed: false })}
					onBlur={() => onRowBlur(row)}
				/>
			))}
			<Stack
				direction="row"
				justifyContent="end"
				spacing={1}
				sx={{
					...getStickySx(40, { bottom: 0 }),
					bgcolor: (theme) => theme.palette.background.default,
					pt: 1,
				}}
			>
				<Button
					disabled={!dirty || fetcher.state !== "idle"}
					onClick={() => setRows(createRows(values))}
				>
					{t("Discard")}
				</Button>
				<Button
					variant="contained"
					loading={fetcher.state !== "idle"}
					disabled={!dirty || hasErrors}
					onClick={onSave}
				>
					{t("Save")}
				</Button>
			</Stack>

			{blocker.state === "blocked" && (
				<Dialog open onClose={() => blocker.reset()}>
					<DialogTitle>{t("Unsaved changes")}</DialogTitle>
					<DialogContent>
						<Typography>
							{t(
								"The settings have not been saved. Do you want to discard them?",
							)}
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => blocker.reset()}>{t("Go back")}</Button>
						<Button
							variant="contained"
							color="destructive"
							onClick={() => blocker.proceed()}
						>
							{t("Discard")}
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Stack>
	);
}

type ValueRowProps = {
	row: EditRow;
	keyError: string | null;
	onChange: (update: Partial<EditRow>) => void;
	onRemove: () => void;
	onUndo: () => void;
	onBlur: () => void;
};

function ValueRow({
	row,
	keyError,
	onChange,
	onRemove,
	onUndo,
	onBlur,
}: ValueRowProps) {
	const { t } = useTranslation();
	const isNew = !row.original;
	return (
		<Stack
			direction="row"
			spacing={1}
			alignItems="start"
			sx={isRowChanged(row) ? changedRowSx : undefined}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
					onBlur();
				}
			}}
		>
			<TextField
				value={row.key}
				onChange={(e) => onChange({ key: e.target.value })}
				error={!!keyError}
				helperText={keyError ? t(keyError) : undefined}
				sx={{ width: 120 }}
				size="small"
				disabled={!isNew}
				// saved keys stay selectable, unless the row is marked for removal
				slotProps={
					isNew || row.removed
						? undefined
						: { htmlInput: { readOnly: true, disabled: false } }
				}
			/>
			<TextField
				value={row.value}
				onChange={(e) => onChange({ value: e.target.value })}
				disabled={row.removed}
				sx={{ flex: 1, ...(row.removed ? removedValueSx : {}) }}
				size="small"
			/>
			<RowActionButton row={row} onRemove={onRemove} onUndo={onUndo} />
		</Stack>
	);
}

function RowActionButton({
	row,
	onRemove,
	onUndo,
}: Pick<ValueRowProps, "row" | "onRemove" | "onUndo">) {
	const { t } = useTranslation();
	const { canDelete } = useLoaderData() as LoaderData;

	if (row.removed) {
		return (
			<Tooltip title={t("Undo")}>
				<IconButton tabIndex={-1} onClick={onUndo}>
					<Replay />
				</IconButton>
			</Tooltip>
		);
	}

	const source = row.original?.source;
	if (source === "Regulation" || isBlankRow(row)) {
		return (
			<IconButton tabIndex={-1} disabled>
				<Delete />
			</IconButton>
		);
	}

	// removing an override only resets the key to the regulation value, so it stays usable
	if (source === "PayrollOverride") {
		return (
			<Tooltip title={t("Reset to regulation value")}>
				<IconButton tabIndex={-1} onClick={onRemove}>
					<RestartAlt />
				</IconButton>
			</Tooltip>
		);
	}

	const [deletable, reason] = (row.original && canDelete?.(row.key)) || [
		true,
		null,
	];
	return (
		<Tooltip title={t(reason ?? "Delete")}>
			<span>
				<IconButton tabIndex={-1} onClick={onRemove} disabled={!deletable}>
					<Delete />
				</IconButton>
			</span>
		</Tooltip>
	);
}

function TableHeader() {
	const { t } = useTranslation();
	const { keyName } = useLoaderData() as LoaderData;
	return (
		<Stack direction="row" spacing={1}>
			<Typography fontWeight="bold" sx={{ width: 120 }}>
				{t(keyName)}
			</Typography>
			<Typography fontWeight="bold" sx={{ flex: 1 }}>
				{t("Description")}
			</Typography>
		</Stack>
	);
}
