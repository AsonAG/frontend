import React, { createContext, useContext, useState, forwardRef, Dispatch, useReducer, useCallback } from "react";
import { useAsyncValue, useLoaderData, Link as RouterLink, LinkProps } from "react-router-dom";
import {
	Stack,
	Typography,
	TextField,
	useMediaQuery,
	IconButton,
	Button,
	useTheme,
	Theme,
	SxProps,
	IconButtonProps,
	styled
} from "@mui/material";
import { TableButton } from "../components/buttons/TableButton";
import { useTranslation } from "react-i18next";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { ContentLayout } from "../components/ContentLayout";
import { Search } from "@mui/icons-material";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../components/ResponsiveDialog";
import { useSearchParam } from "../hooks/useSearchParam";
import { StatusDot } from "./StatusDot";
import { useEmployeeMissingDataCount } from "../utils/dataAtoms";
import { SearchField } from "../components/SearchField";
import { EmployeeTableFilter } from "./TableFilter";
import { EmployeeSet, getEmployeeDisplayString } from "../models/Employee";
import { IdType } from "../models/IdType";


type EmployeeTableContextProps = {
	state: TableState
	dispatch: Dispatch<TableAction>
	variant: "standard" | "dense"
	showButtons: boolean
}

export const EmployeeTableContext = createContext<EmployeeTableContextProps>(null!);

export type TableState = {
	onlyActive: boolean
	onlyWithMissingData: boolean
	filter: string
}


export type TableAction = {
	type: "toggle_show_inactive"
} | {
	type: "toggle_only_with_missing_data"
} | {
	type: "set_filter"
	filter: string
}
function reducer(state: TableState, action: TableAction): TableState {
	switch (action.type) {
		case "toggle_show_inactive": {
			return {
				...state,
				onlyActive: !state.onlyActive
			};
		}
		case "toggle_only_with_missing_data":
			return {
				...state,
				onlyWithMissingData: !state.onlyWithMissingData
			};
		case "set_filter":
			return {
				...state,
				filter: action.filter
			};
	}
}

export function AsyncEmployeeTable() {
	const { showButtons = true } = useLoaderData() as { showButtons: boolean };
	const theme = useTheme();
	const variant: "standard" | "dense" = useMediaQuery(theme.breakpoints.down("sm"))
		? "dense"
		: "standard";

	const [state, dispatch] = useReducer(reducer, {
		onlyActive: true,
		onlyWithMissingData: false,
		filter: ""
	});

	const tableContext = { state, dispatch, variant, showButtons };

	return (
		<EmployeeTableContext.Provider value={tableContext}>
			<ContentLayout title="Employees" buttons={<EmployeeTableButtons />}>
				<AsyncDataRoute>
					<EmployeeTable />
				</AsyncDataRoute>
			</ContentLayout>
		</EmployeeTableContext.Provider>
	);
}

const Link = styled(
	forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)(({ theme }: { theme: Theme }) => {
	return {
		display: "flex",
		textDecoration: "none",
		borderRadius: theme.spacing(0.5),
		color: theme.palette.text.primary,
		alignSelf: "stretch",
		alignItems: "center",
		flex: 1,
		"&:hover": {
			color: theme.palette.primary.main,
		},
		"&.active": {
			color: theme.palette.primary.main,
		},
		"&.active:hover": {
			color: theme.palette.primary.light,
		},
	};
});

type SearchButtonProps = {
	isFiltering: boolean
} & IconButtonProps;

const SearchButton = styled(
	forwardRef<HTMLButtonElement, SearchButtonProps>(function SearchButton(itemProps, ref) {
		return (
			<IconButton ref={ref} {...itemProps} role={undefined}>
				<Search />
			</IconButton>
		);
	}),
	{ shouldForwardProp: (name) => name !== "isFiltering" },
)(({ theme, ...props }) => {
	if (props.isFiltering) {
		return {
			color: theme.palette.common.white,
			backgroundColor: `${theme.palette.primary.main} !important`,
		};
	}
	return {
		color: theme.palette.primary.main,
	};
});

