'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Check } from 'lucide-react';
import { products } from '@/lib/products';
import { cn } from '@/lib/utils';

// Mapa de páginas del catálogo (Spreads)
const SPREADS = [
  { left: '01', right: null, type: 'static', title: 'Portada' },
  { left: '02', right: '03', type: 'static', title: 'Índice' },
  { left: '04', right: '05', type: 'combo', title: 'Sistema 10 Piezas Familiar', productKeywords: ['familiar', '10 pz', '10pz', '10 piezas'] },
  { left: '06', right: '07', type: 'combo', title: 'Sistema 8 Piezas Especial', productKeywords: ['especial', '8 pz', '8 piezas'] },
  { left: '08', right: '09', type: 'combo', title: 'Sistema 7 Piezas Clásico', productKeywords: ['clásico', 'clasico', '7 pz', '7 piezas'] },
  { left: '10', right: '11', type: 'combo', title: 'Sistema 5 Piezas Complementario', productKeywords: ['complementario', '5 pz', '5 piezas'] },
  { left: '12', right: '13', type: 'products', title: 'Las Grandes', categoryKeywords: ['sancocho', 'grandes'] },
  { left: '14', right: '15', type: 'products', title: 'Las Paelleras', categoryKeywords: ['paellera'] },
  { left: '16', right: '17', type: 'products', title: 'Los Gourmets', categoryKeywords: ['gourmet', 'easy release / acero'] },
  { left: '18', right: '19', type: 'products', title: 'Ollas de Presión', categoryKeywords: ['presión', 'presion'] },
  { left: '20', right: '21', type: 'products', title: 'Las Planchas', categoryKeywords: ['plancha', 'parrilla'] },
  { left: '22', right: '23', type: 'products', title: 'El Wok y Coladores', categoryKeywords: ['wok', 'colador'] },
  { left: '24', right: '25', type: 'products', title: 'Pavera y Accesorios', categoryKeywords: ['pavera', 'accesorios'] },
  { left: '26', right: '27', type: 'products', title: 'Easy Release', categoryKeywords: ['easy release'] },
  { left: '28', right: '29', type: 'products', title: 'Casserole y Perfect Pop', categoryKeywords: ['casserole', 'perfect pop', 'cacerola'] },
  { left: '30', right: '31', type: 'products', title: 'Salad Machine y Precision Cook', categoryKeywords: ['salad', 'precision', 'inducción'] },
  { left: '32', right: '33', type: 'products', title: 'Power Blender', categoryKeywords: ['power blender', 'blender', 'licuadora', 'chocolatera'] },
  { left: '34', right: '35', type: 'products', title: 'ExperTea y Café', categoryKeywords: ['expertea', 'café', 'espresso', 'barista', 'café / té'] },
  { left: '36', right: null, type: 'products', title: 'Accesorios y Filtración', categoryKeywords: ['accesorios', 'cuchillería', 'cubertería', 'filtro'] },
];

interface CatalogoViewerProps {
  isDark?: boolean;
  onProductsChange?: (items: typeof products) => void;
}

