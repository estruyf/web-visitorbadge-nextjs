import { useRouter } from "next/dist/client/router";
import React from "react";
import { StatusPage } from "../../components/StatusPage";

export default function Status() {
  const router = useRouter()
  const slug: string[] = router.query.slug as string[] || [];

  const user = slug.length > 0 ? slug[0] : "";
  const repo = slug.length > 1 ? slug[1] : "";

  if (user && repo) {
    return <StatusPage user={user} repo={repo} />;
  }

  return null;
}