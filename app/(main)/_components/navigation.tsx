"use client";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./Item";
import { toast } from "sonner";
import DocumentList from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import Navbar from "./navbar";

const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const settings = useSettings()
  const router = useRouter()
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const params = useParams()
  const create = useMutation(api.documents.create);
  const onOpen = useSearch((state)=>state.onOpen)
  const handleClickCreate = async () => {
    const promise = create({ title: "New Document" }).then((documentId)=>{
      router.push(`/documents/${documentId}`);
    });
    toast.promise(promise, {
      loading: "Creating document...",
      success: "Document created successfully!",
      error: `Error creating document`,
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

const resetWidth = React.useCallback(() => {
  if (sidebarRef.current && navbarRef.current) {
    setIsCollapsed(false);
    setIsResetting(true);
    sidebarRef.current.style.width = isMobile ? "100%" : "240px";
    navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    navbarRef.current.style.setProperty(
      "width",
      isMobile ? "0" : `calc(100% - 240px)`
    );

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  }
}, [isMobile]);

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true);
      setIsCollapsed(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("left", "0");
      navbarRef.current.style.setProperty("width", "100%");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [resetWidth,isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground grid place-content-center rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 transition cursor-pointer group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={onOpen} />

          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />

          <Item
            onClick={handleClickCreate}
            label="New page"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4">
          <DocumentList  />
          <Item
            onClick={handleClickCreate}
            icon={Plus}
            label="Add a page"
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash}  />
            </PopoverTrigger>
            <PopoverContent side={isMobile ? "top" : "right"} className="p-0 w-72">
              <TrashBox/>
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[9999] left-60 w-[calc(100% - 240px",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-full left-0"
        )}
      >

        {
          !!params.documentId ? <Navbar 
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />:

          <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 cursor-pointer w-6 text-muted-foreground"
            />
          )}
        </nav>
        }
        
      </div>
    </>
  );
};

export default Navigation;

