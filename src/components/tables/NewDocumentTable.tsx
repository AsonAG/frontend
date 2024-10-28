import {
	Stack,
	Typography,
	IconButton,
	Button,
	Theme,
	SxProps,
	TextField,
	InputAdornment,
	Chip,
	Box,
} from "@mui/material";
import React, { ReactNode, useMemo, useState } from "react";
import { Outlet, useSubmit, useLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clear, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { DocumentLink } from "../DocumentLink";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import { useRole } from "../../hooks/useRole";
import { useIsMobile } from "../../hooks/useIsMobile";
import { IdType } from "../../models/IdType";
import { AvailableCase } from "../../models/AvailableCase";
import { AvailableCaseField } from "../../models/AvailableCaseField";
import { CaseValue } from "../../models/CaseValue";

export function AsyncDocumentTable() {
	return (
		<DocumentTable />
	);
}

type LoaderData = {
	data: Array<AvailableCase>
	values: Record<string, Array<CaseValue>>
}
function DocumentTable() {
	const { t } = useTranslation();
	const { data, values } = useLoaderData() as LoaderData;
	const [search, setSearch] = useState("");
	const [selectedDocCase, setSelectedDocCase] = useState<AvailableCase>();

	const caseFieldMap = useMemo(() => {
		let result: Record<string, AvailableCaseField> = {};
		for (const caseField of data.flatMap(_case => _case.caseFields)) {
			result[caseField.name] = caseField;
		}
		return result;
	}, [data]);
	const lowerSearch = search.toLowerCase();
	const filteredValues = useMemo(() => {
		let result: Record<string, Array<CaseValue>> = {};
		for (const [fieldName, caseValues] of Object.entries(values)) {
			const fieldDisplayName = caseFieldMap[fieldName]?.displayName.toLowerCase() ?? "";
			if (fieldDisplayName.includes(lowerSearch)) {
				result[fieldName] = caseValues;
			}
			else {
				let filteredCaseValues: Array<CaseValue> = []
				for (const caseValue of caseValues) {
					const documents = caseValue.documents.filter(doc => doc.name.toLowerCase().includes(lowerSearch));
					if (documents.length > 0) {
						filteredCaseValues.push({ id: caseValue.id, documents });
					}
				}
				if (filteredCaseValues.length > 0) {
					result[fieldName] = filteredCaseValues;
				}
			}
		}
		return result;
	}, [values, caseFieldMap, lowerSearch]);
	const caseFields = selectedDocCase ? selectedDocCase.caseFields : data.flatMap(_case => _case.caseFields);
	const noValuesAvailableText = caseFields.every(field => (filteredValues[field.name]?.length ?? 0) === 0) ? <Typography>{t("No data available")}</Typography> : null;

	return (
		<>
			<DocumentSearch search={search} setSearch={setSearch} />
			<CategoryFilter selectedDocCase={selectedDocCase} setSelectedDocCase={setSelectedDocCase} />
			<Stack spacing={1} pb={2}>
				{caseFields.map(field => <CaseFieldDocumentTable key={field.id} displayName={field.displayName} values={filteredValues[field.name]} displayRecentOnly={false} />)}
				{noValuesAvailableText}
			</Stack>
			<Outlet />
		</>
	);
}

function CategoryFilter({ selectedDocCase, setSelectedDocCase }) {
	const { t } = useTranslation();
	const { data, values } = useLoaderData() as LoaderData;
	if (data.length === 0)
		return;
	const availableDocCases = useMemo(() => data.filter(_case => _case.caseFields.map(f => values[f.name].length).reduce((a, b) => a + b) > 0), [data, values]);
	return (
		<Stack direction="row" spacing={1} flexWrap="wrap">
			{availableDocCases.map(docCase => {
				const isSelected = docCase === selectedDocCase;
				return <Chip
					variant={isSelected ? "filled" : "outlined"}
					color="primary"
					key={docCase.id}
					label={t(docCase.displayName)}
					size="small"
					onClick={() => { setSelectedDocCase(isSelected ? undefined : docCase) }}
				/>;
			})}
		</Stack>
	);
}

function CaseFieldDocumentTable({ displayName, values, displayRecentOnly }) {
	const { t } = useTranslation();
	if (!values || values.length === 0) {
		return null;
	}
	const groupedDocuments = Object.groupBy(values, ({ start }) => {
		const date = dayjs.utc(start);
		return date.isValid() ? date.format("MMM YYYY") : t("Without date");
	});
	let entries = Object.entries(groupedDocuments);
	if (displayRecentOnly) {
		entries = entries.slice(0, 2);
	}
	return (
		<Stack spacing={0.5}>
			<Typography variant="h6" flex={1}>
				{displayName}
			</Typography>
			<Stack>
				{
					entries.map(([key, values]) => <MonthGroup key={key} month={key} values={values} />)
				}
			</Stack>
		</Stack>
	);
}

function MonthGroup({ month, values }: { month: string, values: Array<CaseValue> }) {
	const { t } = useTranslation();
	const submit = useSubmit();
	const onDelete = (caseValueId: IdType, documentId: IdType) => {
		submit(null, {
			method: "delete",
			action: `${caseValueId}/i/${documentId}`
		});
	};
	const isProviderRole = useRole("provider");
	const isMobile = useIsMobile();
	return (
		<Box display="grid" gridTemplateColumns="90px 1fr" gridTemplateRows="auto" alignItems="start">
			<Typography lineHeight="28px">{month}</Typography>
			<Stack overflow="hidden">
				{values.flatMap(caseValue => caseValue.documents.map(document => (
					<Stack direction="row" alignItems="center" sx={itemSx} key={document.id}>
						<DocumentLink
							name={document.name}
							to={`${caseValue.id}/i/${document.id}`}
							sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
						/>
						{isProviderRole && !isMobile &&
							<ResponsiveDialog>
								<ResponsiveDialogTrigger>
									<IconButton size="small">
										<Delete fontSize="small" />
									</IconButton>
								</ResponsiveDialogTrigger>
								<ResponsiveDialogContent>
									<Typography variant="h6">{t("Delete document")}</Typography>
									<Typography>{t("delete_document_text", { documentName: document.name })}</Typography>
									<Stack direction="row" justifyContent="end" spacing={1}>
										<ResponsiveDialogClose>
											<Button>{t("Cancel")}</Button>
										</ResponsiveDialogClose>
										<ResponsiveDialogClose>
											<Button variant="contained" color="destructive" onClick={() => onDelete(caseValue.id, document.id)}>{t("Delete")}</Button>
										</ResponsiveDialogClose>
									</Stack>
								</ResponsiveDialogContent>
							</ResponsiveDialog>
						}
					</Stack>
				)))}
			</Stack>
		</Box>

	)
}

function DocumentSearch({ search, setSearch }) {
	const { t } = useTranslation();

	const onChange = (event) => {
		setSearch(event.target.value);
	};

	const onClear = () => {
		setSearch("");
	}


	let clearButton: ReactNode | null = null;
	if (search) {
		clearButton = (
			<InputAdornment position="end">
				<IconButton onClick={onClear}>
					<Clear />
				</IconButton>
			</InputAdornment>
		)
	}

	return (
		<TextField
			fullWidth
			variant="outlined"
			placeholder={t("Search")}
			onChange={onChange}
			value={search}
			slotProps={{
				input: {
					endAdornment: clearButton,
				}
			}}
		/>
	);

}

const itemSx: SxProps<Theme> = {
	pl: 0.5,
	borderRadius: 2,
	"& > button": {
		visibility: "hidden"
	},
	":hover": {
		backgroundColor: (theme) => theme.palette.primary.hover,
		"& > button": {
			visibility: "visible"
		}
	}
};
