import React, { SVGProps } from "react";

/**
 * Logo component that renders an SVG logo
 * @param {SVGProps<SVGSVGElement>} props - SVG properties passed to the component
 * @returns {JSX.Element} An SVG element representing the logo
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 80"
      fill="currentColor"
      {...props}
    >
      <path d="M152.1,30.89h12.27v5.56c0,.21.17.37.37.37h6.71c.21,0,.37-.16.37-.37v-5.56h2.84c.21,0,.37-.16.37-.37v-4.73c0-.21-.16-.37-.37-.37h-2.84V8.37c0-.21-.16-.37-.37-.37h-9.1c-.21,0-.37.08-.45.25l-10.05,16.1c-.08.16-.12.29-.12.45v5.72c0,.21.16.37.37.37ZM164.54,14.01l-.17,5.76v5.64h-6.75l6.92-11.4Z" />
      <path d="M174.84,19.36c2.22-.66,3.99-1.73,5.48-3.13v9.47l-.04,10.75c0,.21.16.37.37.37h6.79c.21,0,.37-.16.37-.37l-.08-13.83.08-14.25c0-.21-.16-.37-.37-.37h-6.3c-.21,0-.33.08-.41.29-1.19,2.55-3.13,4.41-6.01,5.44-.21.04-.29.21-.29.41v4.9c0,.25.16.41.41.33Z" />
      <path d="M190.58,36.82h20.26c.21,0,.37-.16.37-.37v-4.78c0-.21-.16-.37-.37-.37h-13.22v-.41c0-4.82,13.46-4.41,13.46-14.74-.08-5.48-3.62-8.81-9.92-8.81-6.92.04-10.5,3.46-10.66,9.59,0,.25.16.37.37.37h6.09c.21,0,.37-.12.37-.37.16-2.59,1.48-3.99,3.54-4.03,2.14,0,3.38,1.24,3.29,3.38,0,5.89-13.96,4.24-13.96,16.35v3.83c0,.21.16.37.37.37Z" />
      <path d="M159.6,50.08c0-1.89,1.81-2.68,4.28-2.68,2.96,0,4.73,1.15,5.02,3.17.04.25.21.37.41.37h7.12c.25,0,.41-.17.37-.41-1.03-6.26-5.97-8.77-12.8-8.77-7.82,0-12.06,3.58-12.06,9.1,0,11.69,18.03,7.08,18.03,12.6,0,2.1-1.73,2.96-4.9,2.96-3.71,0-5.35-1.52-5.81-4.36-.04-.21-.16-.33-.37-.33h-7.16c-.25,0-.37.12-.33.37.66,6.55,5.68,9.92,13.55,9.92s12.8-3.46,12.8-9.63c0-11.49-18.16-7.12-18.16-12.31Z" />
      <path d="M192.53,50.08h-4.65l.04-4.94c0-.21-.16-.37-.37-.37h-6.67c-.21,0-.37.16-.37.37l.04,4.94h-2.39c-.21,0-.37.16-.37.37v4.41c0,.21.16.37.37.37h2.43l-.08,9.35c0,5.15,3.62,7.16,7.66,7.16,1.48,0,3.01-.37,4.41-.86.21-.08.29-.25.29-.45v-3.95c0-.25-.16-.41-.41-.33-.66.16-1.4.37-2.47.37s-2.06-.45-2.06-2.31l-.04-8.98h4.65c.21,0,.37-.16.37-.37v-4.41c0-.21-.16-.37-.37-.37Z" />
      <path d="M215.12,50.08h-6.83c-.21,0-.37.16-.37.37l.08,8.61v.66c0,4.94-2.06,6.67-3.99,6.67-1.52,0-2.59-1.11-2.59-3.01v-4.32l.12-8.61c0-.21-.16-.37-.37-.37h-6.79c-.21,0-.37.16-.37.37l.12,8.61v4.49c0,5.02,2.8,8.23,7.53,8.23,2.76,0,5.19-.99,6.71-3.09l-.12,2.22c0,.25.12.37.37.37h6.42c.21,0,.37-.16.37-.37l-.04-10.42.12-10.05c0-.21-.16-.37-.37-.37Z" />
      <path d="M239.39,42.84c0-.21-.16-.37-.37-.37h-6.67c-.21,0-.37.16-.37.37l.04,9.22c-1.4-1.56-3.34-2.39-5.76-2.39-5.85,0-9.55,4.94-9.55,11.08s3.21,10.95,9.22,10.95c2.68,0,4.78-1.03,6.26-2.8l-.12,2.02c0,.25.12.37.37.37h6.63c.21,0,.37-.16.37-.37l-.12-13.5.08-14.58ZM228.24,66.92c-2.51,0-3.99-2.02-3.99-6.34s1.44-6.13,4.08-6.09c2.59.04,3.95,2.06,3.91,6.3-.04,4.2-1.48,6.14-3.99,6.14Z" />
      <path d="M248.58,50.08h-6.75c-.21,0-.37.16-.37.37l.12,10.42-.12,10.05c0,.21.16.37.37.37h6.75c.21,0,.37-.16.37-.37l-.12-10.05.12-10.42c0-.21-.16-.37-.37-.37Z" />
      <path d="M241.79,42.47h6.79c.2,0,.37.17.37.37v5.23c0,.2-.17.37-.37.37h-6.79c-.2,0-.37-.17-.37-.37v-5.23c0-.2.17-.37.37-.37Z" />
      <path d="M261.51,49.51c-7.16,0-11.32,4.45-11.32,11.24s4.16,11.12,11.32,11.12,11.24-4.49,11.24-11.28-4.08-11.08-11.24-11.08ZM261.51,66.96c-2.55,0-3.79-1.69-3.79-6.18s1.15-6.34,3.75-6.42c2.47,0,3.71,1.89,3.71,6.38s-1.19,6.22-3.66,6.22Z" />
      <path d="M280.7,55.85c0-1.32.99-1.85,2.59-1.85,1.93,0,2.88.91,3.21,2.39.04.21.16.33.37.33h6.13c.25,0,.41-.12.37-.41-.62-4.41-4.45-6.75-10.21-6.75s-9.51,2.59-9.51,7.08c0,8.77,13.55,5.35,13.55,8.73,0,1.28-1.03,1.93-3.13,1.93-2.26,0-3.5-.82-3.71-2.68-.04-.25-.21-.37-.41-.37h-6.46c-.25,0-.37.12-.37.37.37,4.78,4.73,7.21,10.95,7.21s10.17-2.68,10.17-7.16c0-8.93-13.55-5.19-13.55-8.81Z" />
      <path d="M143.62,22.1c0-12.2-9.89-22.1-22.1-22.1-6.61,0-12.52,2.92-16.57,7.51-4.05-4.6-9.96-7.51-16.57-7.51s-12.52,2.92-16.57,7.51c-4.05-4.6-9.96-7.51-16.57-7.51s-12.52,2.92-16.57,7.51C34.62,2.92,28.7,0,22.1,0,9.89,0,0,9.89,0,22.1c0,6.61,2.92,12.52,7.51,16.57C2.92,42.72,0,48.63,0,55.24c0,12.2,9.89,22.1,22.1,22.1,6.61,0,12.52-2.92,16.57-7.51,4.05,4.6,9.96,7.51,16.57,7.51s12.52-2.92,16.57-7.51c4.05,4.6,9.96,7.51,16.57,7.51s12.52-2.92,16.57-7.51c4.05,4.6,9.96,7.51,16.57,7.51,12.2,0,22.1-9.89,22.1-22.1,0-6.61-2.92-12.52-7.51-16.57,4.6-4.05,7.51-9.96,7.51-16.57ZM55.24,11.05c6.1,0,11.05,4.95,11.05,11.05s-4.95,11.05-11.05,11.05-11.05-4.95-11.05-11.05,4.95-11.05,11.05-11.05ZM11.05,22.1c0-6.1,4.95-11.05,11.05-11.05s11.05,4.95,11.05,11.05-4.95,11.05-11.05,11.05-11.05-4.95-11.05-11.05ZM22.1,66.29c-6.1,0-11.05-4.95-11.05-11.05s4.95-11.05,11.05-11.05,11.05,4.95,11.05,11.05-4.95,11.05-11.05,11.05ZM55.24,66.29c-6.1,0-11.05-4.95-11.05-11.05s4.95-11.05,11.05-11.05,11.05,4.95,11.05,11.05-4.95,11.05-11.05,11.05ZM88.38,66.29c-6.1,0-11.05-4.95-11.05-11.05V22.1c0-6.1,4.95-11.05,11.05-11.05s11.05,4.95,11.05,11.05v33.14c0,6.1-4.95,11.05-11.05,11.05ZM132.57,55.24c0,6.1-4.95,11.05-11.05,11.05s-11.05-4.95-11.05-11.05,4.95-11.05,11.05-11.05,11.05,4.95,11.05,11.05ZM110.48,22.1c0-6.1,4.95-11.05,11.05-11.05s11.05,4.95,11.05,11.05-4.95,11.05-11.05,11.05-11.05-4.95-11.05-11.05Z" />
    </svg>
  );
}
