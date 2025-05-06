import Image from "next/image"
import type { ContentfulImage } from "@/lib/contentful"

interface BannerProps {
  image?: ContentfulImage
}

export default function Banner({ image }: BannerProps) {
  if (!image) {
    return null
  }

  // Ensure we have a protocol for Contentful images
  const imageUrl = image.url.startsWith("//") ? `https:${image.url}` : image.url

  return (
    <div className="relative w-full h-64 md:h-80">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={image.description || image.title || "Banner image"}
        fill
        className="banner-image object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  )
}
