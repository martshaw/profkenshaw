import React from 'react'
import Markdown from '../components/markdown'
import './footer.css'
export default (props) => (
  <footer className="footer">
    <Markdown markdownHtml={props.data} />
  </footer>
)
