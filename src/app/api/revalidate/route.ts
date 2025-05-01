import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract the content type and id from the webhook payload
    const { sys } = body
    const contentType = sys?.contentType?.sys?.id

    // Determine which paths to revalidate based on content type
    let paths = ["/"]

    if (contentType === "page") {
      const url = body.fields?.url?.["en-US"]
      if (url) {
        paths.push(url)
      }
    } else if (contentType === "pdf") {
      paths.push("/publications")
      const slug = body.fields?.slug?.["en-US"]
      if (slug) {
        paths.push(`/publications/${slug}`)
      }
    } else if (contentType === "footer") {
      // Revalidate all pages when footer is updated
      paths = ["/", "/about", "/publications"]
    }

    // Revalidate all affected paths
    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch (error) {
    console.error("Error revalidating:", error)
    return NextResponse.json({ revalidated: false, error: "Failed to revalidate" }, { status: 500 })
  }
}
