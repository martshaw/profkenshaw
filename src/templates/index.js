import { graphql } from 'gatsby'
import * as PropTypes from 'prop-types'
import React from 'react'
import Markdown from '../components/markdown'
import Layout from '../layouts'
import { Helmet } from 'react-helmet'

const propTypes = {
  data: PropTypes.object.isRequired,
}

const PageTemplate = ({ data }) => {
  const {
    title,
    metaDescription,
    metaKeyWords,
    image,
    url,
    paragraph,
  } = data.contentfulPage
  return (
    <div>
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="keywords" content={metaKeyWords.metaKeyWords} />
        <meta name="description" content={metaDescription.metaDescription} />
        <meta name="publisher" content="Prof Ken Shaw and Martin Shaw" />
        <meta
          name="verify-v1"
          content="wqGqGbWZ+JNqoZMHatvNaT3hf2p/1kxGMefyYIWf5no="
        />
        <meta name="rating" content="General" />
        <meta name="expires" content="never" />
        <meta content="english" name="language" />
        <meta content="Global" name="distribution" />
        <meta content="index, follow" name="robots" />
        <meta name="revisit-after" content="31 days" />
        <link rel="canonical" href="https://www.profkenshaw.com/home" />
      </Helmet>
      <Layout imageSrc={image} slug={url}>
        <div style={{ marginBottom: '10px' }}>
          {paragraph && <Markdown markdownHtml={paragraph.paragraph} />}
        </div>
      </Layout>
    </div>
  )
}

PageTemplate.propTypes = propTypes

export default PageTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    contentfulPage(url: { eq: $slug }) {
      id
      node_locale
      title
      metaKeyWords {
        metaKeyWords
      }
      metaDescription {
        metaDescription
      }
      url
      paragraph {
        paragraph
      }
      image {
        description
        title
        file {
          fileName
          url
        }
        resize {
          src
        }
        fluid {
          src
          sizes
          base64
          srcSet
          srcWebp
          srcSetWebp
          aspectRatio
        }
      }
    }
  }
`
