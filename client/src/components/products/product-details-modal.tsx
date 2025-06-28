import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onEdit,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (quantity < 10) {
      return { label: "Low Stock", variant: "secondary" as const };
    } else {
      return { label: "In Stock", variant: "default" as const };
    }
  };

  const stockStatus = getStockStatus(product.quantity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle>Product Details</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Product Name</Label>
              <p className="mt-1 text-sm text-slate-900">{product.name}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Description</Label>
              <p className="mt-1 text-sm text-slate-900">{product.description}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Supplier</Label>
              <p className="mt-1 text-sm text-slate-900">{product.supplier}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Price</Label>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Quantity in Stock</Label>
              <p className="mt-1 text-sm text-slate-900">{product.quantity} units</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Total Sales</Label>
              <p className="mt-1 text-sm text-slate-900">{product.sales} units sold</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Status</Label>
              <div className="mt-1">
                <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onEdit(product);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
