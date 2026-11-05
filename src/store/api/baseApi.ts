import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { products, getStoredProducts, saveStoredProducts } from '../../data/products';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { Order } from '../../types/order';

export const beautivaApi = createApi({
  reducerPath: 'beautivaApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product', 'Category', 'Brand', 'Order'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string; brand?: string; search?: string } | void>({
      queryFn: async (arg) => {
        let filtered = [...getStoredProducts()];
        if (arg?.category) {
          const cat = arg.category.toLowerCase();
          filtered = filtered.filter(p => p.categoryId === arg.category || p.category.toLowerCase().includes(cat));
        }
        if (arg?.brand) {
          const br = arg.brand.toLowerCase();
          filtered = filtered.filter(p => p.brand.toLowerCase() === br);
        }
        if (arg?.search) {
          const q = arg.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.brand.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
          );
        }
        return { data: filtered };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductBySlug: builder.query<Product, string>({
      queryFn: async (slug) => {
        const all = getStoredProducts();
        const found = all.find(p => p.slug === slug || p.id === slug);
        if (!found) {
          return { error: { status: 404, data: 'Product not found' } };
        }
        return { data: found };
      },
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        return { data: categories };
      },
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      queryFn: async (slug) => {
        const cat = categories.find(c => c.slug === slug || c.id === slug);
        if (!cat) {
          return { error: { status: 404, data: 'Category not found' } };
        }
        return { data: cat };
      },
      providesTags: (_res, _err, slug) => [{ type: 'Category', id: slug }],
    }),
    getBrands: builder.query<Brand[], void>({
      queryFn: async () => {
        return { data: brands };
      },
      providesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
    getBrandBySlug: builder.query<Brand, string>({
      queryFn: async (slug) => {
        const brand = brands.find(b => b.slug === slug || b.id === slug);
        if (!brand) {
          return { error: { status: 404, data: 'Brand not found' } };
        }
        return { data: brand };
      },
      providesTags: (_res, _err, slug) => [{ type: 'Brand', id: slug }],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      queryFn: async (orderData) => {
        const newOrder: Order = {
          id: `BV-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          items: orderData.items || [],
          address: orderData.address!,
          subtotal: orderData.subtotal || 0,
          discount: orderData.discount || 0,
          tax: orderData.tax || 0,
          total: orderData.total || 0,
          paymentMethod: orderData.paymentMethod || 'cash',
          advanceAmount: orderData.advanceAmount,
          status: 'confirmed',
          assignedBeautician: {
            name: 'Pooja Rawat (Certified Senior Stylist)',
            verified: true,
            rating: 4.9
          }
        };
        // Persist order in local storage
        try {
          const stored = localStorage.getItem('beautiva_orders');
          const orders = stored ? JSON.parse(stored) : [];
          orders.unshift(newOrder);
          localStorage.setItem('beautiva_orders', JSON.stringify(orders));
        } catch {
          // ignore
        }
        return { data: newOrder };
      },
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      queryFn: async (productData) => {
        const all = getStoredProducts();
        const slug = (productData.title || `package-${Date.now()}`)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const newProduct: Product = {
          id: productData.id || `pkg-${Date.now()}`,
          slug: productData.slug || slug,
          title: productData.title || 'Untitled Package',
          brand: productData.brand || 'VLCC',
          category: productData.category || 'Facial & Skincare',
          categoryId: productData.categoryId || 'facials-skincare',
          price: productData.price || 999,
          originalPrice: productData.originalPrice || 1500,
          discountPercent: productData.discountPercent || (productData.originalPrice && productData.price ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : 35),
          durationMinutes: productData.durationMinutes || 60,
          description: productData.description || 'Professional at-home salon treatment.',
          shortDescription: productData.shortDescription || 'Signature at-home beauty treatment.',
          image: productData.image || '/images/beautiva_facial_skincare_1792923326387.jpg',
          inclusions: productData.inclusions || ['Cleansing & Exfoliation', 'Herbal Face Pack', 'Acupressure Massage'],
          badge: productData.badge,
          isPackage: productData.isPackage !== false,
          isPopular: !!productData.isPopular,
          skinType: productData.skinType || 'All Skin Types',
          stepsCount: productData.stepsCount || 5,
          safetyProtocol: productData.safetyProtocol || [
            'Single-use sealed kit opened before client',
            'Beautician in sanitized apron & disposable gloves',
            'Sterilized stainless steel equipment'
          ]
        };

        const updated = [newProduct, ...all];
        saveStoredProducts(updated);
        return { data: newProduct };
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, Product>({
      queryFn: async (updatedProduct) => {
        const all = getStoredProducts();
        const idx = all.findIndex((p) => p.id === updatedProduct.id);
        if (idx === -1) {
          return { error: { status: 404, data: 'Product not found' } };
        }
        all[idx] = updatedProduct;
        saveStoredProducts(all);
        return { data: updatedProduct };
      },
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Product', id: arg.id },
        { type: 'Product', id: 'LIST' }
      ],
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: async (id) => {
        const all = getStoredProducts();
        const filtered = all.filter((p) => p.id !== id);
        saveStoredProducts(filtered);
        return { data: { success: true, id } };
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBrandsQuery,
  useGetBrandBySlugQuery,
  useCreateOrderMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = beautivaApi;
