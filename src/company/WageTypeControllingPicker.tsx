import { MenuItem, Select, SelectChangeEvent, SxProps, Theme, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useState } from "react";
import { useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { useTranslation } from "react-i18next";

export function ControllingPicker({ wageTypeNumber, controlTypes }: { wageTypeNumber: string, controlTypes: Map<string, string> }) {
  const { t } = useTranslation();
  const { regulationId, wageTypePayrollControllingLookup } = useLoaderData() as WageTypeControllingLoaderData;
  const activeValue = useMemo(() => {
    const value = wageTypePayrollControllingLookup.values.find(x => x.key === wageTypeNumber);
    if (!value)
      return value;

    return {
      ...value,
      value: JSON.parse(value.value)
    };
  }, [wageTypeNumber, wageTypePayrollControllingLookup]);
  const [values, setValues] = useState<string[]>(activeValue?.value ?? []);
  const submit = useSubmit();
  const navigation = useNavigation();
  const handleSave = () => {
    if (navigation.state !== "idle")
      return;

    if (values.length > 0) {
      submit({
        regulationId,
        lookupId: wageTypePayrollControllingLookup.id,
        lookupValue: {
          ...activeValue,
          key: wageTypeNumber,
          value: JSON.stringify(values)
        }
      },
        { method: !activeValue ? "POST" : "PUT", encType: "application/json" });
    }

    if (values.length === 0 && !!activeValue) {
      submit({
        regulationId,
        lookupId: wageTypePayrollControllingLookup.id,
        lookupValue: activeValue
      },
        { method: "DELETE", encType: "application/json" });
    }
  }
  const handleChange = (event: SelectChangeEvent<typeof values>) => {
    const {
      target: { value },
    } = event;
    setValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const options = useMemo(() => {
    return [...controlTypes].map(kv => (
      <MenuItem
        key={kv[0]}
        value={kv[0]}
      >
        {kv[1]}
      </MenuItem>
    ))
  }, [controlTypes])

  return (
    <Select
      multiple
      value={values}
      sx={selectSx}
      onChange={handleChange}
      onClose={handleSave}
      displayEmpty
      renderValue={(selected) => {
        let label = "No checks";
        if (selected.length === 1) {
          label = controlTypes.get(selected[0])!;
        } else if (selected.length > 1) {
          label = "{{count}} checks active";
        }
        return <Typography noWrap>{t(label, { count: selected.length })}</Typography>
      }}
      size="small"
    >
      {options}
    </Select>
  );
}


const selectSx: SxProps<Theme> = {
  width: "100%",
  ".MuiSelect-outlined": {
    paddingTop: theme => theme.spacing(0.5),
    paddingBottom: theme => theme.spacing(0.5)
  }
}
