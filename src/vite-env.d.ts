/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_REDIRECT_URL: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_CLIENT_ID: string
  readonly VITE_AUTHORITY_URL: string
  readonly VITE_AUTHORITY_SETTINGS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
