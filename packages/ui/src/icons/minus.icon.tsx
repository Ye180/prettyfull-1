import React, { SVGProps } from "react";

export const MinusIcon = ({ color = "currentColor", ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}

  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

