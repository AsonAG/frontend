import { FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, FormControlProps } from "@mui/material";
import { t } from "i18next";
import { Language } from "../models/Language";

type LanguagePickerProps = Omit<FormControlProps, "onChange"> & {
  label: string
  language: Language
  onChange: (lang: Language) => void
}

export function LanguagePicker({ label, language, onChange, ...formControlProps }: LanguagePickerProps) {
  return (
    <FormControl fullWidth variant="outlined" size="small" {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select value={language} onChange={(e: SelectChangeEvent) => onChange(e.target.value as Language)} label={label}>
        <MenuItem value="German">{t("German")}</MenuItem>
        <MenuItem value="English">{t("English")}</MenuItem>
        <MenuItem value="French">{t("French")}</MenuItem>
        <MenuItem value="Italian">{t("Italian")}</MenuItem>
      </Select>
    </FormControl>
  )
}