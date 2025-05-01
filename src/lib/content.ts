import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const contentDirectory = path.join(process.cwd(), "content")

export function getContentData(section: string) {
  const fullPath = path.join(contentDirectory, `${section}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Use gray-matter to parse the metadata section
  const { data, content } = matter(fileContents)

  return {
    metadata: data,
    content,
  }
}

export async function getContentHtml(content: string) {
  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(content)

  return processedContent.toString()
}

export async function getPublications() {
  const fullPath = path.join(contentDirectory, "publications")

  // Check if directory exists
  if (!fs.existsSync(fullPath)) {
    return []
  }

  const files = fs.readdirSync(fullPath)

  const publications = files.map((filename) => {
    const filePath = path.join(fullPath, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")

    // Use gray-matter to parse the metadata section
    const { data, content } = matter(fileContents)

    return {
      id: filename.replace(/\.md$/, ""),
      metadata: data,
      content,
    }
  })

  // Sort publications by date if available
  return publications.sort((a, b) => {
    if (a.metadata.date && b.metadata.date) {
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    }
    return 0
  })
}

export function getFeaturedImage(metadata: any) {
  return metadata.featuredImage || null
}
