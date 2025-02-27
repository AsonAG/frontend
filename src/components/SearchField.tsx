import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";


type SearchFieldProps = {
  label: string,

  value: string,
  setValue: (v: string) => void
}

export function SearchField({ label, value, setValue }: SearchFieldProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(value);

  const debounced = useDebounceCallback(setValue, 300);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value;
    setLocalSearchTerm(updatedValue);
    debounced.cancel();
    debounced(updatedValue);
  };

  const iconAction = () => {
    setValue("");
    setLocalSearchTerm("");
  };

  const isEmptySearch = !value;

  return (
    <TextField
      variant="outlined"
      label={label}
      onChange={onChange}
      value={localSearchTerm}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={iconAction} disabled={isEmptySearch} edge="end">
                {isEmptySearch ? <Search /> : <Clear />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  );
}
