import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ActivateWageTypeActionData = {
	intent?: "activateWageType";
	success?: boolean;
	error?: string;
};

export function ActivateWageTypeCheckbox({
	wageTypeNumber,
	isActive,
}: {
	wageTypeNumber: number;
	isActive: boolean;
}) {
	const { t } = useTranslation();
	const fetcher = useFetcher<ActivateWageTypeActionData>();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const isSubmitting = fetcher.state !== "idle";

	const handleConfirm = () => {
		fetcher.submit(
			{
				intent: "activateWageType",
				wageTypeNumber,
			},
			{
				method: "post",
				encType: "application/json",
			},
		);
	};

	useEffect(() => {
		if (
			fetcher.data?.intent === "activateWageType" &&
			fetcher.data.success === true
		) {
			setConfirmOpen(false);
		}
	}, [fetcher.data]);

	return (
		<>
			<Checkbox
				checked={isActive}
				disabled={isActive || isSubmitting}
				onChange={(event) => {
					if (event.target.checked) {
						setConfirmOpen(true);
					}
				}}
			/>

			<Dialog
				open={confirmOpen}
				onClose={isSubmitting ? undefined : () => setConfirmOpen(false)}
			>
				<DialogTitle>{t("Activate wage type")}</DialogTitle>

				<DialogContent>
					<Typography>
						{t("Do you really want to activate this wage type?")}
					</Typography>

					{fetcher.data?.error && (
						<Typography color="error" sx={{ mt: 2 }}>
							{t(fetcher.data.error)}
						</Typography>
					)}
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => setConfirmOpen(false)}
						disabled={isSubmitting}
					>
						{t("Cancel")}
					</Button>

					<Button
						variant="contained"
						onClick={handleConfirm}
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						{t("Activate")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}