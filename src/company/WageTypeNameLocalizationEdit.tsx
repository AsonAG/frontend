import { Edit } from "@mui/icons-material";
import {
	ClickAwayListener,
	Fade,
	IconButton,
	Paper,
	Popper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	localizationLanguages,
	WageType,
	WageTypeLocalizationLanguage,
	WageTypeNameLocalizations,
} from "../models/WageType";
import { useWageTypeDispatch } from "./WageTypeControlling";

export const WageTypeNameLocalizationEdit = memo(
	function WageTypeNameLocalizationEdit({ wageType }: { wageType: WageType }) {
		const { t } = useTranslation();
		// wageType comes from row.original, which already has the pending changes applied.
		const dispatch = useWageTypeDispatch();

		const anchorRef = useRef<HTMLSpanElement>(null);
		const [open, setOpen] = useState(false);
		const [nameLocalizations, setNameLocalizations] =
			useState<WageTypeNameLocalizations>({});
		const [showErrors, setShowErrors] = useState(false);

		const isMissing = (language: WageTypeLocalizationLanguage) =>
			!nameLocalizations[language]?.trim();
		const hasMissing = localizationLanguages.some(isMissing);

		const openPopper = () => {
			setNameLocalizations(wageType.nameLocalizations ?? {});
			setShowErrors(false);
			setOpen(true);
		};

		const closePopper = () => {
			// Keep the popper open until every label is filled in.
			if (hasMissing) {
				setShowErrors(true);
				return;
			}
			setOpen(false);
			dispatch({
				type: "set_name_localizations",
				wageTypeNumber: wageType.wageTypeNumber,
				value: nameLocalizations,
			});
		};

		const setLocalization = (
			language: WageTypeLocalizationLanguage,
			value: string,
		) => {
			setNameLocalizations((current) => ({ ...current, [language]: value }));
		};

		return (
			<Stack direction="row" alignItems="center" spacing={0.5}>
				<Typography noWrap component="span" ref={anchorRef}>
					{wageType.displayName}
				</Typography>
				{wageType.isLocalizable && (
					<>
						<Tooltip title={t("Edit wage type label")}>
							<IconButton
								size="small"
								onClick={() => (open ? closePopper() : openPopper())}
							>
								<Edit sx={{ fontSize: 16 }} />
							</IconButton>
						</Tooltip>
						<Popper
							open={open}
							anchorEl={anchorRef.current}
							placement="bottom-start"
							transition
							sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
						>
							{({ TransitionProps }) => (
								<Fade {...TransitionProps} timeout={150}>
									<Paper elevation={4} sx={{ p: 2, width: 280 }}>
										<ClickAwayListener onClickAway={closePopper}>
											<Stack spacing={2}>
												{localizationLanguages.map((language) => (
													<TextField
														key={language}
														label={t(`${language}_culturelabel`)}
														value={nameLocalizations[language] ?? ""}
														onChange={(event) =>
															setLocalization(language, event.target.value)
														}
														required
														error={showErrors && isMissing(language)}
														helperText={
															showErrors && isMissing(language)
																? t("This label is required.")
																: undefined
														}
														size="small"
														fullWidth
													/>
												))}
											</Stack>
										</ClickAwayListener>
									</Paper>
								</Fade>
							)}
						</Popper>
					</>
				)}
			</Stack>
		);
	},
);
