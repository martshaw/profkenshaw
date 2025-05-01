import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { getPageByUrl, getPdfBySlug } from "@/lib/contentful"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Authentication - validate the secret
  const secret = searchParams.get("secret")
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 })
  }

  // Check the content type
  const contentType = searchParams.get("contentType")
  const slug = searchParams.get("slug")

  if (!contentType || !slug) {
    return new Response("Missing contentType or slug", { status: 400 })
  }

  // Verify the content exists
  try {
    if (contentType === "page") {
      // For pages, the slug is the URL
      await getPageByUrl(slug, true)

      // Enable Draft Mode
      (await draftMode()).enable()

      // Redirect to the page
      redirect(slug)
    } else if (contentType === "pdf") {
      // For PDFs, verify the content exists
      const pdf = await getPdfBySlug(slug, true)

      if (!pdf) {
        return new Response(`PDF with slug '${slug}' not found`, { status: 404 })
      }

      // Enable Draft Mode
      (await draftMode()).enable()

      // Redirect to the PDF page
      redirect(`/publications/${slug}`)
    } else {
      return new Response(`Unsupported content type: ${contentType}`, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying content for preview:", error)
    return new Response(`Error verifying content: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}
