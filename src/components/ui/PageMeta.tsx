import React from "react";
import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title?: string;
  description?: string;
}

export function PageMeta({ title, description }: PageMetaProps) {
  const fullTitle = title ? `${title} | MyGameList` : "MyGameList";
  const defaultDescription = "Keep track of your gaming progress and discover new titles.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
    </Helmet>
  );
}
