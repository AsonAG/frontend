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
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	WageType,
	WageTypeLocalizationLanguage,
	WageTypeNameLocalizations,
} from "../models/WageType";
import { WageTypeContext } from "./WageTypeControlling";

const localizationLanguages: WageTypeLocalizationLanguage[] = [
	"en",
	"de",
	"fr",
	"it",
];

export function WageTypeNameLocalizationEdit({
	wageType,
}: {
	wageType: WageType;
}) {
	const { t } = useTranslation();
	const { state, dispatch } = useContext(WageTypeContext);
	const currentWageType =
		state.wageTypesByNumber[wageType.wageTypeNumber.toString()] ?? wageType;

	const anchorRef = useRef<HTMLSpanElement>(null);
	const [open, setOpen] = useState(false);
	const [nameLocalizations, setNameLocalizations] =
		useState<WageTypeNameLocalizations>({});

	const openPopper = () => {
		setNameLocalizations(currentWageType.nameLocalizations ?? {});
		setOpen(true);
	};

	const closePopper = () => {
		setOpen(false);
		dispatch({
			type: "set_name_localizations",
			wageTypeNumber: currentWageType.wageTypeNumber,
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
				{currentWageType.displayName}
			</Typography>
			{currentWageType.isLocalizable && (
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
}
