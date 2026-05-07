import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, extname, join } from "node:path"

import { parseJsonc } from "../../shared"
import { migrateLegacyConfigFile } from "../../shared/migrate-legacy-config-file"
import { CONFIG_BASENAME, LEGACY_CONFIG_BASENAME } from "../../shared/plugin-identity"
import type { ConfigMergeResult, InstallConfig } from "../types"
import { backupConfigFile } from "./backup-config"
import { getConfigDir, getOmoConfigPath } from "./config-context"
import { deepMergeRecord } from "./deep-merge-record"
import { ensureConfigDirectoryExists } from "./ensure-config-directory-exists"
import { formatErrorWithSuggestion } from "./format-error-with-suggestion"
import { generateOmoConfig } from "./generate-omo-config"

function isEmptyOrWhitespace(content: string): boolean {
  return content.trim().length === 0
}

export function writeOmoConfig(installConfig: InstallConfig): ConfigMergeResult {
  try {
    ensureConfigDirectoryExists()
  } catch (err) {
    return {
      success: false,
      configPath: getConfigDir(),
      error: formatErrorWithSuggestion(err, "create config directory"),
    }
  }

  const detectedConfigPath = getOmoConfigPath()
  const canonicalConfigPath = join(dirname(detectedConfigPath), `${CONFIG_BASENAME}${extname(detectedConfigPath) || ".json"}`)
  const shouldMigrateLegacyPath = basename(detectedConfigPath).startsWith(LEGACY_CONFIG_BASENAME)
  const ompaConfigPath = shouldMigrateLegacyPath
    ? ((migrateLegacyConfigFile(detectedConfigPath) || existsSync(canonicalConfigPath))
        ? canonicalConfigPath
        : detectedConfigPath)
    : detectedConfigPath

  try {
    const newConfig = generateOmoConfig(installConfig)

    if (existsSync(ompaConfigPath)) {
      const backupResult = backupConfigFile(ompaConfigPath)
      if (!backupResult.success) {
        return {
          success: false,
          configPath: ompaConfigPath,
          error: `Failed to create backup: ${backupResult.error}`,
        }
      }

      try {
        const stat = statSync(ompaConfigPath)
        const content = readFileSync(ompaConfigPath, "utf-8")

        if (stat.size === 0 || isEmptyOrWhitespace(content)) {
          writeFileSync(ompaConfigPath, JSON.stringify(newConfig, null, 2) + "\n")
          return { success: true, configPath: ompaConfigPath }
        }

        const existing = parseJsonc<Record<string, unknown>>(content)
        if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
          writeFileSync(ompaConfigPath, JSON.stringify(newConfig, null, 2) + "\n")
          return { success: true, configPath: ompaConfigPath }
        }

        const merged = deepMergeRecord(newConfig, existing)
        writeFileSync(ompaConfigPath, JSON.stringify(merged, null, 2) + "\n")
      } catch (parseErr) {
        if (parseErr instanceof SyntaxError) {
          writeFileSync(ompaConfigPath, JSON.stringify(newConfig, null, 2) + "\n")
          return { success: true, configPath: ompaConfigPath }
        }
        throw parseErr
      }
    } else {
      writeFileSync(ompaConfigPath, JSON.stringify(newConfig, null, 2) + "\n")
    }

    return { success: true, configPath: ompaConfigPath }
  } catch (err) {
    return {
      success: false,
      configPath: ompaConfigPath,
      error: formatErrorWithSuggestion(err, `write ${CONFIG_BASENAME} config`),
    }
  }
}
