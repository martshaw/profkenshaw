import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { Card, CardContent } from "@/components/ui/card"
import { textToHtml } from "@/lib/contentful"
import { getCachedPageByUrl } from "@/lib/cache"
import { draftMode } from "next/headers"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCachedPageByUrl("/about")

    return {
      title: page.title || "About - Professor K M Shaw",
      description: page.metaDescription || "About Professor K M Shaw - Emeritus Professor of Medicine",
      keywords: page.metaKeyWords,
      openGraph: page.image
        ? {
            images: [
              {
                url: page.image.url.startsWith("//") ? `https:${page.image.url}` : page.image.url,
                width: page.image.width,
                height: page.image.height,
                alt: page.image.description || page.image.title || "About Professor K M Shaw",
              },
            ],
          }
        : undefined,
    }
  } catch (error) {
    console.error("Error generating metadata :", error)
    return {
      title: "About - Professor K M Shaw",
      description: "About Professor K M Shaw - Emeritus Professor of Medicine",
    }
  }
}

export default async function About() {
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
    const page = await getCachedPageByUrl("/about")

    let contentHtml = "<p>Content is being loaded...</p>"

    if (page.paragraph) {
      contentHtml = await textToHtml(page.paragraph)
    }

    return (
      <div>
        <PreviewBanner isDraft={page.isDraft} />
        {page.image && <Banner image={page.image} />}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {page.title?.replace(" - Professor K M Shaw", "") || "About Professor K M Shaw"}
            </h1>

            {!page.image && !isDraftMode && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                <p className="font-bold">Content Notice</p>
                <p>
                  This page is using default content. Please add a page with URL "/about" in Contentful to customize
                  this content.
                </p>
              </div>
            )}

            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {page.footer && <ContentfulFooter footer={page.footer} />}
      </div>
    )
  } catch (error) {
    console.error("Error in About page:", error)
    return (
      <div className="content-section">
        <h1>About Professor K M Shaw</h1>
        <p>Content is currently unavailable. Please ensure Contentful is properly configured.</p>
      </div>
    )
  }
}
