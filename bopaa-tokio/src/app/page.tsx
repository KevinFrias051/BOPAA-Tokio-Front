"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    router.push("/home");
  }, []);

  return null; 
}
