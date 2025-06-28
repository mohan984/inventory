import { useState } from "react";
import Header from "@/components/layout/header";
import ProductTable from "@/components/products/product-table";
import ProductFormModal from "@/components/products/product-form-modal";
import ProductDetailsModal from "@/components/products/product-details-modal";
import DeleteConfirmationModal from "@/components/products/delete-confirmation-modal";
import type { Product } from "@shared/schema";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
    setEditingProduct(null);
    setDeletingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage all your inventory products</p>
        </div>
        
        <ProductTable
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onViewProduct={handleViewProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        product={editingProduct}
      />

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        product={selectedProduct}
        onEdit={handleEditProduct}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        product={deletingProduct}
      />
    </div>
  );
}