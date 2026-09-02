import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const commitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    '';

  return NextResponse.json(
    {
      commitSha,
      shortSha: commitSha ? commitSha.slice(0, 7) : '',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
