import dayjs from "dayjs";
import i18next from "i18next";

const dateTimeFormatter = (params) =>
  params?.value ? dayjs.utc(params.value).format("L LT") : null;

const dateFormatter = (params) =>
  params?.value ? dayjs.utc(params.value).format("L") : null;


export function createDateColumns() {
  return [
    {
      field: "start",
      headerName: i18next.t("Start"),
      width: 125,
      valueFormatter: dateFormatter,
    },
    {
      field: "end",
      headerName: i18next.t("End"),
      width: 125,
      valueFormatter: dateFormatter,
    },
    {
      field: "created",
      headerName: i18next.t("Created"),
      width: 145,
      valueFormatter: dateTimeFormatter,
    },
  ];
}