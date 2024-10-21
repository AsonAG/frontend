import {
	Divider,
	Stack,
	Typography,
	IconButton,
	Button,
	Paper,
	Theme,
	SxProps,
	TextField,
	InputAdornment,
} from "@mui/material";
import React, { ReactNode, useState } from "react";
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

	const lowerSearch = search.toLowerCase();
	const casesWithValues = data.filter(_case => _case.caseFields.map(f => values[f.name].length).reduce((a, b) => a + b) > 0);
	const filteredValues = casesWithValues.filter(_case => {
		if (_case.displayName.toLowerCase().includes(lowerSearch))
			return true;
		for (let i = 0; i < _case.caseFields.length; i++) {
			const field = _case.caseFields[i];
			if (field.displayName.toLowerCase().includes(lowerSearch)) {
				return true;
			}
			const documents = values[field.name]?.flatMap(v => v.documents);
			for (const doc of documents) {
				if (doc.name.toLowerCase().includes(lowerSearch))
					return true;
			}
		}
		return false;
	});
	const noValuesAvailableText = filteredValues.length === 0 ? <Typography>{t("No data available")}</Typography> : null;

	return (
		<>
			<DocumentSearch search={search} setSearch={setSearch} />
			<Stack spacing={3} pb={3}>
				{filteredValues.map((c) => (
					<DocumentGroupCard
						key={c.id}
						groupName={c.displayName}
						fields={c.caseFields}
					/>
				))}
				{noValuesAvailableText}
			</Stack>
			<Outlet />
		</>
	);
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

function CaseValueRow({ caseValue }: { caseValue: CaseValue }) {
	const { t } = useTranslation();
	const submit = useSubmit();
	const onDelete = (documentId: IdType) => {
		submit(null, {
			method: "delete",
			action: `${caseValue.id}/i/${documentId}`
		});
	};
	const isProviderRole = useRole("provider");
	const isMobile = useIsMobile();
	return (
		<Stack>
			{caseValue.documents.map((document) => (
				<Stack direction="row" alignItems="center" sx={itemSx} key={document.id}>
					<DocumentLink
						name={document.name}
						to={`${caseValue.id}/i/${document.id}`}
						sx={{ flex: 1 }}
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
										<Button variant="contained" color="destructive" onClick={() => onDelete(document.id)}>{t("Delete")}</Button>
									</ResponsiveDialogClose>
								</Stack>
							</ResponsiveDialogContent>
						</ResponsiveDialog>
					}
				</Stack>
			))}
		</Stack>
	);
}

function DocumentGroup({ caseFieldName, displayName }) {
	const { t } = useTranslation();
	const { values } = useLoaderData() as LoaderData;
	const documents = values[caseFieldName];
	if (!documents || documents.length === 0) {
		return;
	}

	// @ts-ignore
	const groupedDocuments = Object.groupBy(documents, ({ start }) => {
		const date = dayjs.utc(start);
		return date.isValid() ? date.format("MMMM YYYY") : t("Without date");
	});
	const entries = Object.entries(groupedDocuments);
	return (
		<Stack>
			<Typography variant="subtitle1" flex={1}>
				{displayName}
			</Typography>
			{entries.length > 0 && (
				<Stack sx={{ px: 2, pt: 2 }} spacing={1} alignItems="start">
					{entries.map(([key, values]) => (
						<DocumentMonthGroup key={key} month={key} items={values as Array<CaseValue>} />
					))}
				</Stack>
			)}
		</Stack>
	);
}
function DocumentGroupCard({ groupName, fields }: { groupName: string, fields: Array<AvailableCaseField> }) {
	return (
		<Paper>
			<Stack>
				<Stack
					direction="row"
					alignItems="center"
					sx={{ pl: 2, pr: 1, py: 1 }}
					spacing={2}
				>
					<Typography variant="h6" flex={1}>
						{groupName}
					</Typography>
				</Stack>
				<Divider />
				{fields.length > 0 && (
					<Stack sx={{ p: 2 }} spacing={1} alignItems="stretch">
						{fields.map((field) => (
							<DocumentGroup key={field.id} caseFieldName={field.name} displayName={field.displayName} />
						))}
					</Stack>
				)}
			</Stack>
		</Paper>
	);
}

function DocumentMonthGroup({ month, items }: { month: string, items: Array<CaseValue> }) {
	return (
		<Stack alignSelf="stretch">
			<Typography variant="subtitle2">{month}</Typography>
			{items.map((caseValue) => (
				<CaseValueRow key={caseValue.id} caseValue={caseValue} />
			))}
		</Stack>
	);
}
