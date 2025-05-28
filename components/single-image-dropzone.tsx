import React from "react";
import { UploaderProvider, UploadFn } from "./upload/uploader-provider";
import { SingleImageDropzone } from "./upload/single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { Id } from "@/convex/_generated/dataModel";
import { DropzoneOptions } from "react-dropzone";

import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useCoverImage } from "@/hooks/use-cover-image";

const SingleImage = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore?.publicFiles?.upload({
        file,
        signal,
        onProgressChange,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });
      const promise = update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      toast.promise(promise, {
        loading: "Uploading...",
        success: "Cover image uploaded",
        error: "Something went wrong!",
      });
      // you can run some server action or api here
      // to add the necessary data to your database
      return res;
    },
    [edgestore]
  );

  return (
    <UploaderProvider uploadFn={uploadFn} autoUpload>
      <SingleImageDropzone
        height={200}
        width={200}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1, // 1 MB
        }}
      />
    </UploaderProvider>
  );
};

export default SingleImage;
