"use client";
import ConfirmModal from "@/components/modals/confirmmodal";
import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { SearchIcon, Trash, Undo } from "lucide-react";
import {  useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
  const router = useRouter();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId }).then(() => {
      router.push("/documents");
    });
    toast.promise(promise, {
      loading: "Removing note...",
      success: "Note removed!",
      error: "Failed to remove !",
    });
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1  p-2">
        <SearchIcon className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="h-7 p px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title.."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => {
          return (
            <div
              key={document._id}
              role="button"
              onClick={() => {
                onClick(document._id);
              }}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate pl-2">{document.title}</span>
              <div className="flex items-center">
                <div
                  onClick={(e) => {
                    onRestore(e, document._id);
                  }}
                  role="button"
                  className="cursor-pointer rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal
                  onConfirm={() => {
                    onRemove(document._id);
                    router.replace("/documents");
                  }}
                >
                  <div className="cursor-pointer rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrashBox;
