/**
 * ViewModel pour l'écran Menu (Architecture MVVM)
 * Gère la logique métier: chargement produits, filtres par catégorie
 */
import { getCategories, getProducts } from '@/services/menuService';
import { Category, Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface MenuViewModelState {
  categories: Category[];
  products: Product[];
  filteredProducts: Product[];
  selectedCategoryId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface MenuViewModelActions {
  loadData: () => Promise<void>;
  selectCategory: (categoryId: string | null) => void;
  refreshData: () => Promise<void>;
}

type MenuViewModel = MenuViewModelState & MenuViewModelActions;

/**
 * Hook ViewModel pour l'écran Menu
 */
export function useMenuViewModel(): MenuViewModel {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Produits filtrés par catégorie
  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  /**
   * Charge les catégories et produits
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);

      // Sélectionne la première catégorie par défaut
      if (categoriesData.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesData[0].id);
      }
    } catch (err) {
      setError('Erreur lors du chargement du menu');
      console.error('MenuViewModel loadData error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  /**
   * Sélectionne une catégorie
   */
  const selectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  }, []);

  /**
   * Rafraîchit les données
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Charge les données au montage
  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    products,
    filteredProducts,
    selectedCategoryId,
    isLoading,
    error,
    loadData,
    selectCategory,
    refreshData,
  };
}