function EmployeeTableButtons() {
	const { t } = useTranslation();
	const { variant } = useContext(EmployeeTableContext);
	return (
		<Stack direction="row" spacing={2}>
			<EmployeeTableSearch />
			<EmployeeTableFilter />
			<TableButton
				title={t("New employee")}
				to="new"
				icon={<AddOutlinedIcon />}
				variant={variant}
			/>
		</Stack>
	);
}


function EmployeeTableSearchField() {
	const { t } = useTranslation();
	const { state, dispatch } = useContext(EmployeeTableContext);
	const setValue = useCallback((filter: string) => dispatch({ type: "set_filter", filter }), [state, dispatch]);
	return (
		<SearchField
			label={t("Search")}
			value={state.filter}
			setValue={setValue}
		/>
	);
}

function EmployeeTableSearch() {
	const { variant } = useContext(EmployeeTableContext);
	if (variant === "dense") {
		return <EmployeeTableSearchDialog />;
	}
	return <EmployeeTableSearchField />;
}

function EmployeeTableSearchDialog() {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useSearchParam("search");
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
	const onSearch = () => {
		setSearchTerm(localSearchTerm);
	};
	const onClear = () => {
		setSearchTerm("");
		setLocalSearchTerm("");
	};
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger>
				<SearchButton isFiltering={!!searchTerm} />
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<TextField
					variant="outlined"
					label="Name"
					value={localSearchTerm}
					onChange={(event) => setLocalSearchTerm(event.target.value)}
				/>
				<ResponsiveDialogClose>
					<Button color="primary" variant="contained" onClick={onSearch}>
						{t("Search")}
					</Button>
				</ResponsiveDialogClose>
				<ResponsiveDialogClose>
					<Button variant="outlined" onClick={onClear}>
						{t("Clear search")}
					</Button>
				</ResponsiveDialogClose>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

function EmployeeTable() {
	const employees = useAsyncValue() as EmployeeSet[];
	return (
		<Stack>
			{employees.map((employee) => (
				<EmployeeRow
					key={employee.id}
					employee={employee}
				/>
			))}
		</Stack>
	);
}

const sx: SxProps<Theme> = {
	borderRadius: (theme) => theme.spacing(1),
	"&:hover": {
		backgroundColor: (theme) => theme.palette.primary.hover,
	},
	"&.active": {
		backgroundColor: (theme) => theme.palette.primary.active,
	},
};

function EmployeeRow({ employee }: { employee: EmployeeSet }) {
	const { state, variant, showButtons } = useContext(EmployeeTableContext);
	const missingDataCount = useEmployeeMissingDataCount(employee.id);
	if (state.onlyActive && !employee.isEmployed)
		return;
	if (state.onlyWithMissingData && (missingDataCount === 0))
		return;
	if (!!state.filter && !getEmployeeDisplayString(employee).toLowerCase().includes(state.filter.toLowerCase()))
		return;

	return (
		<Stack direction="row" alignItems="center" sx={sx} mx={-0.5} px={0.5}>
			<Link to={employee.id}>
				<Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
					<Typography>
						{employee.firstName} {employee.lastName}
					</Typography>
					<Typography
						color="text.secondary"
						sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
					>
						{employee.identifier}
					</Typography>
					{!state.onlyActive && <StatusDot isEmployed={employee.isEmployed} />}
				</Stack>
			</Link>
			{variant === "standard" && showButtons && <EmployeeButtons employeeId={employee.id} missingDataCount={missingDataCount} />}
		</Stack>
	);
}

function EmployeeButtons({ employeeId, missingDataCount }: { employeeId: IdType, missingDataCount: number }) {
	const { t } = useTranslation();
	const variant = "dense";

	return (
		<Stack direction="row" spacing={2} py={0.5}>
			<TableButton
				title={t("Data")}
				to={employeeId + "/data"}
				variant={variant}
				icon={<WorkOutlineIcon />}
				badgeCount={missingDataCount}
			/>
			<TableButton
				title={t("Documents")}
				to={employeeId + "/documents"}
				variant={variant}
				icon={<DescriptionOutlinedIcon />}
			/>
			<TableButton
				title={t("Events")}
				to={employeeId + "/events"}
				variant={variant}
				icon={<WorkHistoryOutlinedIcon />}
			/>
		</Stack>
	);
}
