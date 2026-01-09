"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function AdminBookingAlert() {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const mounted = useRef(true);
    const router = useRouter();

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/bookings?status=pending`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            const bookings = data.bookings || [];
            if (mounted.current) setCount(bookings.length);
        } catch (e) {
            console.error("Error fetching pending bookings:", e);
        } finally {
            if (mounted.current) setLoading(false);
        }
    };

    useEffect(() => {
        mounted.current = true;
        // initial fetch
        fetchPending();
        // poll every minute
        const id = setInterval(fetchPending, 60 * 1000);
        // also listen for immediate updates via BroadcastChannel or window event
        const onMsg = (e: any) => {
            fetchPending();
        };

        let bc: BroadcastChannel | null = null;
        try {
            if (typeof window !== "undefined" && "BroadcastChannel" in window) {
                bc = new BroadcastChannel("bookings");
                bc.addEventListener("message", onMsg as EventListener);
            }
        } catch (err) {
            // ignore
        }
        window.addEventListener("bookings-updated", onMsg as EventListener);

        return () => {
            mounted.current = false;
            clearInterval(id);
            if (bc) {
                try { bc.close(); } catch (e) { }
            }
            window.removeEventListener("bookings-updated", onMsg as EventListener);
        };
    }, []);

    if (count === 0) return null;

    return (
        <div className="mb-4">
            <div
                role="status"
                className="flex items-center justify-between bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 px-4 py-3 rounded shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                        <Bell className="text-yellow-700" size={18} />
                    </div>
                    <div>
                        <p className="font-semibold">
                            {`Tienes ${count} reservaci${count === 1 ? "ón" : "ones"} pendiente${count === 1 ? "" : "s"}`}
                        </p>
                        <p className="text-sm text-yellow-800">Revisa y confirma las reservas pendientes.</p>
                    </div>
                </div>
                <div>
                    <button
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                        onClick={() => router.push("/admin/reservas")}
                    >
                        Ver
                    </button>
                </div>
            </div>
        </div>
    );
}
