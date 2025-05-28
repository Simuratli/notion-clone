"use client";
import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavbarTypes {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarTypes) => {

    const params = useParams();
    const documents = useQuery(api.documents.getById, {documentId: params.documentId as Id<"documents">})

    if(documents === undefined){
        return <nav className="bg-background justify-between  dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
            <Title.Skeleton/>
            <div className="flex items-center gap-x-2">
                <Menu.Skeleton/>
            </div>
        </nav>
    }

    if(documents === null){
        return null
    }


  return <>
  <nav className="bg-background  dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
    {isCollapsed && (
        <MenuIcon onClick={onResetWidth} role="button" className="h-6 w-6 cursor-pointer"/>
    )}
    <div className="flex items-center justify-between w-full">
        <Title initialData={documents} />
        <div className="flex items-center gap-x-2">
            <Publish initialData={documents}/>
            <Menu documentId={documents._id} />
        </div>
    </div>
  </nav>
  {
    documents.isArchieved && (
        <Banner documentId={documents._id}/>
    )
  }
  </>;
};

export default Navbar;
