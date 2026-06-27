import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
    useEffect(() => {
        // Set document title
        const baseTitle = 'Infralab - Master System Design Interviews';
        document.title = title ? `${title} | Infralab` : baseTitle;

        // Helper to update or create meta tags
        const updateMetaTag = (name: string, content: string, isProperty = false) => {
            const attributeName = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attributeName}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attributeName, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        if (description) {
            updateMetaTag('description', description);
            updateMetaTag('og:description', description, true);
            updateMetaTag('twitter:description', description, true);
        }

        if (title) {
            updateMetaTag('og:title', `${title} | Infralab`, true);
            updateMetaTag('twitter:title', `${title} | Infralab`, true);
        }

        if (keywords) {
            updateMetaTag('keywords', keywords);
        }
    }, [title, description, keywords]);

    return null;
};
