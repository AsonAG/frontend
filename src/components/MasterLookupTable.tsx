import {
	Alert,
	Button,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import { PayrollLookupValue } from "../models/LookupSet";
import { Delete, RestartAlt, Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "./ResponsiveDialog";

type LoaderData = {
	values: PayrollLookupValue[];
	keyName: string;
	canDelete: (key: string) => [boolean, string];
};

export function MasterLookupTable() {
	const { values } = useLoaderData() as LoaderData;
	return (
		<Stack spacing={1}>
			<TableHeader />
			{values.map((value) => (
				<ValueRow key={value.key} value={value} />
			))}
			<NewValueRow />
		</Stack>
	);
}

function ValueRow({ value }: { value: PayrollLookupValue }) {
	const [lookupData, setLookupData] = useState({ ...value });

	const isDirty =
		lookupData.key !== value.key || lookupData.value !== value.value;

	return (
		<Stack direction="row">
			<Form method="PUT" style={{ flex: 1 }}>
				<Stack direction="row" spacing={1}>
					<TextField
						name="key"
						value={lookupData.key}
						sx={{ width: 120 }}
						size="small"
						disabled
						slotProps={{ htmlInput: { readOnly: true, disabled: false } }}
					/>
					<TextField
						name="value"
						value={lookupData.value}
						onChange={(e) =>
							setLookupData({ ...lookupData, value: e.target.value })
						}
						sx={{ flex: 1 }}
						size="small"
					/>
					<IconButton
						type="submit"
						tabIndex={-1}
						color="primary"
						disabled={!isDirty}
					>
						<Save />
					</IconButton>
				</Stack>
			</Form>
			<DeleteButton value={value} />
		</Stack>
	);
}

function DeleteButton({ value }: { value: PayrollLookupValue }) {
	const { t } = useTranslation();
	const { canDelete } = useLoaderData() as LoaderData;
	// removing an override only resets the key to the regulation value, so it stays usable
	const isReset = value.source === "PayrollOverride";
	const [deletable, reason] = useMemo(
		() => (isReset ? [true, null] : (canDelete?.(value.key) ?? [true, null])),
		[canDelete, value.key, isReset],
	);
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger>
				<IconButton
					type="submit"
					tabIndex={-1}
					disabled={value.source === "Regulation"}
				>
					{isReset ? <RestartAlt /> : <Delete />}
				</IconButton>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<Typography variant="h6">
					{t(isReset ? "Reset value" : "Delete value")}
				</Typography>
				<Typography>
					{t(
						isReset
							? "Do you really want to reset this value to the regulation value?"
							: "Do you really want to delete this value?",
					)}
				</Typography>
				<Typography>
					{value.key} {value.value}
				</Typography>
				{reason && (
					<Alert severity="error">
						<Typography>{t(reason)}</Typography>
					</Alert>
				)}
				<Form method="DELETE">
					<input type="hidden" name="key" value={value.key} />
					<Stack direction="row" justifyContent="end" spacing={1}>
						<ResponsiveDialogClose>
							<Button>{t("Cancel")}</Button>
						</ResponsiveDialogClose>
						<Button
							type="submit"
							variant="contained"
							color="destructive"
							disabled={!deletable}
						>
							{t(isReset ? "Reset" : "Delete")}
						</Button>
					</Stack>
				</Form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
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

function NewValueRow() {
	const { t } = useTranslation();
	const actionData = useActionData() as { success: boolean } | undefined;
	const formRef = useRef<HTMLFormElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (actionData?.success) {
			formRef.current?.reset();
			inputRef.current?.focus();
		}
	}, [actionData]);

	return (
		<Form method={"POST"} ref={formRef}>
			<Stack direction="row" spacing={1}>
				<TextField
					name="key"
					defaultValue=""
					autoFocus
					inputRef={inputRef}
					sx={{ width: 120 }}
					size="small"
				/>
				<TextField name="value" defaultValue="" sx={{ flex: 1 }} size="small" />
				<Button type="submit" variant="contained" tabIndex={-1}>
					{t("Save")}
				</Button>
			</Stack>
		</Form>
	);
}
