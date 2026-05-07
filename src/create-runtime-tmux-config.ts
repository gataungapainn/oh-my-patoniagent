import type { OhMyPatoniAgentConfig, TmuxConfig } from "./config"
import { TmuxConfigSchema } from "./config/schema/tmux"

type RuntimeWithBun = typeof globalThis & {
  Bun?: {
    which(binary: string): string | null
  }
}

function defaultWhich(binary: string): string | null {
  return (globalThis as RuntimeWithBun).Bun?.which(binary) ?? null
}

export function isTmuxIntegrationEnabled(
  pluginConfig: { tmux?: { enabled?: boolean } | undefined },
): boolean {
  return pluginConfig.tmux?.enabled ?? false
}

export function isInteractiveBashEnabled(
  which: (binary: string) => string | null = defaultWhich,
): boolean {
  return which("tmux") !== null
}

export function createRuntimeTmuxConfig(pluginConfig: { tmux?: OhMyPatoniAgentConfig["tmux"] }): TmuxConfig {
  return TmuxConfigSchema.parse(pluginConfig.tmux ?? {})
}
