import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
    return (
        <Helmet>
            {/* Title : Optimisé (Max 60 chars) */}
            <title>{`${title} | SportRadar`}</title>

            {/* Meta Description : Optimisée (Max 155-160 chars) */}
            <meta name="description" content={description} />

            {/* Mots-clés (optionnel mais utile) */}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph (Pour le partage sur les réseaux sociaux) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};

export default SEO;
