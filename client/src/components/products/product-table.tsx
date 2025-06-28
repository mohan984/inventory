import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Eye, Edit, Trash2, ArrowUpDown, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { productApi } from "@/lib/api";
import type { Product } from "@shared/schema";

interface ProductTableProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export default function ProductTable({
  onAddProduct,
  onEditProduct,
  onViewProduct,
  onDeleteProduct,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products", search, sortBy, sortOrder],
    queryFn: () => productApi.getProducts(search || undefined, sortBy || undefined, sortOrder),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (quantity < 10) {
      return { label: "Low Stock", variant: "secondary" as const };
    } else {
      return { label: "In Stock", variant: "default" as const };
    }
  };

  if (error) {
    return (
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load products. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product Management</h2>
            <p className="text-sm text-slate-600 mt-1">Manage your inventory products</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <Button onClick={onAddProduct} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('supplier')}
              >
                <div className="flex items-center">
                  Supplier
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center">
                  Quantity
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('sales')}
              >
                <div className="flex items-center">
                  Sales
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-md bg-slate-200 animate-pulse" />
                      </div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-12" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-12" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-slate-200 rounded-full animate-pulse w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Package className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
                    <p className="text-slate-500 mb-4">
                      {search ? "Try adjusting your search terms" : "Get started by adding your first product"}
                    </p>
                    {!search && (
                      <Button onClick={onAddProduct} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-md bg-slate-200 flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {product.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProduct(product)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                          className="text-slate-600 hover:text-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProduct(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
