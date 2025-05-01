import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = (slugs) => {
  return (
    <header
      style={{
        background: `#030574`,
      }}
    >
      <nav
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0.625em 1.250em 5px`,
          borderBottom: `0.1em dashed #e1e1e1`,
        }}
      >
        {slugs &&
          slugs.slugs.map((el) => (
            <Link
              to={`${el.link}`}
              style={{
                color: `#fff`,
                textDecoration: `none`,
                textTransform: `capitalize`,
                marginRight: '10px',
              }}
              activeStyle={{
                color: '#006A95',
              }}
              key={el.link}
            >
              {` ${el.name} `}
            </Link>
          ))}
      </nav>
    </header>
  )
}

export default Header
