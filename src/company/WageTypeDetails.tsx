import { Info } from "@mui/icons-material";
import {
	Chip,
	ClickAwayListener,
	Fade,
	IconButton,
	Paper,
	Popper,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { memo, useMemo, useRef, useState } from "react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { WageType } from "../models/WageType";

export const WageTypeDetails = memo(function WageTypeDetails({
	wageType,
}: {
	wageType: WageType;
}) {
	const { t } = useTranslation();

	const anchorRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);

	const hasDetails = useMemo(
		() =>
			Boolean(wageType.description) ||
			Object.entries(wageType.properties ?? {}).length > 0,
		[wageType.properties, wageType.description],
	);

	if (!hasDetails) {
		return null;
	}

	return (
		<>
			<Tooltip title={t("Details")}>
				<IconButton
					ref={anchorRef}
					size="small"
					onClick={() => setOpen((current) => !current)}
				>
					<Info />
				</IconButton>
			</Tooltip>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				placement="bottom-end"
				transition
				sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
			>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={150}>
						<Paper elevation={4} sx={{ p: 1, maxWidth: 350 }}>
							<ClickAwayListener onClickAway={() => setOpen(false)}>
								<Stack spacing={1}>
									{wageType.description && (
										<Typography variant="body2">
											{wageType.description}
										</Typography>
									)}
									<WageTypeAttributes wageType={wageType} />
								</Stack>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	);
});

function WageTypeAttributes({ wageType }: { wageType: WageType }) {
	const { t } = useTranslation();
	return (
		<Stack direction="row" flexWrap="wrap" gap={0.5}>
			{Object.entries(wageType.properties ?? {}).map(([label, value]) => {
				return (
					<Chip
						key={label}
						label={`${label}: ${getAttributeValueLabel(value, t)}`}
						size="small"
					/>
				);
			})}
		</Stack>
	);
}

function getAttributeValueLabel(value: string, t: TFunction) {
	if (value === "Y") return t("Yes");
	if (value === "N") return t("No");
	return value;
}
