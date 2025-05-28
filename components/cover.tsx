"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImage {
  url?: string;
  preview?: boolean;
}

const Cover = ({ preview, url }: CoverImage) => {
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const params = useParams();
  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Coverr" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 items-center flex gap-x-2">
          <Button
            size={"sm"}
            className="text-muted-foreground text-xs"
            onClick={() => {
              coverImage.onReplace(url);
            }}
          >
            Change cover <ImageIcon className="h-4 w-4 mr-2" />
          </Button>
          <Button
            size={"sm"}
            className="text-muted-foreground text-xs"
            onClick={onRemove}
          >
            Remove <X className="h-4 w-4 mr-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;

Cover.Skeleton = function CoverSkeleton(){
  return (
    <Skeleton className="w-full h-[12vh]"/>
  );
}