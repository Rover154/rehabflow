/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_CHAT_ID: string
  readonly VITE_IO_NET_API_KEY: string
  readonly VITE_IO_NET_API_URL: string
  readonly VITE_AI_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
