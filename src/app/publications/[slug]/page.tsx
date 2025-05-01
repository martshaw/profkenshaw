import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { textToHtml } from "@/lib/contentful"
import { getCachedPdfs, getCachedPdfBySlug, getCachedPageByUrl } from "@/lib/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
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
  const params = await props.params;
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

    return (
      <div>
        <PreviewBanner isDraft={pdf.isDraft} />
        {publicationsPage?.image && <Banner image={publicationsPage.image} />}
        <div className="content-section">
          <Link href="/publications" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Publications
          </Link>

          <h1>
            {pdf.contentfullTitle}
            {pdf.isDraft && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Draft</span>}
          </h1>

          <div className="publication-content mt-6" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
        {publicationsPage?.footer && <ContentfulFooter footer={publicationsPage.footer} />}
      </div>
    )
  } catch (error) {
    console.error(`Error in Publication page for slug ${params.slug}:`, error)
    return notFound()
  }
}
