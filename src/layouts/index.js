/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import { graphql, StaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import Image from '../components/image'
import './layout.css'

const Layout = ({ imageSrc, slug, children }) => (
  <StaticQuery
    query={graphql`
      query {
        contentfulFooter(
          footerContent: {
            footerContent: {}
            parent: {}
            internal: { content: {} }
          }
        ) {
          id
          contentfulTitle
          footerContent {
            footerContent
          }
        }
        allContentfulPage {
          edges {
            node {
              url
            }
          }
        }
        site {
          siteMetadata {
            menuLinks {
              name
              link
            }
          }
        }
      }
    `}
    render={(data) => {
      return (
        <div className="container">
          <Header slugs={data.site.siteMetadata.menuLinks} />
          <Image src={imageSrc} />
          <div className="inner">
            <main>{children}</main>
            <Footer data={data.contentfulFooter.footerContent.footerContent} />
          </div>
        </div>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
