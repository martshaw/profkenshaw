import { cache } from "react"
import { draftMode } from "next/headers"
import { getPageByUrl, getAllPdfs, getPdfBySlug } from "./contentful"

// Cache the page content with error handling and draft mode support
export const getCachedPageByUrl = cache(async (url: string) => {
  // Fix: Get the draft mode status safely
  let isDraftMode = false
  try {
    const draftModeData = await draftMode()
    isDraftMode = draftModeData?.isEnabled || false
  } catch (error) {
    console.error("Error checking draft mode:", error)
    // Default to non-draft mode if there's an error
    isDraftMode = false
  }

  try {
    return await getPageByUrl(url, isDraftMode)
  } catch (error) {
    console.error(`Error fetching page ${url}:`, error)
    throw error
  }
})

// Cache all PDFs with error handling and draft mode support
export const getCachedPdfs = cache(async () => {
  // Fix: Get the draft mode status safely
  let isDraftMode = false
  try {
    const draftModeData = await draftMode()
    isDraftMode = draftModeData?.isEnabled || false
  } catch (error) {
    console.error("Error checking draft mode:", error)
    // Default to non-draft mode if there's an error
    isDraftMode = false
  }

  try {
    return await getAllPdfs(isDraftMode)
  } catch (error) {
    console.error("Error fetching PDFs:", error)
    return []
  }
})

// Cache a single PDF with error handling and draft mode support
export const getCachedPdfBySlug = cache(async (slug: string) => {
  // Fix: Get the draft mode status safely
  let isDraftMode = false
  try {
    const draftModeData = await draftMode()
    isDraftMode = draftModeData?.isEnabled || false
  } catch (error) {
    console.error("Error checking draft mode:", error)
    // Default to non-draft mode if there's an error
    isDraftMode = false
  }

  try {
    const pdf = await getPdfBySlug(slug, isDraftMode)
    return pdf
  } catch (error) {
    console.error(`Error fetching PDF ${slug}:`, error)
    return null
  }
})
