'use client'

import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'

interface EventContentProps {
  htmlContent: string
}

export default function EventContent({ htmlContent }: EventContentProps) {
  
  useEffect(() => {
    Prism.highlightAll();
  }, [htmlContent]);
    
  return (
    <div
      className="prose prose-zinc max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}