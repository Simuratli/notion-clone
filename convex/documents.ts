import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { useMutation } from "convex/react";

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.get(args.id);
    if (!document) throw new Error("Document not found");
    if (document.userId !== userId) throw new Error("Not authorized");

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchieved: true,
        });

        await recursiveArchive(child._id);
      }
    };
    const updatedDocument = await ctx.db.patch(args.id, {
      isArchieved: true,
    });

    recursiveArchive(args.id);

    return updatedDocument;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchieved"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const documents = await ctx.db.query("documents").collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId: userId,
      isArchieved: false,
      isPublished: false,
    });

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchieved"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) throw new Error("Document not found");

    if (existingDocuments.userId !== userId) throw new Error("Not authorized");

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchieved: false,
        });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchieved: false,
    };

    if (existingDocuments.parentDocument) {
      const parent = await ctx.db.get(existingDocuments.parentDocument);
      if (parent?.isArchieved) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);
    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) throw new Error("Document not found");

    if (existingDocuments.userId !== userId) throw new Error("Not authorized");

    return ctx.db.delete(args.id);
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchieved"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document not found!");
    }

    if (document.isPublished && !document.isArchieved) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Not Authorized");
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthroized");
    }

    const document = await ctx.db.patch(id, {
      ...rest,
    });

    return document;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;


    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument){
      throw new Error("Not found")
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthroized");
    }

    const document = await ctx.db.patch(args.id,{
      icon:undefined
    })

    return document

  },
});


export const removeCoverImage = mutation({
   args: { id: v.id("documents") },
    handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;


    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument){
      throw new Error("Not found")
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthroized");
    }

    const document = await ctx.db.patch(args.id,{
      coverImage:undefined
    })

    return document

  },
})
