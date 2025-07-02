import React from "react";
import { ContentLayout } from "../components/ContentLayout";
import { PayrollData } from "./PayrollData";

export function NewPayrollView() {
  return (
    <ContentLayout title="New organization unit">
      <PayrollData />
    </ContentLayout>
  );
}

