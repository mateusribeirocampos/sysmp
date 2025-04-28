/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_INSTITUICAO_NOME: string
  readonly VITE_LOGO_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}