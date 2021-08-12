import { useRouter } from "next/dist/client/router";
import React from "react";
import { StatusPage } from "../../components/StatusPage";

export default function Status() {
  const router = useRouter()
  const path: string = router.query.path as string;
  
  return <StatusPage url={path} />;
}