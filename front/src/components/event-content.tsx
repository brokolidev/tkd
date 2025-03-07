'use client'

interface EventContentProps {
  htmlContent: string
}

export default function EventContent({ htmlContent }: EventContentProps) {
  return (
    <div
      className="prose prose-zinc max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}