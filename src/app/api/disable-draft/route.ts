import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectPath = searchParams.get("path") || "/"

  // Disable Draft Mode
  (await draftMode()).disable()

  // Redirect to the path or home page
  redirect(redirectPath)
}
