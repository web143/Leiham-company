'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Check } from 'lucide-react';
import { products } from '@/lib/products';
import { cn } from '@/lib/utils';

// Mapa de páginas del catálogo
const CATALOG_PAGES = [
  { page: '01', type: 'static', title: 'Portada' },
  { page: '02', type: 'static', title: 'Índice' },
  { page: '03', type: 'static', title: 'Características' },
  // Combos — click en título selecciona el producto
  { page: '04', type: 'combo', title: 'Sistema 10 Piezas Familiar', spread: '05',
    clickZone: { top: '5%', left: '0%', width: '45%', height: '20%' },
    productKeywords: ['familiar', '10 pz', '10pz', '10 piezas'] },
  { page: '06', type: 'combo', title: 'Sistema 8 Piezas Especial', spread: '07',
    clickZone: { top: '5%', left: '0%', width: '45%', height: '20%' },
    productKeywords: ['especial', '8 pz', '8pz', '8 piezas'] },
  { page: '08', type: 'combo', title: 'Sistema 7 Piezas Clásico', spread: '09',
    clickZone: { top: '5%', left: '0%', width: '45%', height: '20%' },
    productKeywords: ['clásico', 'clasico', '7 pz', '7pz', '7 piezas'] },
  { page: '10', type: 'combo', title: 'Sistema 5 Piezas Complementario', spread: '11',
    clickZone: { top: '5%', left: '0%', width: '45%', height: '20%' },
    productKeywords: ['complementario', '5 pz', '5pz', '5 piezas'] },
  // Productos individuales
  { page: '12', type: 'products', title: 'Las Grandes', spread: '13',
    categoryKeywords: ['ollas de sancocho', 'grandes'] },
  { page: '14', type: 'products', title: 'Las Paelleras', spread: '15',
    categoryKeywords: ['paellera'] },
  { page: '16', type: 'products', title: 'Los Gourmets', spread: '17',
    categoryKeywords: ['gourmet', 'easy release / acero'] },
  { page: '18', type: 'products', title: 'Ollas de Presión', spread: '19',
    categoryKeywords: ['ollas de presión', 'presion'] },
  { page: '20', type: 'products', title: 'Las Planchas', spread: '21',
    categoryKeywords: ['plancha', 'parrilla'] },
  { page: '22', type: 'products', title: 'El Wok y Coladores', spread: '23',
    categoryKeywords: ['wok', 'colador'] },
  { page: '24', type: 'products', title: 'Pavera y Accesorios', spread: '25',
    categoryKeywords: ['pavera', 'accesorios'] },
  { page: '26', type: 'products', title: 'Easy Release', spread: '27',
    categoryKeywords: ['easy release'] },
  { page: '28', type: 'products', title: 'Casserole y Perfect Pop', spread: '29',
    categoryKeywords: ['casserole', 'perfect pop', 'cacerola'] },
  { page: '30', type: 'products', title: 'Salad Machine y Precision Cook', spread: '31',
    categoryKeywords: ['salad', 'precision', 'inducción'] },
  { page: '32', type: 'products', title: 'Power Blender', spread: '33',
    categoryKeywords: ['power blender', 'blender', 'licuadora', 'chocolatera'] },
  { page: '34', type: 'products', title: 'ExperTea y Café', spread: '35',
    categoryKeywords: ['expertea', 'café', 'espresso', 'barista', 'café / té'] },
  { page: '36', type: 'products', title: 'Accesorios y Filtración', spread: null,
    categoryKeywords: ['accesorios', 'cuchillería', 'cubertería', 'filtro', 'aire'] },
];

interface CatalogoViewerProps {
  isDark?: boolean;
  onProductsChange?: (items: typeof products) => void;
}

