// Blog posts with their real, credited photos merged in (see lib/blog-images.js and
// docs/blog-photo-credits.md). Pages read posts from here instead of lib/data.js so that
// post.image / imageAlt / imageCredit / imageSource are filled when a photo exists.
import { BLOG_POSTS as RAW_BLOG_POSTS } from "./data";
import { BLOG_IMAGES } from "./blog-images";

export const BLOG_POSTS = RAW_BLOG_POSTS.map((p) => {
  const im = BLOG_IMAGES[p.slug];
  if (!im) return p;
  return { ...p, image: im.image, imageAlt: im.alt, imageCredit: im.credit, imageSource: im.source };
});