export default function CatalogoViewer({ isDark = true, onProductsChange }: CatalogoViewerProps) {
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [activePanel, setActivePanel] = useState<{
    pageInfo: typeof SPREADS[0];
    matchedProducts: typeof products;
  } | null>(null);

  const [currentSpread, setCurrentSpread] = useState(0); // índice del spread actual
  const [pageInput, setPageInput] = useState('1');
  const [isAnimating, setIsAnimating] = useState(false);

  const fmt = (n: number) => `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

  const getProductsForPage = (pageInfo: typeof SPREADS[0]) => {
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

  const handlePageClick = (pageInfo: typeof SPREADS[0]) => {
    if (pageInfo.type === 'static') return;
    const matched = getProductsForPage(pageInfo);
    if (matched.length === 0) return;
    setActivePanel({ pageInfo, matchedProducts: matched });
  };

  const totalSeleccionado = selectedItems.reduce((s, p) => s + p.total, 0);

  const goToSpread = (index: number) => {
    if (index < 0 || index >= SPREADS.length || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSpread(index);
      setPageInput(String(index * 2 + 1));
      setIsAnimating(false);
    }, 150);
  };

  const handlePageInput = (value: string) => {
    setPageInput(value);
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 36) {
      const spreadIndex = Math.floor((pageNum - 1) / 2);
      goToSpread(spreadIndex);
    }
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSpread(currentSpread + 1);
      if (e.key === 'ArrowLeft') goToSpread(currentSpread - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSpread, isAnimating]);

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

      {/* Visor tipo revista */}
      <div className="max-w-[1200px] mx-auto px-4 pb-4">
        
        {/* Contenedor del spread con animación */}
        <div className={cn(
          'relative w-full transition-all duration-300',
          isAnimating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        )}>
          <div className="flex gap-1 w-full">
            
            {/* Página izquierda */}
            <div
              className={cn(
                'relative flex-1 overflow-hidden rounded-xl shadow-2xl',
                SPREADS[currentSpread].type !== 'static' && 'cursor-pointer group'
              )}
              onClick={() => SPREADS[currentSpread].type !== 'static' && handlePageClick(SPREADS[currentSpread])}
            >
              <Image
                src={`/catalogo_pages/webp/page-${SPREADS[currentSpread].left}.webp`}
                alt={SPREADS[currentSpread].title}
                width={700}
                height={500}
                className="w-full h-auto"
                priority={currentSpread === 0}
              />
              {SPREADS[currentSpread].type !== 'static' && (
                <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#0066B3] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {SPREADS[currentSpread].type === 'combo' ? '👆 Seleccionar combo' : '👆 Ver precios'}
                  </div>
                </div>
              )}
            </div>

            {/* Página derecha */}
            {SPREADS[currentSpread].right && (
              <div
                className={cn(
                  'relative flex-1 overflow-hidden rounded-xl shadow-2xl',
                  SPREADS[currentSpread].type !== 'static' && 'cursor-pointer group'
                )}
                onClick={() => SPREADS[currentSpread].type !== 'static' && handlePageClick(SPREADS[currentSpread])}
              >
                <Image
                  src={`/catalogo_pages/webp/page-${SPREADS[currentSpread].right}.webp`}
                  alt={`${SPREADS[currentSpread].title} (cont.)`}
                  width={700}
                  height={500}
                  className="w-full h-auto"
                  priority={currentSpread === 0}
                />
                {SPREADS[currentSpread].type !== 'static' && (
                  <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/10 transition-all duration-300" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mt-4 gap-4">
          
          {/* Botón anterior */}
          <button
            onClick={() => goToSpread(currentSpread - 1)}
            disabled={currentSpread === 0}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
              currentSpread === 0
                ? 'opacity-30 cursor-not-allowed'
                : isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            )}
          >
            ← Anterior
          </button>

          {/* Input de página + indicador */}
          <div className="flex items-center gap-2">
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>Página</span>
            <input
              type="number"
              min={1}
              max={36}
              value={pageInput}
              onChange={e => handlePageInput(e.target.value)}
              className={cn(
                'w-14 text-center px-2 py-1.5 rounded-lg border outline-none text-sm font-bold transition-all',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-[#0066B3]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#0066B3]'
              )}
            />
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>de 36</span>
            <span className={cn('text-xs ml-2 hidden md:block', isDark ? 'text-white/20' : 'text-slate-300')}>
              · Usa ← → para navegar
            </span>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => goToSpread(currentSpread + 1)}
            disabled={currentSpread === SPREADS.length - 1}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
              currentSpread === SPREADS.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-[#0066B3] text-white hover:bg-[#0055a0]'
            )}
          >
            Siguiente →
          </button>
        </div>

        {/* Miniaturas de navegación rápida */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}>
          {SPREADS.map((spread, i) => (
            <button
              key={i}
              onClick={() => goToSpread(i)}
              className={cn(
                'flex-shrink-0 w-8 h-1.5 rounded-full transition-all',
                i === currentSpread
                  ? 'bg-[#0066B3] w-12'
                  : isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-slate-300 hover:bg-slate-400'
              )}
            />
          ))}
        </div>
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
