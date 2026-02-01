import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
    const siteTitle = `${title} - SportRadar`;

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
        </Helmet>
    );
};

export default SEO;
