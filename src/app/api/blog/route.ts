import { NextResponse } from "next/server";
import { fetchAllWixBlogs } from "@/lib/wixCms";

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const blogs = await fetchAllWixBlogs(limit);

    // Return post metadata without large html_content payload for fast list transfers
    const summaries = blogs.map((b) => ({
      ...b,
      html_content: "",
    }));

    return NextResponse.json(summaries, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch blogs from Wix CMS", details: err?.message },
      { status: 500 }
    );
  }
}
