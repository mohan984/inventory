import { useQuery } from "@tanstack/react-query";
import { Package, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { productApi } from "@/lib/api";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/products/stats"],
    queryFn: () => productApi.getProductStats(),
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="ml-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                    <div className="h-6 bg-slate-200 rounded animate-pulse w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsData = [
    {
      icon: Package,
      label: "Total Products",
      value: stats?.totalProducts || 0,
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Total Sales",
      value: stats?.totalSales || "$0",
      color: "text-emerald-600",
    },
    {
      icon: AlertTriangle,
      label: "Low Stock",
      value: stats?.lowStock || 0,
      color: "text-amber-600",
    },
    {
      icon: Users,
      label: "Suppliers",
      value: stats?.suppliers || 0,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.label} className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
