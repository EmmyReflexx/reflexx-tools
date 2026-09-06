"use client"

import { useEffect, useState } from "react"
import { TOOLS } from '../utils/tools'

type detailsProps = {
  title: string,
  description: string
};

export function PageHeading({ id }: { id: string }) {
  const [details, setDetails] = useState<detailsProps | null>(null);

  function findDetails() {
    if (!id) return;
    TOOLS.map((tool) => {
      if (tool.id === id) {
        setDetails({
          title: tool.name,
          description: tool.description,
        })
      }
    })
  };

  useEffect(() => {
    findDetails();
  }, [])

  return (
    <div className="space-y-1.5 sm:space-y-2 border-b border-brand-border pb-4 sm:pb-6 text-center">
      <h1 className="font-lexend-eb text-2xl sm:text-4xl text-brand-dark">
        {details?.title}
      </h1>
      <p className="font-lexend-r text-brand-muted text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
        {details?.description}
      </p>
    </div>
  )
}