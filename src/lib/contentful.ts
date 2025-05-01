import { createClient } from "contentful"

// Check if required environment variables are defined
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
const previewSecret = process.env.CONTENTFUL_PREVIEW_SECRET

// Validate environment variables
if (!spaceId || !accessToken) {
  console.error(
    "Contentful environment variables are missing. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN.",
  )
}

if (!previewAccessToken) {
  console.warn(
    "Contentful preview access token is missing. Draft mode will not work. Set CONTENTFUL_PREVIEW_ACCESS_TOKEN.",
  )
}

if (!previewSecret) {
  console.warn("Contentful preview secret is missing. Draft mode will not be secure. Set CONTENTFUL_PREVIEW_SECRET.")
}

// Create the Contentful client
const client =
  spaceId && accessToken
    ? createClient({
        space: spaceId,
        accessToken: accessToken,
      })
    : null

// Create the preview client if preview access token is available
const previewClient =
  spaceId && previewAccessToken
    ? createClient({
        space: spaceId,
        accessToken: previewAccessToken,
        host: "preview.contentful.com",
      })
    : null

// Get the client based on the environment
const getClient = (preview = false) => {
  if (preview && !previewClient) {
    console.warn("Preview client requested but not available. Using regular client instead.")
    return client
  }
  return preview && previewClient ? previewClient : client
}

// Define types for our content models
export interface ContentfulImage {
  title: string
  description: string
  url: string
  width: number
  height: number
}

export interface FooterContent {
  contentfulTitle: string
  footerContent: string
}

export interface PageContent {
  title: string
  url: string
  metaDescription?: string
  metaKeyWords?: string
  paragraph: string
  image?: ContentfulImage
  footer?: FooterContent
  isDraft?: boolean
}

export interface PdfContent {
  contentfullTitle: string
  pdfContents: string
  slug: string
  isDraft?: boolean
}

// Create default page content for common routes
const defaultPages: Record<string, Partial<PageContent>> = {
  "/": {
    title: "Professor K M Shaw",
    url: "/",
    paragraph: "## Welcome to Professor K M Shaw's website\n\nPlease add content for this page in Contentful.",
  },
  "/about": {
    title: "About - Professor K M Shaw",
    url: "/about",
    paragraph: "## About Professor K M Shaw\n\nPlease add content for this page in Contentful.",
  },
  "/publications": {
    title: "Publications - Professor K M Shaw",
    url: "/publications",
    paragraph: "## Publications by Professor K M Shaw\n\nPlease add publications in Contentful.",
  },
}

// Fetch a single page by url
export async function getPageByUrl(url: string, preview = false): Promise<PageContent> {
  const contentfulClient = getClient(preview)

  if (!contentfulClient) {
    console.error("Contentful client not available. Check your environment variables.")
    return createDefaultPage(url)
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: "page",
      "fields.url": url,
      include: 2,
    })

    if (!response.items.length) {
      if (preview) {
        // In preview mode, we want to throw an error if the content doesn't exist
        throw new Error(`Page with URL ${url} not found in Contentful draft content`)
      }
      console.warn(`Page with URL ${url} not found in Contentful, using default content.`)
      return createDefaultPage(url)
    }

    const page = response.items[0]
    const fields = page.fields as any

    // Extract the image
    const imageFields = fields.image?.fields
    const image = imageFields
      ? {
          title: imageFields.title || "",
          description: imageFields.description || "",
          url: imageFields.file.url || "",
          width: imageFields.file.details.image.width || 1200,
          height: imageFields.file.details.image.height || 600,
        }
      : undefined

    // Extract the footer
    const footerFields = fields.footer?.fields
    const footer = footerFields
      ? {
          contentfulTitle: footerFields.contentfulTitle || "",
          footerContent: footerFields.footerContent || "",
        }
      : undefined

    return {
      title: fields.title || "",
      url: fields.url || url,
      metaDescription: fields.metaDescription || "",
      metaKeyWords: fields.metaKeyWords || "",
      paragraph: fields.paragraph || "",
      image,
      footer,
      isDraft: preview && !page.sys.publishedVersion,
    }
  } catch (error) {
    console.error(`Error fetching page ${url} from Contentful:`, error)
    if (preview) {
      // In preview mode, we want to throw the error
      throw error
    }
    return createDefaultPage(url)
  }
}

// Helper function to create a default page when not found in Contentful
function createDefaultPage(url: string): PageContent {
  const defaultPage = defaultPages[url] || {
    title: `${url.replace("/", "").charAt(0).toUpperCase() + url.replace("/", "").slice(1) || "Home"} Page`,
    url,
    paragraph: `## ${url.replace("/", "").charAt(0).toUpperCase() + url.replace("/", "").slice(1) || "Home"} Page\n\nPlease add content for this page in Contentful.`,
  }

  return {
    title: defaultPage.title || "",
    url: defaultPage.url || url,
    metaDescription: defaultPage.metaDescription || "",
    metaKeyWords: defaultPage.metaKeyWords || "",
    paragraph: defaultPage.paragraph || "",
    image: defaultPage.image,
    footer: defaultPage.footer,
  }
}

// Fetch all PDFs
export async function getAllPdfs(preview = false): Promise<PdfContent[]> {
  const contentfulClient = getClient(preview)

  if (!contentfulClient) {
    console.error("Contentful client not available. Check your environment variables.")
    return []
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: "pdf",
      include: 1,
    })

    if (!response.items.length) {
      return []
    }

    return response.items.map((item) => {
      const fields = item.fields as any

      return {
        contentfullTitle: fields.contentfullTitle || "",
        pdfContents: fields.pdfContents || "",
        slug: fields.slug || "",
        isDraft: preview && !item.sys.publishedVersion,
      }
    })
  } catch (error) {
    console.error("Error fetching PDFs from Contentful:", error)
    return []
  }
}

// Fetch a single PDF by slug
export async function getPdfBySlug(slug: string, preview = false): Promise<PdfContent | null> {
  const contentfulClient = getClient(preview)

  if (!contentfulClient) {
    console.error("Contentful client not available. Check your environment variables.")
    return null
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: "pdf",
      "fields.slug": slug,
      include: 1,
    })

    if (!response.items.length) {
      if (preview) {
        // In preview mode, we want to throw an error if the content doesn't exist
        throw new Error(`PDF with slug ${slug} not found in Contentful draft content`)
      }
      return null
    }

    const pdf = response.items[0]
    const fields = pdf.fields as any

    return {
      contentfullTitle: fields.contentfullTitle || "",
      pdfContents: fields.pdfContents || "",
      slug: fields.slug || slug,
      isDraft: preview && !pdf.sys.publishedVersion,
    }
  } catch (error) {
    console.error(`Error fetching PDF ${slug} from Contentful:`, error)
    if (preview) {
      // In preview mode, we want to throw the error
      throw error
    }
    return null
  }
}

// Helper function to convert text to HTML
export async function textToHtml(text: string) {
  try {
    // If text is empty or undefined, return an empty paragraph
    if (!text) {
      return "<p></p>"
    }

    // Import remark and remark-html
    const remarkModule = await import("remark")
    const remarkHtmlModule = await import("remark-html")

    // Create a new processor with the html plugin properly initialized
    const processor = remarkModule.remark().use(remarkHtmlModule.default)

    // Process the markdown text
    const result = await processor.process(text)

    // Return the HTML string
    return result.toString()
  } catch (error) {
    console.error("Error converting text to HTML:", error)
    return `<p>${text}</p>`
  }
}
