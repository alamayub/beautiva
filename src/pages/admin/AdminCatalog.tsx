import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ArrowUpRight, 
  X, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Product } from '../../types/product';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../../store/api/baseApi';
import { formatCurrency } from '../../lib/currency';
import { useToast } from '../../components/common/ToastProvider';
import { DataTable, ColumnDef, FilterDef } from '../../components/common/DataTable';
import { ActionMenu, ActionMenuItem } from '../../components/common/ActionMenu';

export const AdminCatalog: React.FC = () => {
  const { showToast } = useToast();
  const { data: productsList = [], isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('VLCC');
  const [formCategory, setFormCategory] = useState('Facial & Skincare');
  const [formCategoryId, setFormCategoryId] = useState('facials-skincare');
  const [formPrice, setFormPrice] = useState(999);
  const [formOriginalPrice, setFormOriginalPrice] = useState(1600);
  const [formDuration, setFormDuration] = useState(75);
  const [formBadge, setFormBadge] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSkinType, setFormSkinType] = useState('All Skin Types');
  const [formStepsCount, setFormStepsCount] = useState(6);
  const [formImage, setFormImage] = useState('/images/beautiva_facial_skincare_1792923326387.jpg');
  const [inclusionsText, setInclusionsText] = useState('');
  const [safetyText, setSafetyText] = useState('');

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormBrand('VLCC');
    setFormCategory('Facial & Skincare');
    setFormCategoryId('facials-skincare');
    setFormPrice(999);
    setFormOriginalPrice(1600);
    setFormDuration(75);
    setFormBadge('');
    setFormShortDesc('');
    setFormDesc('');
    setFormSkinType('All Skin Types');
    setFormStepsCount(6);
    setFormImage('/images/beautiva_facial_skincare_1792923326387.jpg');
    setInclusionsText('Cleansing & Exfoliation\nDeep pore steam & blackhead suction\nHerbal de-tan pack\nAcupressure glow massage');
    setSafetyText('Single-use sealed kit opened before client\nBeautician in sanitized apron & disposable gloves\nSterilized stainless steel equipment');
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormCategoryId(product.categoryId);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormDuration(product.durationMinutes);
    setFormBadge(product.badge || '');
    setFormShortDesc(product.shortDescription);
    setFormDesc(product.description);
    setFormSkinType(product.skinType || 'All Skin Types');
    setFormStepsCount(product.stepsCount || 5);
    setFormImage(product.image);
    setInclusionsText(product.inclusions.join('\n'));
    setSafetyText((product.safetyProtocol || []).join('\n'));
    setIsFormModalOpen(true);
  };

  // Duplicate / Clone
  const handleClone = (product: Product) => {
    setEditingProduct(null);
    setFormTitle(`${product.title} (Copy)`);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormCategoryId(product.categoryId);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormDuration(product.durationMinutes);
    setFormBadge('New Variant');
    setFormShortDesc(product.shortDescription);
    setFormDesc(product.description);
    setFormSkinType(product.skinType || 'All Skin Types');
    setFormStepsCount(product.stepsCount || 5);
    setFormImage(product.image);
    setInclusionsText(product.inclusions.join('\n'));
    setSafetyText((product.safetyProtocol || []).join('\n'));
    setIsFormModalOpen(true);
  };

  // Save (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please provide a package title', 'error');
      return;
    }

    const calculatedDiscount = formOriginalPrice > formPrice
      ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
      : 0;

    const inclusionsList = inclusionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const safetyList = safetyText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        title: formTitle,
        brand: formBrand,
        category: formCategory,
        categoryId: formCategoryId,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercent: calculatedDiscount,
        durationMinutes: Number(formDuration),
        badge: formBadge.trim() ? formBadge.trim() : undefined,
        shortDescription: formShortDesc || formTitle,
        description: formDesc || formShortDesc || formTitle,
        skinType: formSkinType,
        stepsCount: Number(formStepsCount),
        image: formImage,
        inclusions: inclusionsList.length > 0 ? inclusionsList : editingProduct.inclusions,
        safetyProtocol: safetyList.length > 0 ? safetyList : editingProduct.safetyProtocol,
      };

      await updateProduct(updated);
      showToast(`Updated "${formTitle}" in catalog!`);
    } else {
      // Create
      const newSlug = formTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      await createProduct({
        title: formTitle,
        slug: newSlug,
        brand: formBrand,
        category: formCategory,
        categoryId: formCategoryId,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercent: calculatedDiscount,
        durationMinutes: Number(formDuration),
        badge: formBadge.trim() ? formBadge.trim() : undefined,
        shortDescription: formShortDesc || formTitle,
        description: formDesc || formShortDesc || formTitle,
        skinType: formSkinType,
        stepsCount: Number(formStepsCount),
        image: formImage,
        inclusions: inclusionsList.length > 0 ? inclusionsList : ['Cleansing', 'Steam', 'Massage', 'Pack'],
        safetyProtocol: safetyList.length > 0 ? safetyList : ['Single-use sealed kit', 'Sanitized equipment'],
        isPackage: true
      });
      showToast(`Added "${formTitle}" to active catalog!`);
    }

    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    showToast(`Removed "${productToDelete.title}" from catalog.`);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Pre-filter by category & brand
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
      if (brandFilter !== 'all' && p.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
      return true;
    });
  }, [productsList, categoryFilter, brandFilter]);

  // Filters for DataTable
  const filters: FilterDef[] = [
    {
      id: 'category',
      label: 'Category',
      value: categoryFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Categories', value: 'all' },
        ...categories.map((c) => ({ label: c.name, value: c.slug })),
      ],
      onChange: setCategoryFilter,
    },
    {
      id: 'brand',
      label: 'Brand House',
      value: brandFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Brands', value: 'all' },
        ...brands.map((b) => ({ label: b.name, value: b.name })),
      ],
      onChange: setBrandFilter,
    },
  ];

  const avgPrice = productsList.length > 0
    ? Math.round(productsList.reduce((sum, p) => sum + p.price, 0) / productsList.length)
    : 0;

  // Table Columns Definition
  const columns: ColumnDef<Product>[] = [
    {
      key: 'title',
      header: 'Service / Package',
      sortable: true,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.image}
            alt={p.title}
            className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 max-w-[220px]">
            <div className="font-bold text-stone-900 truncate" title={p.title}>
              {p.title}
            </div>
            <div className="text-[11px] text-stone-400 truncate" title={p.shortDescription}>
              {p.shortDescription}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'brand',
      header: 'Brand',
      sortable: true,
      cell: (p) => <span className="font-semibold text-stone-800">{p.brand}</span>
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      cell: (p) => <span className="text-stone-600">{p.category}</span>
    },
    {
      key: 'durationMinutes',
      header: 'Duration',
      sortable: true,
      cell: (p) => <span className="font-mono text-stone-700">{p.durationMinutes} mins</span>
    },
    {
      key: 'price',
      header: 'Selling Price',
      align: 'right',
      sortable: true,
      cell: (p) => (
        <span className="font-mono font-bold text-stone-900 tabular-nums">
          {formatCurrency(p.price)}
        </span>
      )
    },
    {
      key: 'originalPrice',
      header: 'Original MRP',
      align: 'right',
      sortable: true,
      cell: (p) => (
        <span className="font-mono text-stone-400 line-through tabular-nums">
          {formatCurrency(p.originalPrice)}
        </span>
      )
    },
    {
      key: 'discountPercent',
      header: 'Discount',
      align: 'right',
      sortable: true,
      cell: (p) => (
        <span className="font-mono font-semibold text-emerald-700 tabular-nums">
          {p.discountPercent}% OFF
        </span>
      )
    },
    {
      key: 'badge',
      header: 'Badge',
      cell: (p) =>
        p.badge ? (
          <span className="text-[11px] font-medium font-mono text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/70">
            {p.badge}
          </span>
        ) : (
          <span className="text-stone-300">—</span>
        )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (p) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: 'Edit Service / Pricing',
            icon: Edit3,
            onClick: () => handleOpenEdit(p),
            variant: 'primary'
          },
          {
            label: 'Duplicate / Clone',
            icon: Copy,
            onClick: () => handleClone(p)
          },
          {
            label: 'View on Live Storefront',
            icon: ExternalLink,
            onClick: () => {
              window.open(`/package/${p.slug}`, '_blank');
            }
          },
          {
            label: 'Delete from Catalog',
            icon: Trash2,
            onClick: () => {
              setProductToDelete(p);
              setIsDeleteModalOpen(true);
            },
            variant: 'danger',
            divider: true
          }
        ];

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(p)}
              className="px-2 py-1 text-xs font-semibold text-[#601A24] bg-stone-100 hover:bg-[#601A24] hover:text-white rounded transition-colors cursor-pointer"
            >
              Edit
            </button>
            <ActionMenu items={menuItems} ariaLabel={`Actions for ${p.title}`} />
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-stone-900">
            Service & Package Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Create, edit, price, and maintain Beautiva at-home parlor packages with instant storefront reflection.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Package / Service</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Live Catalog Offerings</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
            {productsList.length} <span className="text-xs text-stone-400 font-sans font-normal">packages</span>
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Across 6 specialized disciplines</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Average Selling Price</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
            {formatCurrency(avgPrice)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Average ~39% bundle savings</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Partner Brand Houses</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
            {brands.length} <span className="text-xs text-stone-400 font-sans font-normal">houses</span>
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block truncate">VLCC, Lotus, O3+, SARA, L'Oréal, Nari</span>
        </div>
      </div>

      {/* Shared DataTable Component */}
      <DataTable<Product>
        data={filteredProducts}
        columns={columns}
        idField="id"
        searchable={true}
        searchPlaceholder="Search package title, ingredient, brand, category..."
        filters={filters}
        onResetFilters={() => {
          setCategoryFilter('all');
          setBrandFilter('all');
        }}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        isLoading={isLoading}
        emptyMessage="No packages found matching search or filters"
        emptySubtitle="Try resetting the category or brand filters above."
      />

      {/* CREATE / EDIT PACKAGE MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  {editingProduct ? 'EDITING PACKAGE' : 'CREATE NEW SERVICE'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {editingProduct ? `Edit: ${editingProduct.title}` : 'Add Service to Catalog'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Row 1: Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700 block mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Lotus WhiteGlow Radiance Facial"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Best Seller / Trending"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24]"
                  />
                </div>
              </div>

              {/* Row 2: Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Brand House *</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                    <option value="Beautiva Artistry">Beautiva Artistry</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category Discipline *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const found = categories.find((c) => c.slug === selectedId);
                      setFormCategoryId(selectedId);
                      if (found) setFormCategory(found.name);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing & Duration */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={99}
                    max={99999}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min={formPrice}
                    max={99999}
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Duration (Mins) *</label>
                  <input
                    type="number"
                    min={15}
                    max={360}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Descriptions */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Short Description (1-liner)</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="e.g. Lotus WhiteGlow Skin Whitening Facial + Face & Neck Bleach."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Comprehensive Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed treatment description, active botanical extracts..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              {/* Row 5: Inclusions & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    What's Included (1 step per line)
                  </label>
                  <textarea
                    rows={4}
                    value={inclusionsText}
                    onChange={(e) => setInclusionsText(e.target.value)}
                    placeholder="Step 1: Cleansing&#10;Step 2: Steam & scrub&#10;Step 3: Massage pack"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Safety & Hygiene Protocols (1 item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={safetyText}
                    onChange={(e) => setSafetyText(e.target.value)}
                    placeholder="Single-use kit opened before client&#10;Sanitized tools"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Image Preview / Selector */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Preset Image</label>
                <select
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="/images/beautiva_facial_skincare_1792923326387.jpg">
                    Facials & Skincare (Botanical Jars & Stone)
                  </option>
                  <option value="/images/beautiva_hair_spa_1792923327617.jpg">
                    Hair Spa & Blowdry (Hair Styling)
                  </option>
                  <option value="/images/beautiva_bridal_makeup_1792923326741.jpg">
                    Bridal & Party Makeup (Bridal Artistry)
                  </option>
                  <option value="/images/beautiva_hero_luxury_1792923326581.jpg">
                    Luxury Spa & Grooming (At-Home Parlor Bed)
                  </option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#601A24] text-white rounded-lg font-semibold hover:bg-[#4a121a] shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Package to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">
                Delete "{productToDelete.title}"?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                This will remove the package from the active catalog and customer booking storefront.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-3.5 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold hover:bg-stone-200"
              >
                Keep Package
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
