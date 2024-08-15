import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CDN_URL } from "@/utils/cdn";

const CdnImageModal = ({ src, alt = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullSrc = `${CDN_URL}/img${src}`;

  return (
    <>
      {/* Mobile: Regular image */}
      <img src={fullSrc} alt={alt} className="w-full h-auto md:hidden" />

      {/* Desktop: Modal functionality */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <img
            src={fullSrc}
            alt={alt}
            className="hidden md:block cursor-pointer hover:opacity-90 transition-opacity"
          />
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-none bg-transparent">
          <img
            src={fullSrc}
            alt={alt}
            className="w-full h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CdnImageModal;
