"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import SingleImage from "../single-image-dropzone";
import { useParams } from "next/navigation";


const CoverImageModal = () => {
  const coverImage = useCoverImage();
  

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <div>
          <SingleImage/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
