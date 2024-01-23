import React from "react";
import { ContentLayout } from "../ContentLayout";
import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CompletionView() {
  const { t } = useTranslation();
  return (
    <ContentLayout title="Krankenkasse">
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle1">{t("(Beispielhilfetext)")}</Typography>
          <Typography variant="subtitle1">{t("Vom Institut werden weitere Infos benötigt.")}</Typography>
          <Typography variant="subtitle1">{t("Mit dem Klick auf den unten dargestellten Link werden sie auf die Webseite des Institutes weitergeleitet um die erforderlichen Angaben zu machen.")}</Typography>
          <Typography variant="subtitle1">{t("Bitte schliessen sie die Aufgabe nach dem Ausfüllen mit dem Button unten ab.")}</Typography>
        </Stack>
        <Typography variant="h6">{t("Link")}</Typography>
        <Link to="http://localhost:3003/completion?user=ABC&password=ABC" >http://localhost:3003/completion?user=ABC&password=ABC</Link>
        <Typography variant="h6">{t("User")}</Typography>
        <Typography>ABC</Typography>
        <Typography variant="h6">{t("Passwort")}</Typography>
        <Typography>ABC</Typography>
        <Stack direction="row" justifyContent="end">
          <Button component={Link} to="../.." relative="path">Back</Button>
          <Button variant="contained" component={Link} to="../.." relative="path">Abschliessen</Button>
        </Stack>
      </Stack>
    </ContentLayout>
  )
}
