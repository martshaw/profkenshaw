import { documentToHtmlString } from "@contentful/rich-text-html-renderer"
import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types"

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
    [MARKS.UNDERLINE]: (text: string) => `<u>${text}</u>`,
    [MARKS.CODE]: (text: string) => `<code>${text}</code>`,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, next: any) => `<p>${next(node.content)}</p>`,
    [BLOCKS.HEADING_1]: (node: any, next: any) => `<h1>${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: any, next: any) => `<h2>${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: any, next: any) => `<h3>${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: any, next: any) => `<h4>${next(node.content)}</h4>`,
    [BLOCKS.HEADING_5]: (node: any, next: any) => `<h5>${next(node.content)}</h5>`,
    [BLOCKS.HEADING_6]: (node: any, next: any) => `<h6>${next(node.content)}</h6>`,
    [BLOCKS.UL_LIST]: (node: any, next: any) => `<ul>${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: any, next: any) => `<ol>${next(node.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (node: any, next: any) => `<li>${next(node.content)}</li>`,
    [BLOCKS.QUOTE]: (node: any, next: any) => `<blockquote>${next(node.content)}</blockquote>`,
    [BLOCKS.HR]: () => `<hr />`,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      // Check if node.data and node.data.target exist
      if (!node.data || !node.data.target || !node.data.target.fields) {
        return ""
      }

      const { title, description, file } = node.data.target.fields

      // Check if file exists
      if (!file) {
        return ""
      }

      const { url, details } = file

      // Check if details and details.image exist
      if (details && details.image) {
        return `<img src="${url}" alt="${description || title || "Embedded image"}" width="${
          details.image.width
        }" height="${details.image.height}" />`
      }

      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${title || "Download file"}</a>`
    },
    [INLINES.HYPERLINK]: (node: any, next: any) => {
      const { uri } = node.data
      return `<a href="${uri}" target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`
    },
    [INLINES.ENTRY_HYPERLINK]: (node: any, next: any) => {
      // Check if node.data and node.data.target exist
      if (!node.data || !node.data.target || !node.data.target.fields) {
        return next(node.content)
      }

      // Fixed the typo in accessing fields
      const { slug } = node.data.target.fields
      return `<a href="/${slug}">${next(node.content)}</a>`
    },
  },
}

export function renderRichText(document: Document | null | undefined) {
  // Check if document is null, undefined, or empty
  if (!document || !document.content || document.content.length === 0) {
    return "<p>No content available</p>"
  }

  try {
    return documentToHtmlString(document, options)
  } catch (error) {
    console.error("Error rendering rich text:", error)
    return "<p>Error displaying content</p>"
  }
}
