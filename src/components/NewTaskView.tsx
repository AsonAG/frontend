import { useRef, useState } from "react";
import { useLocation, Link, useSubmit, Form, useLoaderData } from "react-router-dom";
import { Stack, Typography, Button,  TextField, Autocomplete } from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { DatePicker } from "./DatePicker";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Employee, getEmployeeDisplayString } from "../models/Employee";


export function NewTaskView() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const backLink = useBacklink();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [dueOn, setDueOn] = useState<Dayjs | null>(dayjs());
  const [instruction, setInstruction] = useState("");
  const [comment, setComment] = useState("");
  const saveTask = () => {
    if (formRef?.current?.reportValidity()) {
      const task = {
        name,
        category,
        instruction,
        comment,
        employeeId: employee?.id ?? null,
        scheduled: dueOn?.toISOString() ?? null,
      }
      submit(task, { method: "post", encType: "application/json" });
    }
  };
  return (
    <Form method="post" ref={formRef} id="new_task_form" autoComplete="off">
      <ContentLayout title={t("New task")}>
        <Stack spacing={2}>
          <TextField required value={name} label={t("Name")} onChange={event => setName(event.target.value)}/>
          <TextField required size="small" value={category} label={t("Category")} onChange={event => setCategory(event.target.value)}/>
          <EmployeeDropdown label={t("Employee")} selectedEmployee={employee} setSelectedEmployee={setEmployee} />
          <DatePicker variant="standard" required label={t("Due on")} value={dueOn} onChange={d => setDueOn(d)} minDate={dayjs()}/>
          <TextField multiline required rows={5} value={instruction} label={t("Instructions")} onChange={event => setInstruction(event.target.value)}/>
          <TextField multiline rows={5} value={comment} label={t("Comment")} onChange={event => setComment(event.target.value)}/>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button component={Link} to={backLink} relative="path"><Typography>{t("Back")}</Typography></Button>
            <Button variant="contained" onClick={saveTask}><Typography>{t("Save")}</Typography></Button>
          </Stack>
        </Stack>
      </ContentLayout>
    </Form>
  );
}

function EmployeeDropdown({label, selectedEmployee, setSelectedEmployee}) {
  const employees = useLoaderData() as Array<Employee>;
  return <Autocomplete
    size="medium"
    options={employees}
    value={selectedEmployee}
    onChange={(_, newValue) => setSelectedEmployee(newValue)}
    getOptionLabel={getEmployeeDisplayString}
    renderInput={params => <TextField label={label} {...params} />}
    />
}

function useBacklink() {
  const { state } = useLocation();
  let backLinkPath = "..";
  if (state?.taskFilter) {
    backLinkPath += state.taskFilter;
  }
  return backLinkPath;
}
