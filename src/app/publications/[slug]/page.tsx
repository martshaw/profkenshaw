import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { textToHtml } from "@/lib/contentful"
import { getCachedPdfs, getCachedPdfBySlug, getCachedPageByUrl } from "@/lib/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const pdf = await getCachedPdfBySlug(params.slug)

    if (!pdf) {
      return {
        title: "Publication Not Found",
        description: "The requested publication could not be found.",
      }
    }

    return {
      title: pdf.contentfullTitle || "Publication - Professor K M Shaw",
      description: `Publication by Professor K M Shaw: ${pdf.contentfullTitle}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Publication - Professor K M Shaw",
      description: "Publication by Professor K M Shaw",
    }
  }
}

export async function generateStaticParams() {
  try {
    const pdfs = await getCachedPdfs()

    return pdfs.map((pdf) => ({
      slug: pdf.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function PublicationPage(props: Props) {
  const params = await props.params
  try {
    const [pdf, publicationsPage] = await Promise.all([
      getCachedPdfBySlug(params.slug),
      getCachedPageByUrl("/publications"),
    ])

    if (!pdf) {
      return notFound()
    }

    let contentHtml = "<p>Content is being loaded...</p>"

    if (pdf.pdfContents) {
      contentHtml = await textToHtml(pdf.pdfContents)
    }

    // Extract year from title
    const yearMatch = pdf.contentfullTitle.match(/\b(19|20)\d{2}\b/)
    const year = yearMatch ? yearMatch[0] : null

    return (
      <div>
        <PreviewBanner isDraft={pdf.isDraft} />
        {publicationsPage?.image && <Banner image={publicationsPage.image} />}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
              <Link
                href="/publications"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Publications
              </Link>
            </div>

            {/* Publication Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-4">{pdf.contentfullTitle}</CardTitle>
                    <div className="flex items-center space-x-4">
                      {year && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {year}
                        </span>
                      )}
                      {pdf.isDraft && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Publication Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {publicationsPage?.footer && <ContentfulFooter footer={publicationsPage.footer} />}
      </div>
    )
  } catch (error) {
    console.error(`Error in Publication page for slug ${params.slug}:`, error)
    return notFound()
  }
}