export default function CatalogoViewer({ isDark = true, onProductsChange }: CatalogoViewerProps) {
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [activePanel, setActivePanel] = useState<{
    pageInfo: typeof CATALOG_PAGES[0];
    matchedProducts: typeof products;
  } | null>(null);

  const fmt = (n: number) => `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

  const getProductsForPage = (pageInfo: typeof CATALOG_PAGES[0]) => {
    if (!pageInfo.productKeywords && !pageInfo.categoryKeywords) return [];
    const keywords = pageInfo.productKeywords || pageInfo.categoryKeywords || [];
    return products.filter(p =>
      keywords.some(kw =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        p.category.toLowerCase().includes(kw.toLowerCase())
      )
    );
  };

  const isSelected = (p: typeof products[0]) =>
    selectedItems.some(i => i.code === p.code && i.name === p.name);

  const toggleProduct = (p: typeof products[0]) => {
    const newItems = isSelected(p)
      ? selectedItems.filter(i => !(i.code === p.code && i.name === p.name))
      : [...selectedItems, p];
    setSelectedItems(newItems);
    onProductsChange?.(newItems);
  };

  const handlePageClick = (pageInfo: typeof CATALOG_PAGES[0]) => {
    if (pageInfo.type === 'static') return;
    const matched = getProductsForPage(pageInfo);
    if (matched.length === 0) return;
    setActivePanel({ pageInfo, matchedProducts: matched });
  };

  const totalSeleccionado = selectedItems.reduce((s, p) => s + p.total, 0);

  return (
    <section className={cn(
      'w-full transition-colors duration-300',
      isDark ? 'bg-black' : 'bg-white'
    )}>
      {/* Título */}
      <div className="text-center py-8 px-4">
        <p className="text-[#0066B3] text-xs tracking-[0.3em] uppercase mb-2">Royal Prestige®</p>
        <h2 className={cn('text-3xl font-black tracking-tight uppercase', isDark ? 'text-white' : 'text-slate-900')}>
          Catálogo de <span className="text-[#0066B3]">Productos</span>
        </h2>
        <p className={cn('text-xs mt-2', isDark ? 'text-white/30' : 'text-slate-400')}>
          Haz clic en cualquier sección para ver precios y agregar productos
        </p>
      </div>

      {/* Visor de páginas */}
      <div className="max-w-[1200px] mx-auto px-4 pb-8 space-y-2">
        {CATALOG_PAGES.map((pageInfo) => (
          <div key={pageInfo.page} className="relative w-full">
            {/* Layout de dos páginas (spread) */}
            <div className="flex gap-1">
              {/* Página izquierda */}
              <div
                className={cn(
                  'relative flex-1 overflow-hidden rounded-xl',
                  pageInfo.type !== 'static' && 'cursor-pointer group'
                )}
                onClick={() => handlePageClick(pageInfo)}
              >
                <Image
                  src={`/catalogo_pages/webp/page-${pageInfo.page}.webp`}
                  alt={pageInfo.title}
                  width={700}
                  height={500}
                  className="w-full h-auto"
                  loading="lazy"
                />
                {/* Overlay hover para páginas clickeables */}
                {pageInfo.type !== 'static' && (
                  <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#0066B3] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {pageInfo.type === 'combo' ? '👆 Seleccionar combo' : '👆 Ver productos y precios'}
                    </div>
                  </div>
                )}
              </div>

              {/* Página derecha (spread) si existe */}
              {pageInfo.spread && (
                <div
                  className={cn(
                    'relative flex-1 overflow-hidden rounded-xl',
                    pageInfo.type !== 'static' && 'cursor-pointer group'
                  )}
                  onClick={() => handlePageClick(pageInfo)}
                >
                  <Image
                    src={`/catalogo_pages/webp/page-${pageInfo.spread}.webp`}
                    alt={`${pageInfo.title} (cont.)`}
                    width={700}
                    height={500}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  {pageInfo.type !== 'static' && (
                    <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/10 transition-all duration-300" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Panel de productos (modal) */}
      {activePanel && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4"
          onClick={() => setActivePanel(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className={cn(
              'relative w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl',
              isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Header del panel */}
            <div className={cn('flex items-center justify-between p-4 border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
              <div>
                <h3 className={cn('font-black text-lg uppercase tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  {activePanel.pageInfo.title}
                </h3>
                <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>
                  {activePanel.matchedProducts.length} productos disponibles
                </p>
              </div>
              <button onClick={() => setActivePanel(null)}
                className={cn('p-2 rounded-xl transition-colors', isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-400')}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,102,179,0.2) transparent' }}>
              {activePanel.matchedProducts.map(p => (
                <div
                  key={p.code + p.name}
                  onClick={() => toggleProduct(p)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all',
                    isSelected(p)
                      ? 'bg-[#0066B3]/15 border-[#0066B3]/40'
                      : isDark ? 'bg-slate-800/50 border-transparent hover:border-[#0066B3]/30' : 'bg-slate-50 border-transparent hover:border-[#0066B3]/30'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected(p) ? 'bg-[#0066B3] text-white' : isDark ? 'bg-white/5 text-white/20' : 'bg-slate-200 text-slate-400'
                  )}>
                    {isSelected(p) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-slate-900')}>
                      {p.name}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>
                      {p.code !== '-' ? p.code : p.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#0066B3] font-bold text-sm">{fmt(p.total)}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/20' : 'text-slate-400')}>
                      ITBIS incl.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer del panel */}
            <div className={cn('p-4 border-t', isDark ? 'border-white/10' : 'border-slate-200')}>
              <button
                onClick={() => setActivePanel(null)}
                className="w-full bg-[#0066B3] text-white py-3 rounded-xl font-bold tracking-wider text-sm"
              >
                Listo — {selectedItems.length} producto{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante ir a calculadora */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          <button
            onClick={() => {
              document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 bg-[#0066B3] text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-[#0066B3]/40 hover:bg-[#0055a0] transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{selectedItems.length} producto{selectedItems.length !== 1 ? 's' : ''} · {fmt(totalSeleccionado)}</span>
            <span className="text-white/70 text-sm">→ Calcular</span>
          </button>
        </div>
      )}
    </section>
  );
}
