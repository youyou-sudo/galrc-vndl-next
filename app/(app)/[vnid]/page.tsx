import React from "react";

import { getVnDetails } from "@/lib/repositories/vnRepository";
import { ContentCard } from "@/components/vnid-page/ContentCard";
import { TapCatd } from "@/components/vnid-page/tapCard";

export const revalidate = 60;

export default async function idPage({ params }: { params: { vnid: string } }) {
  const { vnid } = await params;
  if (vnid.startsWith("v")) {
    const data = await getVnDetails(vnid);
    return (
      <div className="space-y-3">
        <ContentCard data={data} />
        <TapCatd id={vnid} />
      </div>
    );
  }

  return <div>{vnid}</div>;
}
