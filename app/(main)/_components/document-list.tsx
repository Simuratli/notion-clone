"use client"

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Item from './Item';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?:Doc<"documents">
}

function DocumentList({level=0,parentDocumentId}:DocumentListProps) {
    const params = useParams()
    const router = useRouter()
    const [expanded, setExpanded] = useState<Record<string,boolean>>({});

    const onExpand = (documentId:string) => {
        setExpanded((prev)=>({
            ...prev,
            [documentId]: !prev[documentId]
        }))
    }

    const documents = useQuery(api.documents.getSidebar,{parentDocument:parentDocumentId})


    const onRedirect = (documentId:string) => {
        router.push(`/documents/${documentId}`) 
    }


    if(documents === undefined){
        return <>
            <Item.Skeleton level={level}/>
            {
                level === 0 && (
                    <>
                     <Item.Skeleton level={level}/>
                     <Item.Skeleton level={level}/>
                    </>
                )
            }
        </>
    }

  return (
    <>
      <p className={cn(`hidden text-sm font-medium text-muted-foreground/80`,
      expanded && "last:block",
      level === 0 && 'hidden')} style={{paddingLeft:level ? `${(level * 12) + 25}px` : undefined}}>
        No pages available
      </p>
      {documents.map(document => (
        <div key={document._id}>
          <Item id={document._id} onClick={() => onRedirect(document._id)}
          label={document.title}
          icon={FileIcon}
          documentIcon={document.icon}
          active={params.documentId === document._id}
          level={level}
          onExpand={() => onExpand(document._id)}
          expanded={expanded[document._id]}/>
          {expanded[document._id] && (
            <DocumentList
            parentDocumentId={document._id}
            level={level + 1}/>
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList
