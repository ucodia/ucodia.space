import ExternalLink from "@/components/external-link";
import { CDN_URL } from "@/utils/cdn";

const CdnLink = ({ src, children }) => {
  const fullSrc = `${CDN_URL}/img${src}`;

  return <ExternalLink href={fullSrc}>{children}</ExternalLink>;
};

export default CdnLink;
