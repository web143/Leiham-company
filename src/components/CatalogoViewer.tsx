'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Check } from 'lucide-react';
import { products } from '@/lib/products';
import { cn } from '@/lib/utils';
import { AnimatedButton, AnimatedButtonBlue } from '@/components/ui/AnimatedButton';

// Mapa de páginas individuales
const PAGES = [
  { page: '01', type: 'static', title: 'Portada' },
  { page: '02', type: 'static', title: 'Índice' },
  { page: '03', type: 'static', title: 'Características' },
  { page: '04', type: 'combo', title: 'Sistema 10 Piezas Familiar', productKeywords: ['familiar', '10 pz', '10pz', '10 piezas'] },
  { page: '05', type: 'combo', title: 'Sistema 10 Piezas Familiar', productKeywords: ['familiar', '10 pz', '10pz', '10 piezas'] },
  { page: '06', type: 'combo', title: 'Sistema 8 Piezas Especial', productKeywords: ['especial', '8 pz', '8 piezas'] },
  { page: '07', type: 'combo', title: 'Sistema 8 Piezas Especial', productKeywords: ['especial', '8 pz', '8 piezas'] },
  { page: '08', type: 'combo', title: 'Sistema 7 Piezas Clásico', productKeywords: ['clásico', 'clasico', '7 pz', '7 piezas'] },
  { page: '09', type: 'combo', title: 'Sistema 7 Piezas Clásico', productKeywords: ['clásico', 'clasico', '7 pz', '7 piezas'] },
  { page: '10', type: 'combo', title: 'Sistema 5 Piezas Complementario', productKeywords: ['complementario', '5 pz', '5 piezas'] },
  { page: '11', type: 'combo', title: 'Sistema 5 Piezas Complementario', productKeywords: ['complementario', '5 pz', '5 piezas'] },
  { page: '12', type: 'products', title: 'Las Grandes', categoryKeywords: ['sancocho', 'grandes'] },
  { page: '13', type: 'products', title: 'Las Grandes', categoryKeywords: ['sancocho', 'grandes'] },
  { page: '14', type: 'products', title: 'Las Paelleras', categoryKeywords: ['paellera'] },
  { page: '15', type: 'products', title: 'Las Paelleras', categoryKeywords: ['paellera'] },
  { page: '16', type: 'products', title: 'Los Gourmets', categoryKeywords: ['gourmet', 'easy release / acero'] },
  { page: '17', type: 'products', title: 'Los Gourmets', categoryKeywords: ['gourmet', 'easy release / acero'] },
  { page: '18', type: 'products', title: 'Ollas de Presión', categoryKeywords: ['presión', 'presion'] },
  { page: '19', type: 'products', title: 'Ollas de Presión', categoryKeywords: ['presión', 'presion'] },
  { page: '20', type: 'products', title: 'Las Planchas', categoryKeywords: ['plancha', 'parrilla'] },
  { page: '21', type: 'products', title: 'Las Planchas', categoryKeywords: ['plancha', 'parrilla'] },
  { page: '22', type: 'products', title: 'El Wok', categoryKeywords: ['wok'] },
  { page: '23', type: 'products', title: 'Los Coladores', categoryKeywords: ['colador'] },
  { page: '24', type: 'products', title: 'Pavera', categoryKeywords: ['pavera'] },
  { page: '25', type: 'products', title: 'Accesorios', categoryKeywords: ['accesorios'] },
  { page: '26', type: 'products', title: 'Easy Release', categoryKeywords: ['easy release'] },
  { page: '27', type: 'products', title: 'Easy Release', categoryKeywords: ['easy release'] },
  { page: '28', type: 'products', title: 'Casserole', categoryKeywords: ['casserole', 'cacerola'] },
  { page: '29', type: 'products', title: 'Perfect Pop y Salad Machine', categoryKeywords: ['perfect pop', 'salad'] },
  { page: '30', type: 'products', title: 'Precision Cook', categoryKeywords: ['precision', 'inducción'] },
  { page: '31', type: 'products', title: 'Power Blender', categoryKeywords: ['power blender', 'blender', 'licuadora'] },
  { page: '32', type: 'products', title: 'Power Blender Go', categoryKeywords: ['power blender', 'licuadora', 'chocolatera'] },
  { page: '33', type: 'products', title: 'Chocolatera', categoryKeywords: ['chocolatera', 'café / té'] },
  { page: '34', type: 'products', title: 'ExperTea', categoryKeywords: ['expertea'] },
  { page: '35', type: 'products', title: 'Café y Espresso', categoryKeywords: ['espresso', 'barista', 'café / té'] },
  { page: '36', type: 'products', title: 'Accesorios y Filtración', categoryKeywords: ['accesorios', 'cuchillería', 'cubertería', 'filtro'] },
];

