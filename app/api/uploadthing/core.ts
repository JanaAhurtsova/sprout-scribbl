import { createUploadthing, type FileRouter } from 'uploadthing/next';
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
