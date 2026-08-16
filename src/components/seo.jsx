/**
 * Per-page metadata.
 *
 * React 19 hoists <title>, <meta> and <link> to <head> from anywhere in the
 * tree, so this needs no helmet library. Values here override the sitewide
 * defaults in index.html.
 */
const SITE_NAME = "Yanki";
const SITE_URL = "https://yanki.com";

export default function Seo({
  title,
  description,
  path = "",
  image = `${SITE_URL}/og-image.png`,
  noIndex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escaping "<" stops a description containing "</script>" from
            // closing the tag early.
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
