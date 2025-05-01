import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { textToHtml } from "@/lib/contentful"
import { getCachedPageByUrl, getCachedPdfs } from "@/lib/cache"
import { draftMode } from "next/headers"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCachedPageByUrl("/publications")

    return {
      title: page.title || "Publications - Professor K M Shaw",
      description: page.metaDescription || "Publications by Professor K M Shaw - Emeritus Professor of Medicine",
      keywords: page.metaKeyWords,
      openGraph: page.image
        ? {
            images: [
              {
                url: page.image.url.startsWith("//") ? `https:${page.image.url}` : page.image.url,
                width: page.image.width,
                height: page.image.height,
                alt: page.image.description || page.image.title || "Publications by Professor K M Shaw",
              },
            ],
          }
        : undefined,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Publications - Professor K M Shaw",
      description: "Publications by Professor K M Shaw - Emeritus Professor of Medicine",
    }
  }
}

export default async function Publications() {
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
    const [page, pdfs] = await Promise.all([getCachedPageByUrl("/publications"), getCachedPdfs()])

    let contentHtml = "<p>Content is being loaded...</p>"

    if (page.paragraph) {
      contentHtml = await textToHtml(page.paragraph)
    }

    // Check if any PDFs are in draft mode
    const hasDraftPdfs = pdfs.some((pdf) => pdf.isDraft)

    return (
      <div>
        <PreviewBanner isDraft={page.isDraft || hasDraftPdfs} />
        {page.image && <Banner image={page.image} />}
        <div className="content-section">
          <h1>{page.title || "Publications"}</h1>
          {!page.image && !isDraftMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <p className="font-bold">Content Notice</p>
              <p>
                This page is using default content. Please add a page with URL "/publications" in Contentful to
                customize this content.
              </p>
            </div>
          )}
          <div className="publications-intro" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {pdfs.length > 0 ? (
            <div className="publications-list space-y-6 mt-8">
              {pdfs.map((pdf) => (
                <div key={pdf.slug} className="publication-item border-b pb-4">
                  <h2>
                    {pdf.contentfullTitle}
                    {pdf.isDraft && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Draft</span>
                    )}
                  </h2>
                  <p>{pdf.pdfContents.substring(0, 150)}...</p>
                  <Link href={`/publications/${pdf.slug}`} className="text-blue-600 hover:underline">
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-8" role="alert">
              <p className="font-bold">No Publications Found</p>
              <p>Please add PDF entries in Contentful to display publications here.</p>
            </div>
          )}
        </div>
        {page.footer && <ContentfulFooter footer={page.footer} />}
      </div>
    )
  } catch (error) {
    console.error("Error in Publications page:", error)
    return (
      <div className="content-section">
        <h1>Publications</h1>
        <p>Content is currently unavailable. Please ensure Contentful is properly configured.</p>
      </div>
    )
  }
}
