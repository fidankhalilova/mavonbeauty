import BlogMain from "@/Sections/Blog/BlogMain";
import OtherBlogs from "@/Sections/Blog/OtherBlogs";
import SubsBlog from "@/Sections/Blog/SubsBlog";

export default function BlogTemplate() {
  return (
    <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <BlogMain />
      <OtherBlogs />
      <SubsBlog />
    </div>
  );
}
