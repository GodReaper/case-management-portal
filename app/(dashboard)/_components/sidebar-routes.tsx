"use client";
import {Layout, Compass, List, BarChart} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import {usePathname} from 'next/navigation';
const guestRoutes =[
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    },
];

const lawyerRoutes = [
    {
        icon: List,
        label: "Cases",
        href: "/lawyer/cases",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/lawyer/analytics",
    },
]; 


export const SidebarRoutes = () => {
    const pathname = usePathname();
    const islawyerPage = pathname?.includes('/lawyer');
    const routes = islawyerPage ? lawyerRoutes : guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                />
            ))}
        </div>
    )
}