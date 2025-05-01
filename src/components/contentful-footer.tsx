import type { FooterContent } from "@/lib/contentful"

interface ContentfulFooterProps {
  footer?: FooterContent
}

export default function ContentfulFooter({ footer }: ContentfulFooterProps) {
  if (!footer) {
    return null
  }

  return (
    <div className="bg-gray-100 py-4 border-t">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>{footer.footerContent}</p>
      </div>
    </div>
  )
}
