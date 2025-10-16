import React from 'react';
import './SocialLinks.css';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  title: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="social-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.title}
          className={`social-link ${link.name.toLowerCase()}`}
        >
          <i className={link.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
