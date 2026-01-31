"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

type GoogleAdProps = {
    slot: string; // Ad Unit ID
    client?: string; // Publisher ID (defaults to global if not set, but good to be explicit)
    format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
};

export default function GoogleAd({
    slot,
    client = "ca-pub-2810872681064029", // Updated with User's ID
    format = "auto",
    responsive = true,
    style,
    className
}: GoogleAdProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // Push the ad to the queue
            // We check if the ad has already been populated to avoid duplicate push errors in some cases,
            // though adsbygoogle usually handles this.
            if (adRef.current && adRef.current.innerHTML === "") {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`overflow-hidden ${className || ""}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block", ...style }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
}