interface CatalogoViewerProps {
  isDark?: boolean;
  onProductsChange?: (items: any[]) => void;
}

export default function CatalogoViewer({ isDark = true, onProductsChange }: CatalogoViewerProps) {
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [activePanel, setActivePanel] = useState<{
    pageInfo: typeof PAGES[0];
    matchedProducts: typeof products;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState(false);
  const [pageInput, setPageInput] = useState('1');

  const shouldReduceMotion = useReducedMotion();

  const fmt = (n: number) => `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

  const getProductsForPage = (pageInfo: typeof PAGES[0]) => {
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

  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});

  const getKey = (p: typeof products[0]) => `${p.code}_${p.name}`;

  const getCantidad = (p: typeof products[0]) => cantidades[getKey(p)] || 0;

  const buildItemsArray = (
    items: typeof products,
    cantidades: { [key: string]: number }
  ) => {
    const result: typeof products = [];
    items.forEach(p => {
      const cantidad = cantidades[`${p.code}_${p.name}`] || 1;
      for (let i = 0; i < cantidad; i++) {
        result.push(p);
      }
    });
    return result;
  };

  const addOne = (p: typeof products[0]) => {
    const key = getKey(p);
    const nuevaCantidad = (cantidades[key] || 0) + 1;
    const newCantidades = { ...cantidades, [key]: nuevaCantidad };
    setCantidades(newCantidades);
    
    let newItems = selectedItems;
    if (!isSelected(p)) {
      newItems = [...selectedItems, p];
      setSelectedItems(newItems);
    }
    onProductsChange?.(buildItemsArray(newItems, newCantidades));
  };

  const removeOne = (p: typeof products[0]) => {
    const key = getKey(p);
    const nuevaCantidad = Math.max(0, (cantidades[key] || 0) - 1);
    const newCantidades = { ...cantidades, [key]: nuevaCantidad };
    setCantidades(newCantidades);
    
    let newItems = selectedItems;
    if (nuevaCantidad === 0) {
      newItems = selectedItems.filter(i => !(i.code === p.code && i.name === p.name));
      setSelectedItems(newItems);
    }
    onProductsChange?.(buildItemsArray(newItems, newCantidades));
  };

  const handlePageClick = (pageInfo: typeof PAGES[0]) => {
    if (pageInfo.type === 'static') return;
    const matched = getProductsForPage(pageInfo);
    if (matched.length === 0) return;
    setActivePanel({ pageInfo, matchedProducts: matched });
  };

  const totalSeleccionado = selectedItems.reduce((s, p) => s + p.total, 0);

  const goToPage = (index: number) => {
    if (index < 0 || index >= PAGES.length || isFlipping) return;
    setDirection(index > currentPage ? 'next' : 'prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(index);
      setPageInput(String(index + 1));
      setIsFlipping(false);
    }, shouldReduceMotion ? 0 : 400);
  };

  const handlePageInput = (value: string) => {
    setPageInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 36) {
      goToPage(num - 1);
    }
  };

  // Swipe en móvil
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    }
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPage(currentPage + 1);
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPage, isFlipping]);

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

      {/* Visor tipo revista 1 página */}
      <div className="max-w-[1100px] mx-auto px-4 pb-4">
        
        {/* Página actual */}
        <div
          key={currentPage}
          className={cn(
            'relative w-full overflow-hidden rounded-2xl shadow-2xl transition-transform duration-200',
            !shouldReduceMotion && !isFlipping && direction === 'next' && 'flip-in-next',
            !shouldReduceMotion && !isFlipping && direction === 'prev' && 'flip-in-prev',
            PAGES[currentPage].type !== 'static' && 'cursor-pointer group'
          )}
          onClick={() => PAGES[currentPage].type !== 'static' && handlePageClick(PAGES[currentPage])}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={`/catalogo_pages/webp/page-${PAGES[currentPage].page}.webp`}
            alt={PAGES[currentPage].title}
            width={1400}
            height={1000}
            className="w-full h-auto"
            priority
          />

          {/* Overlay hover */}
          {PAGES[currentPage].type !== 'static' && (
            <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/8 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#0066B3] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl">
                {PAGES[currentPage].type === 'combo' ? '👆 Seleccionar este combo' : '👆 Ver precios'}
              </div>
            </div>
          )}

          {/* Flechas de navegación encima de la imagen */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.9, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            onClick={e => { e.stopPropagation(); goToPage(currentPage - 1); }}
            disabled={currentPage === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            ‹
          </motion.button>
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.9, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            onClick={e => { e.stopPropagation(); goToPage(currentPage + 1); }}
            disabled={currentPage === PAGES.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            ›
          </motion.button>
        </div>

        {/* Controles inferiores */}
        <div className="flex items-center justify-between mt-4 gap-4">
          
          <AnimatedButton
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Anterior
          </AnimatedButton>

          <div className="flex items-center gap-2">
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>Página</span>
            <input
              type="number"
              min={1}
              max={36}
              value={pageInput}
              onChange={e => handlePageInput(e.target.value)}
              className={cn(
                'w-14 text-center px-2 py-1.5 rounded-lg border outline-none text-sm font-bold',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-[#0066B3]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#0066B3]'
              )}
            />
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>de 36</span>
          </div>

          <AnimatedButtonBlue
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === PAGES.length - 1}
          >
            Siguiente →
          </AnimatedButtonBlue>
        </div>

        {/* Barra de progreso */}
        <div className={cn('w-full h-1 rounded-full mt-3 overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-200')}>
          <div
            className="h-full bg-[#0066B3] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentPage + 1) / PAGES.length) * 100}%` }}
          />
        </div>

        <p className={cn('text-center text-xs mt-2', isDark ? 'text-white/20' : 'text-slate-300')}>
          Desliza o usa ← → para cambiar de página
        </p>
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
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                    isSelected(p)
                      ? 'bg-[#0066B3]/15 border-[#0066B3]/40'
                      : isDark ? 'bg-slate-800/50 border-transparent hover:border-[#0066B3]/30' : 'bg-slate-50 border-transparent hover:border-[#0066B3]/30'
                  )}
                >
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {getCantidad(p) > 0 && (
                      <>
                        <button
                          onClick={() => removeOne(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-700 text-white hover:bg-red-500/50 transition-all font-bold text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="text-[#0066B3] font-black text-sm w-6 text-center">
                          {getCantidad(p)}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addOne(p)}
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-all font-bold text-lg leading-none',
                        getCantidad(p) > 0
                          ? 'bg-[#0066B3] text-white hover:bg-[#0055a0]'
                          : isDark ? 'bg-white/10 text-white/40 hover:bg-[#0066B3]/30 hover:text-white' : 'bg-slate-200 text-slate-400 hover:bg-[#0066B3]/20'
                      )}
                    >
                      +
                    </button>
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

    </section>
  );
}
