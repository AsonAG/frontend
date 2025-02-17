import { SxProps, Theme } from "@mui/material";

type ColumnDef = {
  width: number,
  flex?: number
}

function templateColumnMap(def: ColumnDef) {
  if (def.flex) {
    return `minmax(${def.width}px, ${def.flex}fr)`;

  }
  return def.width + "px";
}
export function getRowGridSx(columnSizes: Array<ColumnDef>, spacing: number = 0): SxProps<Theme> {
  if (columnSizes.length === 0)
    return {};

  const templateColumns = columnSizes.map(templateColumnMap).join(" ");
  const minWidth = columnSizes.map(def => def.width).reduce((a, b) => a + b);
  return {
    display: "grid",
    gap: spacing,
    gridTemplateColumns: templateColumns,
    gridTemplateRows: "auto",
    alignItems: "stretch",
    justifyItems: "stretch",
    maxWidth: theme => `calc(${theme.spacing(spacing * (columnSizes.length - 1))} + ${minWidth}px)`,
    width: theme => `calc(${theme.spacing(spacing * (columnSizes.length - 1))} + ${minWidth}px)`,
    minWidth: "100%"
  }
}
const formatter = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parts = formatter.formatToParts(1000);
export const groupSeparator = parts.find(p => p.type === "group")?.value;
export function formatValue(value: number | null | undefined) {
  if (!value)
    return null;
  return formatter.format(value);
}
export function getStickySx(priority: number, position: { top?: number, bottom?: number, left?: number, right?: number }): SxProps<Theme> {
  return {
    ...position,
    position: "sticky",
    zIndex: priority
  }
}

