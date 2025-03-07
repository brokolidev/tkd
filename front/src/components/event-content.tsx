'use client'

import {useEffect, useRef} from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'

interface EventContentProps {
  htmlContent: string
}

export default function EventContent({ htmlContent }: EventContentProps) {

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    const highlightCode = () => {
      if (contentRef.current) {
        Prism.highlightAllUnder(contentRef.current);
      }
    };

    const debouncedHighlightCode = debounce(highlightCode, 300);

    highlightCode();

    const observer = new MutationObserver(debouncedHighlightCode);

    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className="prose prose-zinc max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}