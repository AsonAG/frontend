import {
	Badge,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Stack,
	SxProps,
	TextField,
	Theme,
	Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { blend } from "@mui/system/colorManipulator";
import {
	createContext,
	Dispatch,
	memo,
	useContext,
	useDeferredValue,
	useMemo,
	useReducer,
	useState,
} from "react";
import {
	useActionData,
	useBlocker,
	useLoaderData,
	useNavigation,
	useSubmit,
} from "react-router-dom";
import {
	flexRender,
	getCoreRowModel,
	Row,
	useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { columns } from "./WageTypeColumns";
import { getRowGridSx, getStickySx } from "../payrun/utils";
import { LookupSet } from "../models/LookupSet";
import {
	WageType,
	WageTypeAccountAssignment,
	WageTypeCollector,
	WageTypeNameLocalizations,
} from "../models/WageType";
import { WageTypeUpdate } from "../models/WageTypeUpdate";

export type WageTypeControllingLoaderData = {
	wageTypes: WageType[];
	accountMaster: LookupSet;
};

// Pending changes are tracked with the richer WageTypeCollector shape (rather than
// WageTypeUpdate's plain collector names) so the UI can keep showing each collector's
// full state; this gets flattened to names only when the update is submitted.
type WageTypeChange = Omit<WageTypeUpdate, "collectors"> & {
	collectors?: WageTypeCollector[] | null;
};

// Activating and copying a wage type submit through fetchers, so useActionData only ever
// carries the result of this component's own save.
type WageTypeActionData = {
	intent?: "updateWageTypes";
	success?: boolean;
	error?: string;
};

type WageTypeState = {
	// The loader array this state was built from. Kept so a render can tell whether the
	// loader has since refetched and the state needs to be rebuilt from the server data.
	sourceWageTypes: WageType[];
	// The action result the last rebuild accounted for. useActionData keeps returning a
	// successful save long after that save, so identity is what separates "this refetch
	// came from our save" from "some later refetch, with that save still hanging around".
	syncedActionData: WageTypeActionData | undefined;
	wageTypesByNumber: Record<string, WageType>;
	originalWageTypesByNumber: Record<string, WageType>;
	changesByNumber: Record<string, WageTypeChange>;
	dirty: boolean;
};

// Only the dispatch function is shared through context. The state itself reaches the
// cells as `row.original`, which already carries the pending changes layered on top —
// sharing the state here as well would re-render every consumer on every keystroke,
// since a context value change bypasses memo().
export const WageTypeDispatchContext = createContext<Dispatch<WageTypeAction>>(
	() => {
		throw new Error("WageTypeDispatchContext is not initialized.");
	},
);

export function useWageTypeDispatch(): Dispatch<WageTypeAction> {
	return useContext(WageTypeDispatchContext);
}

const tableHeaderHeight = 36;
const headerStickySx = getStickySx(10, { top: 0 });

const defaultRowSx: SxProps<Theme> = {
	minHeight: 42,
	maxHeight: 42,
	alignItems: "center",
};

export function WageTypeControlling() {
	const { t } = useTranslation();
	const { state: navigationState } = useNavigation();
	const submit = useSubmit();
	const actionData = useActionData() as WageTypeActionData | undefined;
	const { wageTypes } = useLoaderData() as WageTypeControllingLoaderData;

	const [state, dispatch] = useReducer(reducer, wageTypes, createInitialState);
	const [showAllWageTypes, setShowAllWageTypes] = useState(false);
	const [search, setSearch] = useState("");

	// The loader refetches whenever an action succeeds — a save, but also an activation or
	// a copy — and the fresh server wage types then become the baseline the UI edits from.
	// Adjusting the state while rendering rather than in an effect keeps the table from
	// painting a frame of the superseded data first.
	if (state.sourceWageTypes !== wageTypes) {
		dispatch({ type: "sync_server_wage_types", wageTypes, actionData });
	}

	const currentWageTypes = useMemo(
		() =>
			wageTypes.map(
				(wageType) =>
					state.wageTypesByNumber[
						formatWageTypeNumber(wageType.wageTypeNumber)
					] ?? wageType,
			),
		[wageTypes, state.wageTypesByNumber],
	);

	// Filtering remounts every visible row, so it trails the input by a frame instead of
	// blocking the keystroke that caused it.
	const deferredSearch = useDeferredValue(search);

	const filteredWageTypes = useMemo(() => {
		const searchValue = deferredSearch.trim().toLowerCase();

		return currentWageTypes.filter((wageType) => {
			const matchesActiveFilter = showAllWageTypes || wageType.isActive;
			const matchesSearch =
				searchValue === "" ||
				formatWageTypeNumber(wageType.wageTypeNumber).includes(searchValue) ||
				wageType.displayName.toLowerCase().includes(searchValue) ||
				wageType.name.toLowerCase().includes(searchValue);

			return matchesActiveFilter && matchesSearch;
		});
	}, [currentWageTypes, deferredSearch, showAllWageTypes]);

	const table = useReactTable({
		columns,
		data: filteredWageTypes,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (wageType) => formatWageTypeNumber(wageType.wageTypeNumber),
	});

	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			state.dirty && currentLocation.pathname !== nextLocation.pathname,
	);

	// Both of these are spread into the sx of every rendered Box. Rebuilding them each
	// render forces emotion to re-serialize the styles of the entire table.
	const leafColumns = table.getVisibleLeafColumns();

	const rowGridSx = useMemo(
		() =>
			getRowGridSx(
				leafColumns.map((column) => ({
					width: column.getSize(),
					flex: column.columnDef.meta?.flex,
				})),
				1,
			),
		[leafColumns],
	);

	const rowSx = useMemo(
		() => ({ ...rowGridSx, ...defaultRowSx }) as SxProps<Theme>,
		[rowGridSx],
	);

	const [rowsByCategory, withoutCategory] = useMemo(() => {
		const grouped = Object.groupBy(
			table.getRowModel().rows,
			({ original }) => original.category?.trim() || "noCategory",
		) as Record<string, Array<Row<WageType>>>;

		const { noCategory, ...categories } = grouped;
		return [categories, noCategory ?? []] as const;
	}, [table.getRowModel().rows]);

	const onSubmit = () => {
		const wageTypeUpdates: WageTypeUpdate[] = Object.values(
			state.changesByNumber,
		).map((change) => ({
			...change,
			collectors: change.collectors
				? activeCollectorNames(change.collectors)
				: change.collectors,
		}));

		if (wageTypeUpdates.length === 0) {
			return;
		}

		submit(
			{
				intent: "updateWageTypes",
				wageTypes: wageTypeUpdates,
			},
			{
				method: "post",
				encType: "application/json",
			},
		);
	};

	return (
		<WageTypeDispatchContext.Provider value={dispatch}>
			<Stack>
				<Stack direction="row" justifyContent="end" spacing={2} sx={{ mb: 1 }}>
					<TextField
						size="small"
						label={t("Search wage type number or name")}
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						sx={{ width: 300 }}
					/>

					<FormControlLabel
						control={
							<Checkbox
								checked={showAllWageTypes}
								onChange={(event) => setShowAllWageTypes(event.target.checked)}
							/>
						}
						label={t("Show inactive wage types")}
					/>
				</Stack>

				<Stack
					sx={{ overflow: "auto", width: "max-content", minWidth: "100%" }}
				>
					{table.getHeaderGroups().map((headerGroup) => (
						<Box
							key={headerGroup.id}
							sx={{
								...rowGridSx,
								...headerStickySx,
								backgroundColor: (theme) => theme.palette.background.default,
								minHeight: tableHeaderHeight,
								maxHeight: tableHeaderHeight,
							}}
						>
							{headerGroup.headers.map((header) => {
								const alignment = header.column.columnDef.meta?.alignment;
								const context = { ...header.getContext(), t };

								return (
									<Typography
										key={header.id}
										variant="h6"
										align={alignment}
										noWrap
										sx={{ px: 0.25, py: 0.5 }}
									>
										{flexRender(header.column.columnDef.header, context)}
									</Typography>
								);
							})}
						</Box>
					))}

					{Object.entries(rowsByCategory).map(([category, rows]) => (
						<WageTypeCategoryGroup
							key={category}
							category={category}
							rows={rows}
							rowSx={rowSx}
						/>
					))}

					<WageTypeCategoryGroup
						category={t("Without category")}
						rows={withoutCategory}
						rowSx={rowSx}
					/>
				</Stack>

				<Stack
					direction="row"
					justifyContent="end"
					sx={{
						...getStickySx(40, { bottom: 0 }),
						bgcolor: (theme) => theme.palette.background.default,
						pt: 1,
					}}
				>
					<Button
						loading={navigationState === "submitting"}
						disabled={!state.dirty}
						disableRipple
						variant="contained"
						color="primary"
						size="large"
						onClick={onSubmit}
					>
						<Typography>{t("Save")}</Typography>
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
		</WageTypeDispatchContext.Provider>
	);
}

type WageTypeCategoryProps = {
	category: string;
	rows: Array<Row<WageType>>;
	rowSx: SxProps<Theme>;
};

function WageTypeCategoryGroup({
	category,
	rows,
	rowSx,
}: WageTypeCategoryProps) {
	const [expanded, setExpanded] = useState(false);

	if (rows.length === 0) {
		return null;
	}

	// row.original is already the wage type with its pending changes applied, so there is
	// nothing to look up in the state here.
	const hasMissingData = rows.some(({ original }) => {
		const accountingRelevant =
			original.accountAssignment !== null ||
			!Number.isInteger(original.wageTypeNumber);

		if (!accountingRelevant) {
			return false;
		}

		return (
			!original.accountAssignment?.debitAccountNumber ||
			!original.accountAssignment?.creditAccountNumber
		);
	});

	return (
		<>
			<WageTypeCategoryHeader
				header={category}
				expanded={expanded}
				onClick={() => setExpanded((current) => !current)}
				hasMissingData={hasMissingData}
			/>

			{expanded &&
				rows.map((row) => <WageTypeRow key={row.id} row={row} rowSx={rowSx} />)}
		</>
	);
}

const cellSx: SxProps<Theme> = { px: 0.25, py: 0.5 };

type WageTypeRowProps = {
	row: Row<WageType>;
	rowSx: SxProps<Theme>;
};

// Editing one wage type replaces the table's data array, so every Row instance is rebuilt
// even though only a single wage type actually changed. Comparing row.original instead of
// the Row wrapper lets the untouched rows — and the ~15 MUI components each of them
// renders — bail out. Cells only ever read row.original (directly or through getValue), so
// holding on to the previous Row while its original is unchanged renders the same output.
const WageTypeRow = memo(
	function WageTypeRow({ row, rowSx }: WageTypeRowProps) {
		return (
			<Box sx={rowSx}>
				{row.getVisibleCells().map((cell) => {
					const { alignment } = cell.column.columnDef.meta || {};

					return (
						<Box key={cell.id} sx={cellSx} justifySelf={alignment}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</Box>
					);
				})}
			</Box>
		);
	},
	(previous, next) =>
		previous.row.original === next.row.original &&
		previous.rowSx === next.rowSx,
);

type WageTypeCategoryHeaderProps = {
	header: string;
	expanded: boolean;
	onClick: () => void;
	hasMissingData: boolean;
};

const categoryHeaderSx: SxProps<Theme> = {
	...getStickySx(10, { top: tableHeaderHeight }),
	minHeight: 36,
	maxHeight: 36,
	alignItems: "center",
	backgroundColor: (theme) =>
		blend(
			theme.palette.background.default,
			theme.palette.action.hover,
			theme.palette.action.hoverOpacity * 1.5,
		),
	borderColor: (theme) => theme.palette.divider,
	borderStyle: "solid",
	borderWidth: 0,
	borderTopWidth: 1,
	"&:hover": {
		cursor: "pointer",
		backgroundColor: (theme) =>
			blend(
				theme.palette.background.default,
				theme.palette.action.hover,
				theme.palette.action.hoverOpacity,
			),
	},
};

function WageTypeCategoryHeader({
	header,
	expanded,
	onClick,
	hasMissingData,
}: WageTypeCategoryHeaderProps) {
	const icon = expanded ? <ExpandLess /> : <ExpandMore />;

	return (
		<Stack
			direction="row"
			onClick={onClick}
			spacing={1}
			sx={{
				...categoryHeaderSx,
				borderBottomWidth: expanded ? 1 : 0,
			}}
		>
			{icon}
			<Badge
				variant={hasMissingData ? "dot" : "standard"}
				color="warning"
				sx={{
					"& .MuiBadge-badge": {
						top: 3,
					},
				}}
			>
				<Typography pr={0.5}>{header}</Typography>
			</Badge>
		</Stack>
	);
}

export type WageTypeAction =
	| {
			type: "set_account";
			accountType: "debitAccountNumber" | "creditAccountNumber";
			wageTypeNumber: number;
			value: string | null;
	  }
	| {
			type: "set_controlling";
			wageTypeNumber: number;
			value: string[];
	  }
	| {
			type: "set_name_localizations";
			wageTypeNumber: number;
			value: WageTypeNameLocalizations;
	  }
	| {
			type: "set_collector_active";
			wageTypeNumber: number;
			collectorName: string;
			isActive: boolean;
	  }
	| {
			type: "sync_server_wage_types";
			wageTypes: WageType[];
			actionData: WageTypeActionData | undefined;
	  };

const localizationLanguages: Array<keyof WageTypeNameLocalizations> = [
	"en",
	"de",
	"fr",
	"it",
];

function isSameNameLocalizations(
	a: WageTypeNameLocalizations | null | undefined,
	b: WageTypeNameLocalizations | null | undefined,
): boolean {
	return localizationLanguages.every(
		(language) => (a?.[language] ?? "") === (b?.[language] ?? ""),
	);
}

function isSameAccountAssignment(
	a: WageTypeAccountAssignment | null | undefined,
	b: WageTypeAccountAssignment | null | undefined,
): boolean {
	return (
		(a?.debitAccountNumber ?? null) === (b?.debitAccountNumber ?? null) &&
		(a?.creditAccountNumber ?? null) === (b?.creditAccountNumber ?? null)
	);
}

function isSameStringSet(
	a: string[] | null | undefined,
	b: string[] | null | undefined,
): boolean {
	const sortedA = [...(a ?? [])].sort();
	const sortedB = [...(b ?? [])].sort();

	return (
		sortedA.length === sortedB.length &&
		sortedA.every((value, index) => value === sortedB[index])
	);
}

function activeCollectorNames(collectors: WageTypeCollector[]): string[] {
	return collectors
		.filter((collector) => collector.isActive)
		.map((collector) => collector.name);
}

function withoutKey<T extends object, K extends keyof T>(
	record: T,
	key: K,
): Omit<T, K> {
	const { [key]: _removed, ...rest } = record;
	return rest;
}

// Reconstructs the currently-displayed WageType by layering a pending WageTypeChange
// (only the fields it actually carries) on top of the server's original WageType.
function applyWageTypeUpdate(
	originalWageType: WageType,
	change: WageTypeChange | undefined,
): WageType {
	if (!change) {
		return originalWageType;
	}

	let wageType = originalWageType;

	if (change.accountAssignment !== undefined) {
		wageType = { ...wageType, accountAssignment: change.accountAssignment };
	}
	if (change.activeControllingTriggers !== undefined) {
		wageType = {
			...wageType,
			activeControllingTriggers: change.activeControllingTriggers ?? [],
		};
	}
	if (change.nameLocalizations !== undefined) {
		wageType = {
			...wageType,
			nameLocalizations: change.nameLocalizations ?? undefined,
		};
	}
	if (change.collectors !== undefined) {
		wageType = { ...wageType, collectors: change.collectors ?? [] };
	}

	return wageType;
}

// Re-derives the single wage type an action touched, leaving every other entry at its
// existing object identity. Deriving the whole map instead would hand out a fresh object
// for each wage type that already carries a change, re-rendering all of those rows too.
function deriveWageType(
	state: WageTypeState,
	key: string,
	changesByNumber: Record<string, WageTypeChange>,
): Record<string, WageType> {
	return {
		...state.wageTypesByNumber,
		[key]: applyWageTypeUpdate(
			state.originalWageTypesByNumber[key],
			changesByNumber[key],
		),
	};
}

function isSameCollectors(
	a: WageTypeCollector[] | null | undefined,
	b: WageTypeCollector[] | null | undefined,
): boolean {
	return isSameStringSet(
		activeCollectorNames(a ?? []),
		activeCollectorNames(b ?? []),
	);
}

// Applies a single field update on top of a wage type's existing pending change,
// dropping the field once it matches the server value again. Returns undefined once no
// field differs from the server anymore — there's nothing left worth tracking.
function createWageTypeChange<
	K extends Exclude<keyof WageTypeChange, "wageTypeNumber">,
>(
	existingChange: WageTypeChange | undefined,
	wageTypeNumber: number,
	field: K,
	updatedValue: WageTypeChange[K],
	originalValue: WageTypeChange[K],
	isEqual: (a: WageTypeChange[K], b: WageTypeChange[K]) => boolean,
): WageTypeChange | undefined {
	const remainingFields = existingChange
		? withoutKey(existingChange, field)
		: {};

	const changedFields = isEqual(updatedValue, originalValue)
		? remainingFields
		: { ...remainingFields, [field]: updatedValue };

	return Object.keys(changedFields).length > 0
		? { ...changedFields, wageTypeNumber }
		: undefined;
}

// Handles one field-setting action by creating the updated per-wage-type change, then
// applying it to the map. wageTypesByNumber is derived separately afterwards, from this.
function computeChangesByNumber(
	state: WageTypeState,
	action: Exclude<WageTypeAction, { type: "sync_server_wage_types" }>,
	wageType: WageType,
): Record<string, WageTypeChange> {
	const key = formatWageTypeNumber(action.wageTypeNumber);
	const originalWageType = state.originalWageTypesByNumber[key];
	const existingChange = state.changesByNumber[key];

	let change: WageTypeChange | undefined;

	switch (action.type) {
		case "set_account": {
			const accountAssignment: WageTypeAccountAssignment = {
				debitAccountNumber:
					wageType.accountAssignment?.debitAccountNumber ?? "",
				creditAccountNumber:
					wageType.accountAssignment?.creditAccountNumber ?? "",
				[action.accountType]: action.value,
			};

			change = createWageTypeChange(
				existingChange,
				action.wageTypeNumber,
				"accountAssignment",
				accountAssignment,
				originalWageType.accountAssignment,
				isSameAccountAssignment,
			);
			break;
		}
		case "set_controlling": {
			change = createWageTypeChange(
				existingChange,
				action.wageTypeNumber,
				"activeControllingTriggers",
				action.value,
				originalWageType.activeControllingTriggers,
				isSameStringSet,
			);
			break;
		}
		case "set_name_localizations": {
			change = createWageTypeChange(
				existingChange,
				action.wageTypeNumber,
				"nameLocalizations",
				action.value,
				originalWageType.nameLocalizations,
				isSameNameLocalizations,
			);
			break;
		}
		case "set_collector_active": {
			const collectors = wageType.collectors.map((collector) =>
				collector.name === action.collectorName
					? { ...collector, isActive: action.isActive }
					: collector,
			);

			change = createWageTypeChange(
				existingChange,
				action.wageTypeNumber,
				"collectors",
				collectors,
				originalWageType.collectors,
				isSameCollectors,
			);
			break;
		}
	}

	// place the recomputed change back into the map, or removes the entry entirely
	// once it comes back undefined (i.e. every field reverted to the server value).
	return change
		? { ...state.changesByNumber, [key]: change }
		: withoutKey(state.changesByNumber, key);
}

function reducer(state: WageTypeState, action: WageTypeAction): WageTypeState {
	if (action.type === "sync_server_wage_types") {
		// Only our own save makes the pending changes obsolete — the server has just
		// persisted them, so its response supersedes the local state outright. A refetch
		// triggered by anything else (an activation, a copy, coming back to the page) says
		// nothing about those edits, so they are re-applied on top of the new server data.
		const savedByThisComponent =
			action.actionData !== state.syncedActionData &&
			action.actionData?.intent === "updateWageTypes" &&
			action.actionData.success === true;

		let synced: WageTypeState = {
			...createInitialState(action.wageTypes),
			syncedActionData: action.actionData,
		};

		if (savedByThisComponent) {
			return synced;
		}

		for (const [key, change] of Object.entries(state.changesByNumber)) {
			const originalWageType = synced.originalWageTypesByNumber[key];
			// The server stopped returning this wage type, so there is nothing left to update.
			if (!originalWageType) {
				continue;
			}

			// Re-running the edited wage type field by field against the new baseline is the
			// same bookkeeping editing does: every field the server has caught up with drops
			// out, and the change disappears entirely once none of them differ.
			const editedWageType = applyWageTypeUpdate(originalWageType, change);
			const wageTypeNumber = change.wageTypeNumber;

			let rebased = createWageTypeChange(
				undefined,
				wageTypeNumber,
				"accountAssignment",
				editedWageType.accountAssignment,
				originalWageType.accountAssignment,
				isSameAccountAssignment,
			);
			rebased = createWageTypeChange(
				rebased,
				wageTypeNumber,
				"activeControllingTriggers",
				editedWageType.activeControllingTriggers,
				originalWageType.activeControllingTriggers,
				isSameStringSet,
			);
			rebased = createWageTypeChange(
				rebased,
				wageTypeNumber,
				"nameLocalizations",
				editedWageType.nameLocalizations,
				originalWageType.nameLocalizations,
				isSameNameLocalizations,
			);
			rebased = createWageTypeChange(
				rebased,
				wageTypeNumber,
				"collectors",
				editedWageType.collectors,
				originalWageType.collectors,
				isSameCollectors,
			);

			if (!rebased) {
				continue;
			}

			const changesByNumber = { ...synced.changesByNumber, [key]: rebased };
			synced = {
				...synced,
				changesByNumber,
				wageTypesByNumber: deriveWageType(synced, key, changesByNumber),
			};
		}

		return {
			...synced,
			dirty: Object.keys(synced.changesByNumber).length > 0,
		};
	}

	const wageTypeKey = formatWageTypeNumber(action.wageTypeNumber);
	const wageType = state.wageTypesByNumber[wageTypeKey];
	if (!wageType) {
		return state;
	}

	const changesByNumber = computeChangesByNumber(state, action, wageType);

	return {
		...state,
		changesByNumber,
		dirty: Object.keys(changesByNumber).length > 0,
		wageTypesByNumber: deriveWageType(state, wageTypeKey, changesByNumber),
	};
}

function createInitialState(wageTypes: WageType[]): WageTypeState {
	const wageTypesByNumber = Object.fromEntries(
		wageTypes.map((wageType) => [
			formatWageTypeNumber(wageType.wageTypeNumber),
			wageType,
		]),
	);

	return {
		sourceWageTypes: wageTypes,
		syncedActionData: undefined,
		wageTypesByNumber,
		originalWageTypesByNumber: wageTypesByNumber,
		changesByNumber: {},
		dirty: false,
	};
}

function formatWageTypeNumber(wageTypeNumber: number): string {
	return wageTypeNumber.toString();
}
