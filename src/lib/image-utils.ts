export function getImageUrl(url: string, options?: { width?: number; height?: number; quality?: number }) {
  // Ensure we have a protocol for the image URL
  const imageUrl = url.startsWith("//") ? `https:${url}` : url

  // If no options are provided, return the original URL
  if (!options) {
    return imageUrl
  }

  // If the URL is from Contentful, we can use their Image API
  if (imageUrl.includes("images.ctfassets.net")) {
    const { width, height, quality } = options
    const params = new URLSearchParams()

    if (width) params.append("w", width.toString())
    if (height) params.append("h", height.toString())
    if (quality) params.append("q", quality.toString())

    return `${imageUrl}?${params.toString()}`
  }

  // For other URLs, return the original
  return imageUrl
}
