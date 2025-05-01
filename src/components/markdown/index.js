/* eslint react/no-danger: 0 */
import marked from 'marked'
import PropTypes from 'prop-types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import htmlParser from 'react-markdown/plugins/html-parser'
import HtmlToReact from 'html-to-react'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
})
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React)
const parseHtml = htmlParser({
  isValidNode: (node) => node.type !== 'script',
  processingInstructions: [
    {
      // Custom <h1> processing
      shouldProcessNode: function(node) {
        return node.parent && node.parent.name && node.parent.name === 'h1'
      },
      processNode: function(node, children) {
        return node.data.toUpperCase()
      },
    },
    {
      // Anything else
      shouldProcessNode: function(node) {
        return true
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ],
})

class Markdown extends React.Component {
  static propTypes = {
    markdownHtml: PropTypes.string,
    className: PropTypes.string,
    styles: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    styles: null,
    markdownHtml: null,
  }
  handleInternalLink(evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      const href = evt.target.getAttribute('href')
      const pdfLink = href.match(/pdf/)
      // need to check if its an internal link and not from an error page
      if (pdfLink) {
        evt.preventDefault()
        // TODO: Test if this is blocked by pop up blockers:
        const win = window.open(href, '_blank')
        if (win) win.focus()
      }
    }
  }
  render() {
    return (
      <div onClick={this.handleInternalLink}>
        <ReactMarkdown
          source={this.props.markdownHtml}
          escapeHtml={false}
          astPlugins={[parseHtml]}
        />
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    state,
  }
}
export default Markdown
