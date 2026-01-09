"use client";

import { useEffect, useState } from "react";

interface Review {
    name: string;
    comment: string;
}

export default function TestimonialsSlider({ reviews }: { reviews: Review[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Advance every 20 seconds (20000 ms)
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % reviews.length);
        }, 20000);

        return () => clearInterval(id);
    }, [reviews.length]);

    if (!reviews || reviews.length === 0) return null;

    const review = reviews[index];

    return (
        <div className="block md:hidden max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#f0dde4] transition-all">
                <div className="flex gap-1 mb-4 text-[#d4a36f] text-lg">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 21s-6.716-4.44-9.567-9.01C.65 9.788.948 6.706 3.05 4.844c1.884-1.667 4.72-1.328 6.313.51L12 7.8l2.637-2.446c1.593-1.838 4.429-2.177 6.313-.51 2.102 1.862 2.4 4.944.617 7.146C18.716 16.56 12 21 12 21z" />
                        </svg>
                    ))}
                </div>

                <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-4">{review.comment}</p>
                <p className="font-montserrat font-semibold text-[#2c1e21] text-sm">{review.name}</p>
            </div>
        </div>
    );
}
