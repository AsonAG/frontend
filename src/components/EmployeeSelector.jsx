import { ChevronRight } from "@mui/icons-material";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, OutlinedInput, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";


export function EmployeeSelector({allEmployees, selectedEmployees, updateEmployees}) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const { t } = useTranslation();

  const fieldValue = getEmployeeSelectionText(allEmployees.length, selectedEmployees, t);
  
  return <>
    <TextField variant="outlined" value={fieldValue} disabled label={t("Employees")}
      InputProps={{
        endAdornment: 
          <InputAdornment position="end">
            <IconButton onClick={() => setOpen(true)}>
              <ChevronRight />
            </IconButton>
          </InputAdornment>
      }}
    />
    { open && <EmployeeDialog onClose={onClose} allEmployees={allEmployees} selectedEmployees={selectedEmployees} setSelectedEmployees={updateEmployees}/> }
  </>;
}

const dialogSx = {
  '& .MuiDialog-paper': {
    sm: { width: '80%', maxHeight: 835 }
  }
};

function EmployeeDialog({onClose, allEmployees, selectedEmployees, setSelectedEmployees}) {
  const [state, dispatch] = useReducer(reducer, {allEmployees, selectedEmployees}, createInitialState);
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const localSelectedEmployees = [...state.employees.entries()].filter(([_, selected]) => selected).map(([employee, _]) => employee);
  const update = () => {
    setSelectedEmployees(localSelectedEmployees);
    onClose();
  }


  return (
    <Dialog open
      sx={dialogSx}
      fullScreen={fullScreen}
      onClose={onClose}
    >
      <DialogTitle>{t("Select Employees")}</DialogTitle>
      <DialogContent dividers sx={{p: 0}}>
        <List>
          <ListItem disablePadding sx={{bgcolor: theme => theme.palette.background.default}}>
            <ListItemButton sx={{px: 3}} onClick={() => dispatch({type: "toggle_global"})}>
              <ListItemIcon>
                <Checkbox
                  checked={allEmployees.length === state.selectedCount}
                  indeterminate={allEmployees.length !== state.selectedCount && state.selectedCount !== 0}
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={getEmployeeSelectionText(allEmployees.length, localSelectedEmployees, t)} />
            </ListItemButton>
          </ListItem>
          <Divider sx={{pb: 1, mb: 1}}/>
          {
            allEmployees.map(employee => {
              return (
                <ListItem key={employee.id} disablePadding>
                  <ListItemButton sx={{px: 3}} onClick={() => dispatch({type: "toggle_employee", employee: employee})}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={state.employees.get(employee)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={getEmployeeName(employee)} />
                  </ListItemButton>
                </ListItem>
              );
            })
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
        <Button onClick={update} variant="contained">{t("Save")}</Button>
      </DialogActions>
    </Dialog>
  )
}

function createInitialState({allEmployees, selectedEmployees}) {
  const employees = new Map(allEmployees.map(e => [e, false]));
  let selectedCount = 0;
  for (const employee of selectedEmployees) {
    employees.set(employee, true);
    selectedCount++;
  }
  return {
    employees,
    selectedCount
  };
}

function reducer(state, action) {
  var employees = new Map(state.employees);
  switch(action.type) {
    case "toggle_global":
      const selected = state.selectedCount !== state.employees.size;
      
      for (const employee of employees.keys()) {
        employees.set(employee, selected);
      }
      return {
        employees,
        selectedCount: selected ? employees.size : 0
      };
    case "toggle_employee":
      const employeeSelected = !employees.get(action.employee);
      employees.set(action.employee, employeeSelected);
      const selectedCount = employeeSelected ? state.selectedCount++ : state.selectedCount--;
      return {
        employees,
        selectedCount
      };
    default:
      throw new Error("unknown action type");
  }
}

function getEmployeeSelectionText(employeeCount, selectedEmployees, t) {
  if (selectedEmployees.length === 0) {
    return t("no_employees_selected");
  }
  if (selectedEmployees.length === 1) {
    return t("employee_name_selected", {employee: selectedEmployees[0]});
  }
  if (selectedEmployees.length === employeeCount) {
    return t("all_employees_selected");
  }
  return t("n_employees_selected", {count: selectedEmployees.length});
}
const getEmployeeName = employee => `${employee.firstName} ${employee.lastName}`;