"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@prettyfull/ui";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

interface OrderCardProps {
  order: {
    id: string;
    displayId: string;
    createdAt: string | Date;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    currency: string;
    items: Array<{
      id: string;
      thumbnail: string;
      title: string;
      quantity: number;
    }>;
  };
}

const statusStyles = {
  pending: { label: "En attente", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  processing: { label: "En préparation", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  shipped: { label: "Expédié", color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  delivered: { label: "Livré", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "Annulé", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const status = statusStyles[order.status] || statusStyles.pending;
  
  const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="group bg-white border border-gray-200/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-300 transition-all duration-300">
      
      <div className="p-6 border-b border-gray-100/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-gray-900 text-md!">
              Commande <span className="font-mono text-gray-500 text-base">#{order.displayId}</span>
            </h4>
            
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`} />
              {status.label}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 font-medium">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            {date}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {order.total.toFixed(2)} <span className="text-lg font-medium text-gray-500">{order.currency}</span>
          </p>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-50/30">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {order.items.map((item) => (
            <div key={item.id} className="relative group/item">
              <div className="h-24 w-24 flex-shrink-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-transform duration-300 group-hover/item:-translate-y-1">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 px-6 flex items-center justify-between border-t border-gray-100">
        <Link 
            href={`/account/orders/${order.id}`}
            className="group/link flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors"
        >
          Détails de la commande
          <ArrowRightIcon className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
        </Link>

        <Button 
          className="rounded-full bg-black text-white shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 gap-2 px-6 py-5 h-auto text-sm font-medium tracking-wide"
        >
          Suivre le colis 
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};