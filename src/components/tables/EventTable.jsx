import { React } from "react";
import { useAsyncValue } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import dayjs from "dayjs";


function formatDate(date, includeTime) {
  if (!date) return null;
  const formatString = includeTime ? "L LT" : "L";
  return dayjs.utc(date).format(formatString);
}

function DesktopEventTable() {
  const events = useAsyncValue();
  const { t } = useTranslation();
  const sx = { wordBreak: "break-word" };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Case")}</TableCell>
            <TableCell>{t("Field")}</TableCell>
            <TableCell>{t("Value")}</TableCell>
            <TableCell>{t("Start")}</TableCell>
            <TableCell>{t("End")}</TableCell>
            <TableCell>{t("Created")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => {
            return <TableRow 
              key={event.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
            >
              <TableCell component="th" scope="row" sx={sx}>
                {event.caseName}
              </TableCell>
              <TableCell sx={sx}>{event.caseFieldName}</TableCell>
              <TableCell>{event.value}</TableCell>
              <TableCell>{formatDate(event.start)}</TableCell>
              <TableCell>{formatDate(event.end)}</TableCell>
              <TableCell>{formatDate(event.created, true)}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MobileEventTable() {
  const events = useAsyncValue();
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Field")}</TableCell>
            <TableCell>{t("Created")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => {
            return (
              <TableRow 
                key={event.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Stack>
                    <Typography gutterBottom>{event.caseFieldName}</Typography>
                    <Typography fontWeight="500">{event.value}</Typography>
                    {
                      event.start && <>
                        <Typography variant="body2">{t("valid from")}:</Typography>
                        <Typography variant="body2">{formatDate(event.start)}</Typography>
                        { 
                          event.end && <>
                            <Typography variant="body2">{t("until")}:</Typography>
                            <Typography variant="body2">{formatDate(event.end)}</Typography>
                          </>
                        }
                      </>
                    }
                  </Stack>
                </TableCell>
                <TableCell>{formatDate(event.created, true)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export function EventTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile ? <MobileEventTable /> : <DesktopEventTable />;
}