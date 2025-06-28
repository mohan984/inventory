import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProductSchema, updateProductSchema, type Product, type InsertProduct, type UpdateProduct } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { productApi } from "@/lib/api";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const form = useForm<InsertProduct>({
    resolver: zodResolver(isEditing ? updateProductSchema : insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      supplier: "",
      sales: 0,
      price: "0",
      quantity: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/stats"] });
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProduct }) =>
      productApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/stats"] });
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name,
        description: product.description,
        supplier: product.supplier,
        sales: product.sales,
        price: product.price,
        quantity: product.quantity,
      });
    } else if (!isOpen) {
      form.reset();
    }
  }, [product, isOpen, form]);

  const onSubmit = (data: InsertProduct) => {
    if (isEditing && product) {
      updateMutation.mutate({ id: product.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter product name"
              className="mt-1"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter product description"
              rows={3}
              className="mt-1"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              {...form.register("supplier")}
              placeholder="Enter supplier name"
              className="mt-1"
            />
            {form.formState.errors.supplier && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.supplier.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...form.register("price")}
                placeholder="0.00"
                className="mt-1"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                {...form.register("quantity", { valueAsNumber: true })}
                placeholder="0"
                className="mt-1"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="sales">Sales</Label>
            <Input
              id="sales"
              type="number"
              min="0"
              {...form.register("sales", { valueAsNumber: true })}
              placeholder="0"
              className="mt-1"
            />
            {form.formState.errors.sales && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.sales.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
