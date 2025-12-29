"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import NotificationBanner from "./NotificationBanner";

/**
 * PageLayout Component
 * 
 * Renders Header and NotificationBanner globally on all pages
 * Hides Header on admin routes
 */
export default function PageLayout() {
  const pathname = usePathname();
  
  // Hide header on admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <NotificationBanner />
    </>
  );
}
