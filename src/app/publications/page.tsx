import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

    // Group publications by year for better organization
    const publicationsByYear = pdfs.reduce(
      (acc, pdf) => {
        // Extract year from title or use current year as fallback
        const yearMatch = pdf.contentfullTitle.match(/\b(19|20)\d{2}\b/)
        const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString()

        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(pdf)
        return acc
      },
      {} as Record<string, typeof pdfs>,
    )

    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

    return (
      <div>
        <PreviewBanner isDraft={page.isDraft || hasDraftPdfs} />
        {page.image && <Banner image={page.image} />}

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title || "Publications"}</h1>

          {!page.image && !isDraftMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <p className="font-bold">Content Notice</p>
              <p>
                This page is using default content. Please add a page with URL "/publications" in Contentful to
                customize this content.
              </p>
            </div>
          )}

          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </CardContent>
            </Card>
          </div>

          {pdfs.length > 0 ? (
            <div className="space-y-8">
              {/* Publications Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Publications by Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-24">Year</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                        <TableHead className="w-24">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pdfs.map((pdf, index) => {
                        const yearMatch = pdf.contentfullTitle.match(/\b(19|20)\d{2}\b/)
                        const year = yearMatch ? yearMatch[0] : "N/A"

                        return (
                          <TableRow key={pdf.slug}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-gray-900">{pdf.contentfullTitle}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {pdf.pdfContents.substring(0, 100)}...
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {year}
                              </span>
                            </TableCell>
                            <TableCell>
                              {pdf.isDraft ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Draft
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Published
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/publications/${pdf.slug}`}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                Read
                              </Link>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Publications by Year Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedYears.map((year) => (
                  <Card key={year} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {publicationsByYear[year].map((pdf) => (
                          <div key={pdf.slug} className="border-l-2 border-blue-200 pl-3">
                            <Link
                              href={`/publications/${pdf.slug}`}
                              className="block hover:text-blue-600 transition-colors"
                            >
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {pdf.contentfullTitle}
                                {pdf.isDraft && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                                    Draft
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {pdf.pdfContents.substring(0, 80)}...
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-blue-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Publications Found</h3>
                <p className="text-gray-600">Please add PDF entries in Contentful to display publications here.</p>
              </CardContent>
            </Card>
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
