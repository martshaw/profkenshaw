# Contentful Preview Setup Guide

This guide explains how to set up the preview functionality for your Contentful-powered website.

## Environment Variables

First, make sure you have the following environment variables set up in your `.env.local` file:

\`\`\`
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_access_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
\`\`\`

- `CONTENTFUL_SPACE_ID`: Your Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN`: Your Contentful delivery API access token
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN`: Your Contentful preview API access token
- `CONTENTFUL_PREVIEW_SECRET`: A random string you define to secure your preview URLs

## Setting Up Preview URLs in Contentful

1. Log in to your Contentful account and navigate to your space
2. Go to Settings > Content Preview
3. Click "Add Content Preview"
4. Fill in the following details:
   - Name: "Website Preview"
   - URL for page content type: `https://your-website.com/api/enable-draft?secret={CONTENTFUL_PREVIEW_SECRET}&contentType=page&slug={entry.fields.url}`
   - URL for pdf content type: `https://your-website.com/api/enable-draft?secret={CONTENTFUL_PREVIEW_SECRET}&contentType=pdf&slug={entry.fields.slug}`

5. Replace `your-website.com` with your actual domain
6. Replace `{CONTENTFUL_PREVIEW_SECRET}` with the same secret you used in your environment variables

## Testing the Preview

1. In Contentful, create or edit a page or PDF entry
2. Without publishing, click the "Open preview" button in the top-right corner
3. Select "Website Preview" from the dropdown
4. You should be redirected to your website with the draft content displayed
5. A blue "Preview Mode" banner should appear at the top of the page

## Troubleshooting

If the preview doesn't work:

1. Check that all environment variables are correctly set
2. Ensure the preview URLs in Contentful are correctly formatted
3. Verify that your Contentful content model matches the expected structure
4. Check the browser console and server logs for any errors

## Security Considerations

- Keep your `CONTENTFUL_PREVIEW_SECRET` secure and don't expose it in client-side code
- The preview functionality is protected by this secret, so only users with the secret can access draft content
- Consider implementing additional authentication for production environments
