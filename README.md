# Ason Payroll Frontend

The ready-to-use frontend of Ason Payroll: React (Vite, MUI), built entirely on the public Ason API. It covers every
feature of the [Feature Map](https://docs.asonpayroll.com/feat-features) - use it as it is, adapt it, or take it as the reference for your own UI.

- **Embedded or as-is:** whether you embed Ason in your platform or run this frontend, the API is the same - this
  repository shows one way to build on it (e.g. [CaseMan](https://docs.asonpayroll.com/feat-case-data), the generic case form; the editable
  [wage type master](https://docs.asonpayroll.com/feat-wagetypes-master); the [report dialog](https://docs.asonpayroll.com/feat-reports))
- **Typically you start** with colors and fonts, then hide what your users don't need

## Start against the sandbox

Prerequisites: Node.js, a sandbox user (register on the sandbox, see the [Quickstart](https://docs.asonpayroll.com/quickstart))

```bash
git clone https://github.com/AsonAG/frontend.git
cd frontend
npm install
npm run sandbox
```

Open http://localhost:3003 and log in with your sandbox user. The sandbox mode (`.env.sandbox`) talks to
`https://sandbox-api.asonpayroll.com` and logs in through the sandbox identity provider (Zitadel) - nothing else to set up.

## Make it your own

| What | Where |
| --- | --- |
| Colors (light and dark mode) | `src/colors.ts` - primary color, selection colors |
| Theme: typography, components | `src/theme.ts` (MUI theme) |
| Fonts | `index.html` (Google Fonts link) and `src/theme.ts` |
| Logo, favicon, app name | `public/`, `VITE_APP_NAME` |
| Texts and languages (de, en, fr, it) | `src/translations/` |
| Hide features | `VITE_DISABLED_UI_FEATURES` - comma separated names of `src/utils/UIFeature.tsx` (e.g. `HrTasks,UsersInvite`) |

## Configuration

All settings are environment variables (`.env.<mode>`, read by Vite at build time):

| Variable | |
| --- | --- |
| `VITE_API_URL` | address of the Ason API |
| `VITE_AUTHORITY_URL`, `VITE_AUTHORITY_SETTINGS_URL` | identity provider (Zitadel) and its user console |
| `VITE_CLIENT_ID`, `VITE_PROJECT_ID` | OIDC client of the frontend |
| `VITE_REDIRECT_URL` | where the login returns to (the address of the frontend) |
| `VITE_SCOPE`, `VITE_AUDIENCE` | optional: OIDC scope (default `openid profile email`) and audience |
| `VITE_APP_NAME`, `VITE_META_DESCRIPTION` | title and description of the page |
| `VITE_DISABLED_UI_FEATURES` | optional: features to hide (see above) |

**Authentication:** users log in interactively through the identity provider (OIDC) - the same login as in the [Ason
docs](https://docs.asonpayroll.com); the API gets their token as `Authorization: Bearer <token>`. Users are invited to a tenant
(`/invitation/{invitationId}`), see [User / Authentication](https://docs.asonpayroll.com/user-authentication).

## Production / your own instance

```bash
npm run build
```

Writes the static app to `build/`, to be served by any static host (with a fallback to `index.html`,
see `staticwebapp.config.json`). Set the variables above for your Ason instance - talk to Ason for the API address and
the OIDC client of your production instance. Ason deploys its own instances with the GitHub workflow
`.github/workflows/azure-static-web-apps.yml` (Azure Static Web Apps, variables per environment).

`npm start` runs the development mode (`.env.development`) against an Ason backend on localhost - for Ason developers only.

## More

- [Ason docs](https://docs.asonpayroll.com): [Quickstart](https://docs.asonpayroll.com/quickstart), [Feature Map](https://docs.asonpayroll.com/feat-features), [API Reference](https://docs.asonpayroll.com/api), [User / Authentication](https://docs.asonpayroll.com/user-authentication)
- Test the whole API: [Bruno tests](https://github.com/AsonAG/bruno-tests)
