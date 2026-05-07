export const OMPA_INTERNAL_INITIATOR_MARKER = "<!-- OMPA_INTERNAL_INITIATOR -->"

const INTERNAL_INITIATOR_MARKER_PATTERN = /\n*<!--\s*OMPA_INTERNAL_INITIATOR\s*-->\s*/g

export function stripInternalInitiatorMarkers(text: string): string {
  return text.replace(INTERNAL_INITIATOR_MARKER_PATTERN, "").trimEnd()
}

export function createInternalAgentTextPart(text: string): {
  type: "text"
  text: string
} {
  const cleanText = stripInternalInitiatorMarkers(text)
  return {
    type: "text",
    text: `${cleanText}\n${OMPA_INTERNAL_INITIATOR_MARKER}`,
  }
}
