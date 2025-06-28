import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import { productApi } from "@/lib/api";
import { Package, TrendingUp, AlertTriangle, Users } from "lucide-react";

export default function Reports() {
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => productApi.getProducts(),
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/products/stats"],
    queryFn: () => productApi.getProductStats(),
  });

  // Prepare chart data
  const inventoryBySupplier = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.supplier === product.supplier);
    if (existing) {
      existing.quantity += product.quantity;
      existing.value += product.quantity * parseFloat(product.price);
    } else {
      acc.push({
        supplier: product.supplier,
        quantity: product.quantity,
        value: product.quantity * parseFloat(product.price)
      });
    }
    return acc;
  }, []);

  const topProducts = products
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      sales: product.sales,
      revenue: product.sales * parseFloat(product.price)
    }));

  const stockStatusData = [
    { name: 'In Stock', value: products.filter(p => p.quantity >= 10).length, color: '#10b981' },
    { name: 'Low Stock', value: products.filter(p => p.quantity > 0 && p.quantity < 10).length, color: '#f59e0b' },
    { name: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Insights and analytics for your inventory</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Sales</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalSales || "$0"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.lowStock || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Suppliers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.suppliers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <p>No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <p>No inventory data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory by Supplier */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryBySupplier.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryBySupplier}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'value' ? `$${typeof value === 'number' ? value.toFixed(2) : value}` : value,
                    name === 'value' ? 'Value' : 'Quantity'
                  ]} />
                  <Bar dataKey="quantity" fill="#10b981" name="quantity" />
                  <Bar dataKey="value" fill="#3b82f6" name="value" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <p>No supplier data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}