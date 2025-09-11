import Banner from "@/components/banner"
import ContentfulFooter from "@/components/contentful-footer"
import PreviewBanner from "@/components/preview-banner"
import { Card, CardContent } from "@/components/ui/card"
import { textToHtml } from "@/lib/contentful"
import { getCachedPageByUrl } from "@/lib/cache"
import { draftMode } from "next/headers"
import Image from "next/image"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCachedPageByUrl("/")

    return {
      title: page.title || "Professor K M Shaw",
      description: page.metaDescription || "Professor K M Shaw - Emeritus Professor of Medicine",
      keywords: page.metaKeyWords,
      openGraph: page.image
        ? {
            images: [
              {
                url: page.image.url.startsWith("//") ? `https:${page.image.url}` : page.image.url,
                width: page.image.width,
                height: page.image.height,
                alt: page.image.description || page.image.title || "Professor K M Shaw",
              },
            ],
          }
        : undefined,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Professor K M Shaw",
      description: "Professor K M Shaw - Emeritus Professor of Medicine",
    }
  }
}

export default async function Home() {
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
    const page = await getCachedPageByUrl("/")

    let contentHtml = "<p>Content is being loaded...</p>"

    if (page.paragraph) {
      contentHtml = await textToHtml(page.paragraph)
    }

    return (
      <div>
        <PreviewBanner isDraft={page.isDraft} />
        {page.image && <Banner image={page.image} />}

        <div className="container mx-auto px-4 py-8">
          {!page.image && !isDraftMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <p className="font-bold">Content Notice</p>
              <p>
                This page is using default content. Please add a page with URL "/" in Contentful to customize this
                content.
              </p>
            </div>
          )}

          {/* Magazine-style profile section */}
          <div className="profile-section mb-12">
            <div className="profile-image-container">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] relative bg-gradient-to-br from-blue-50 to-blue-100">
                    {page.image ? (
                      <Image
                        src={page.image.url || "/placeholder.svg"}
                        alt={page.image.description || "Professor K M Shaw"}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-sm">Profile Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="profile-content">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {page.title?.replace(" - Professor K M Shaw", "") || "Professor K M Shaw"}
                </h1>
                <p className="text-xl text-gray-600">Emeritus Professor of Medicine</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional info cards in magazine grid */}
          <div className="magazine-grid">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Research Focus</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Diabetes & Endocrinology</li>
                  <li>• Cardiovascular Risk Factors</li>
                  <li>• Clinical Research</li>
                  <li>• Naval Medicine History</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-900">Affiliations</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• University of Portsmouth</li>
                  <li>• Portsmouth Hospitals NHS Trust</li>
                  <li>• Royal College of Physicians</li>
                  <li>• Diabetes UK</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-900">Editorial Work</h3>
                <p className="text-sm text-gray-700">Editor-in-Chief of Practical Diabetes International (1992-2014)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-orange-900">Recognition</h3>
                <p className="text-sm text-gray-700">Winner UK Hospital Doctor Diabetes Team Award 1998</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {page.footer && <ContentfulFooter footer={page.footer} />}
      </div>
    )
  } catch (error) {
    console.error("Error in Home page:", error)
    return (
      <div className="content-section">
        <h1>Professor K M Shaw</h1>
        <p>Content is currently unavailable. Please ensure Contentful is properly configured.</p>
      </div>
    )
  }
}
