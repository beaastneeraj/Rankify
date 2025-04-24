import { createUploadthing, createRouteHandler } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  reportUploader: f(['pdf'], {
    maxFileSize: "1MB",
    maxFileCount: 1,
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete!");

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { url: file.ufsUrl };
    }),
};

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
