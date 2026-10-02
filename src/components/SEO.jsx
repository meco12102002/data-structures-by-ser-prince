import { Helmet } from "react-helmet-async";

const SITE_URL = "https://data-structures-by-ser-prince.vercel.app";
const SITE_NAME = "Data Structures with Ser Prince";
const DEFAULT_TITLE =
  "Data Structures with Ser Prince | Interactive DSA Lessons";
const DEFAULT_DESCRIPTION =
  "Learn data structures and algorithms through interactive visualizations, step-by-step lessons, and hands-on practice activities.";
const DEFAULT_KEYWORDS = [
  "data structures",
  "algorithms",
  "DSA",
  "interactive learning",
  "binary trees",
  "heaps",
  "priority queues",
  "computer science",
];
const DEFAULT_IMAGE = "/favicon.svg";

function buildAbsoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd,
}) {
  const canonicalUrl = buildAbsoluteUrl(path);
  const imageUrl = buildAbsoluteUrl(image);
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en",
    },
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
  ];

  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords.join(", ")}
      />
      <meta
        name="robots"
        content={robots}
      />
      <meta
        name="author"
        content="Ser Prince"
      />
      <meta
        name="theme-color"
        content="#10140f"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />
      <meta
        property="og:image"
        content={imageUrl}
      />
      <meta
        property="og:image:alt"
        content={title}
      />
      <meta
        property="og:locale"
        content="en_US"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={imageUrl}
      />

      {structuredData.map((data, index) => (
        <script
          key={`${data["@type"]}-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEO;
