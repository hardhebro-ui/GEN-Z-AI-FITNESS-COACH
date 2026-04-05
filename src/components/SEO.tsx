import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Fitin60ai.in | Free AI Workout & Diet Plan Generator",
  description = "Get your personalized AI workout and diet plan in 60 seconds. Free PDF download. Optimized for your body type, goals, and equipment. No signup required.",
  canonical = "https://fitin60ai.in",
  ogImage = "https://fitin60ai.in/og-image.png",
  ogType = "website",
  keywords = "AI workout plan generator, free diet plan PDF, personalized fitness plan online, workout plan for beginners at home, AI fitness coach, custom meal plan",
  schema
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
