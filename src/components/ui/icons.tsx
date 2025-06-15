import { SVGProps } from "react";

export function Esewa(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00AEEF" />
      <path d="M2 17l10 5 10-5" fill="#00AEEF" />
      <path d="M2 12l10 5 10-5" fill="#00AEEF" />
      <text x="12" y="20" textAnchor="middle" fontSize="4" fill="white">
        eSewa
      </text>
    </svg>
  );
}

export function Khalti(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="#5C2D91" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" fill="white" />
      <line x1="9" y1="9" x2="9.01" y2="9" stroke="white" />
      <line x1="15" y1="9" x2="15.01" y2="9" stroke="white" />
      <text x="12" y="20" textAnchor="middle" fontSize="4" fill="white">
        Khalti
      </text>
    </svg>
  );
}

export function ConnectIPS(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00529B" />
      <path d="M2 17l10 5 10-5" fill="#00529B" />
      <path d="M2 12l10 5 10-5" fill="#00529B" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="#00529B" />
      <text x="12" y="20" textAnchor="middle" fontSize="4" fill="white">
        ConnectIPS
      </text>
    </svg>
  );
}
