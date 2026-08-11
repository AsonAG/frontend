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
	useContext,
	useEffect,
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

type WageTypeState = {
	wageTypesByNumber: Record<string, WageType>;
	originalWageTypesByNumber: Record<string, WageType>;
	changesByNumber: Record<string, WageTypeChange>;
	dirty: boolean;
};

type WageTypeContextType = {
	state: WageTypeState;
	dispatch: Dispatch<WageTypeAction>;
};

const defaultState: WageTypeState = {
	wageTypesByNumber: {},
	originalWageTypesByNumber: {},
	changesByNumber: {},
	dirty: false,
};

export const WageTypeContext = createContext<WageTypeContextType>({
	state: defaultState,
	dispatch: () => {
		throw new Error("WageTypeContext is not initialized.");
	},
});

const tableHeaderHeight = 36;
const headerStickySx = getStickySx(10, { top: 0 });

const defaultRowSx: SxProps<Theme> = {
	minHeight: 42,
	maxHeight: 42,
	alignItems: "center",
};

type WageTypeActionData = {
	intent?: "updateWageTypes";
	success?: boolean;
	error?: string;
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

	const filteredWageTypes = useMemo(() => {
		const searchValue = search.trim().toLowerCase();

		return currentWageTypes.filter((wageType) => {
			const matchesActiveFilter = showAllWageTypes || wageType.isActive;
			const matchesSearch =
				searchValue === "" ||
				formatWageTypeNumber(wageType.wageTypeNumber).includes(searchValue) ||
				wageType.displayName.toLowerCase().includes(searchValue) ||
				wageType.name.toLowerCase().includes(searchValue);

			return matchesActiveFilter && matchesSearch;
		});
	}, [currentWageTypes, search, showAllWageTypes]);

	const table = useReactTable({
		columns,
		data: filteredWageTypes,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (wageType) => formatWageTypeNumber(wageType.wageTypeNumber),
	});

	useEffect(() => {
		if (
			actionData?.intent === "updateWageTypes" &&
			actionData.success === true
		) {
			dispatch({ type: "reset_dirty" });
		}
	}, [actionData]);

	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			state.dirty && currentLocation.pathname !== nextLocation.pathname,
	);

	const rowGridSx = getRowGridSx(
		table.getVisibleLeafColumns().map((column) => ({
			width: column.getSize(),
			flex: column.columnDef.meta?.flex,
		})),
		1,
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
		<WageTypeContext.Provider value={{ state, dispatch }}>
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
							rowGridSx={rowGridSx}
						/>
					))}

					<WageTypeCategoryGroup
						category={t("Without category")}
						rows={withoutCategory}
						rowGridSx={rowGridSx}
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
		</WageTypeContext.Provider>
	);
}

type WageTypeCategoryProps = {
	category: string;
	rows: Array<Row<WageType>>;
	rowGridSx: SxProps<Theme>;
};

function WageTypeCategoryGroup({
	category,
	rows,
	rowGridSx,
}: WageTypeCategoryProps) {
	const { state } = useContext(WageTypeContext);
	const [expanded, setExpanded] = useState(false);

	if (rows.length === 0) {
		return null;
	}

	const hasMissingData = rows.some(({ original }) => {
		const currentWageType =
			state.wageTypesByNumber[original.wageTypeNumber.toString()] ?? original;

		const accountingRelevant =
			currentWageType.accountAssignment !== null ||
			!Number.isInteger(currentWageType.wageTypeNumber);

		if (!accountingRelevant) {
			return false;
		}

		return (
			!currentWageType.accountAssignment?.debitAccountNumber ||
			!currentWageType.accountAssignment?.creditAccountNumber
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
				rows.map((row) => (
					<Box key={row.id} sx={{ ...rowGridSx, ...defaultRowSx }}>
						{row.getVisibleCells().map((cell) => {
							const { alignment } = cell.column.columnDef.meta || {};

							return (
								<Box
									key={cell.id}
									sx={{ px: 0.25, py: 0.5 }}
									justifySelf={alignment}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Box>
							);
						})}
					</Box>
				))}
		</>
	);
}

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
			type: "reset_dirty";
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

// Derives the full displayed wage type map from scratch: original server data with
// every pending change layered on top. This is the only place wageTypesByNumber is set.
function deriveWageTypesByNumber(
	originalWageTypesByNumber: Record<string, WageType>,
	changesByNumber: Record<string, WageTypeChange>,
): Record<string, WageType> {
	return Object.fromEntries(
		Object.entries(originalWageTypesByNumber).map(([key, originalWageType]) => [
			key,
			applyWageTypeUpdate(originalWageType, changesByNumber[key]),
		]),
	);
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
	action: Exclude<WageTypeAction, { type: "reset_dirty" }>,
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

	// Step 2: places the recomputed change back into the map, or removes the entry entirely
	// once it comes back undefined (i.e. every field reverted to the server value).
	return change
		? { ...state.changesByNumber, [key]: change }
		: withoutKey(state.changesByNumber, key);
}

function reducer(state: WageTypeState, action: WageTypeAction): WageTypeState {
	if (action.type === "reset_dirty") {
		return {
			...state,
			originalWageTypesByNumber: state.wageTypesByNumber,
			changesByNumber: {},
			dirty: false,
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
		wageTypesByNumber: deriveWageTypesByNumber(
			state.originalWageTypesByNumber,
			changesByNumber,
		),
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
		wageTypesByNumber,
		originalWageTypesByNumber: wageTypesByNumber,
		changesByNumber: {},
		dirty: false,
	};
}

function formatWageTypeNumber(wageTypeNumber: number): string {
	return wageTypeNumber.toString();
}
