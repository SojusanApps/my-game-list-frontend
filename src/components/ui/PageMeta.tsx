import React from "react";
import { MetaTags } from "@dr.pogodin/react-helmet";

interface PageMetaProps {
  title?: string;
  description?: string;
}

export function PageMeta({ title, description }: Readonly<PageMetaProps>) {
  const fullTitle = title ? `${title} | MyGameList` : "MyGameList";
  const defaultDescription = "Keep track of your gaming progress and discover new titles.";

  return <MetaTags title={fullTitle} description={description || defaultDescription} />;
}
