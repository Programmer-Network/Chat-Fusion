import { SVGProps } from "react";

export function EnableFilterIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M11 20q-.425 0-.713-.288T10 19v-6L4.2 5.6q-.375-.5-.113-1.05T5 4h14q.65 0 .913.55T19.8 5.6L14 13v6q0 .425-.288.713T13 20h-2Zm1-7.7L16.95 6h-9.9L12 12.3Zm0 0Z"
            ></path>
        </svg>
    );
}
