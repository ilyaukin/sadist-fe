import React from 'react';

const Footer = () => {
  return <div style={{ textAlign: 'center' }}>
    © 2020 ̶ {new Date().getFullYear()} Ilya Lyaukin |{' '}
    <a href="/tos">TOS</a> | <a href="/privacy-policy">Privacy Policy</a>
  </div>
}

export default Footer;
