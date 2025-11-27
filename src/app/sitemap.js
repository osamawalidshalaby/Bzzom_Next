export default function sitemap() {
  const baseUrl = "https://bazzom.shop";

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/menu`, lastModified: new Date() },
    { url: `${baseUrl}/reviews`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
  ];
}
