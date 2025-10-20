export function ImageCardDownload({ image }) {
  const baseURL = "http://localhost:3000"; // 🔥 ton serveur Node
  const src = image.url.startsWith("http")
    ? image.url
    : `${baseURL}${image.url}`;

  return (
    <div className="card-item">
      <img className="img" src={src} alt={`${image.filename || 'server-image'}-large-img`} />
    </div>
  );
}
