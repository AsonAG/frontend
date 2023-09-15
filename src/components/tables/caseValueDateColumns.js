import dayjs from "dayjs";

const dateTimeFormatter = (params) =>
  params?.value ? dayjs(params.value).format("L LT") : null;

const dateFormatter = (params) =>
  params?.value ? dayjs(params.value).format("L") : null;


const dateColumns = [
    {
        field: "start",
        headerName: "Start",
        width: 125,
        valueFormatter: dateFormatter,
    },
    {
        field: "end",
        headerName: "End",
        width: 125,
        valueFormatter: dateFormatter,
    },
    {
        field: "created",
        headerName: "Created",
        width: 145,
        valueFormatter: dateTimeFormatter,
    },
];

export { dateColumns };