import { NextResponse } from "next/server";
import { fetchWixBlogBySlug, fetchRelatedWixBlogs } from "@/lib/wixCms";

export const revalidate = 300;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const isRelated = searchParams.get("related") === "true";

    if (isRelated) {
      const limit = parseInt(searchParams.get("limit") || "4", 10);
      const related = await fetchRelatedWixBlogs(slug, limit);
      return NextResponse.json(related);
    }

    const post = await fetchWixBlogBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { error: `Blog post '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch blog post", details: err?.message },
      { status: 500 }
    );
  }
}
