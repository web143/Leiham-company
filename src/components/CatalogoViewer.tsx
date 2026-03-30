'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { products } from '@/lib/products';
import { cn } from '@/lib/utils';

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
  { page: '31', type: 'products', title: 'Power Blender', categoryKeywords: ['power blender', 'licuadora'] },
  { page: '32', type: 'products', title: 'Power Blender Go', categoryKeywords: ['power blender', 'licuadora', 'chocolatera'] },
  { page: '33', type: 'products', title: 'Chocolatera', categoryKeywords: ['chocolatera', 'café / té'] },
  { page: '34', type: 'products', title: 'ExperTea', categoryKeywords: ['expertea'] },
  { page: '35', type: 'products', title: 'Café y Espresso', categoryKeywords: ['espresso', 'barista', 'café / té'] },
  { page: '36', type: 'products', title: 'Accesorios y Filtración', categoryKeywords: ['accesorios', 'cuchillería', 'filtro'] },
];

interface Props {
  isDark?: boolean;
  onProductsChange?: (items: typeof products) => void;
}

export default function CatalogoViewer({ isDark = true, onProductsChange }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState('1');
  const [activePanel, setActivePanel] = useState<{ title: string; items: typeof products } | null>(null);
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});
  const touchStartX = useRef(0);

  const fmt = (n: number) => `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

  const getKey = (p: typeof products[0]) => `${p.code}_${p.name}`;
  const getCantidad = (p: typeof products[0]) => cantidades[getKey(p)] || 0;
  const isSelected = (p: typeof products[0]) => selectedItems.some(i => i.code === p.code && i.name === p.name);

  const buildArray = (items: typeof products, cnts: { [key: string]: number }) => {
    const result: typeof products = [];
    items.forEach(p => {
      const c = cnts[getKey(p)] || 1;
      for (let i = 0; i < c; i++) result.push(p);
    });
    return result;
  };

  const addOne = (p: typeof products[0]) => {
    const key = getKey(p);
    const newC = (cantidades[key] || 0) + 1;
    const newCnts = { ...cantidades, [key]: newC };
    setCantidades(newCnts);
    let newItems = selectedItems;
    if (!isSelected(p)) { newItems = [...selectedItems, p]; setSelectedItems(newItems); }
    onProductsChange?.(buildArray(newItems, newCnts));
  };

  const removeOne = (p: typeof products[0]) => {
    const key = getKey(p);
    const newC = Math.max(0, (cantidades[key] || 0) - 1);
    const newCnts = { ...cantidades, [key]: newC };
    setCantidades(newCnts);
    let newItems = selectedItems;
    if (newC === 0) { newItems = selectedItems.filter(i => !(i.code === p.code && i.name === p.name)); setSelectedItems(newItems); }
    onProductsChange?.(buildArray(newItems, newCnts));
  };

  const getProductsForPage = (pageInfo: typeof PAGES[0]) => {
    const keywords = (pageInfo as any).productKeywords || (pageInfo as any).categoryKeywords || [];
    return products.filter(p =>
      keywords.some((kw: string) =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        p.category.toLowerCase().includes(kw.toLowerCase())
      )
    );
  };

  const handlePageClick = (pageInfo: typeof PAGES[0]) => {
    if (pageInfo.type === 'static') return;
    const items = getProductsForPage(pageInfo);
    if (items.length === 0) return;
    setActivePanel({ title: pageInfo.title, items });
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= PAGES.length) return;
    setCurrentPage(i);
    setPageInput(String(i + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(currentPage + 1) : goTo(currentPage - 1);
  };

  return (
    <section className={cn('w-full transition-colors duration-300', isDark ? 'bg-black' : 'bg-white')}>

      {/* Título */}
      <div className="text-center pt-8 pb-4 px-4">
        <p className="text-[#0066B3] text-xs tracking-[0.3em] uppercase mb-2">Royal Prestige®</p>
        <h2 className={cn('text-3xl md:text-4xl font-black tracking-tight uppercase', isDark ? 'text-white' : 'text-slate-900')}>
          Catálogo de <span className="text-[#0066B3]">Productos</span>
        </h2>
        <p className={cn('text-xs mt-2', isDark ? 'text-white/30' : 'text-slate-400')}>
          Haz clic en cualquier sección para ver precios y agregar productos
        </p>
      </div>

      {/* Visor — sin padding ni margen extra */}
      <div className="w-full max-w-[1100px] mx-auto px-4">

        {/* Contenedor imagen — solo tan alto como la imagen */}
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-2xl shadow-2xl',
            PAGES[currentPage].type !== 'static' && 'cursor-pointer group'
          )}
          onClick={() => handlePageClick(PAGES[currentPage])}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={`/catalogo_pages/webp/page-${PAGES[currentPage].page}.webp`}
            alt={PAGES[currentPage].title}
            width={1400}
            height={1000}
            className="w-full h-auto block"
            priority
          />

          {/* Overlay */}
          {PAGES[currentPage].type !== 'static' && (
            <div className="absolute inset-0 bg-[#0066B3]/0 group-hover:bg-[#0066B3]/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all bg-[#0066B3] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Ver productos
              </div>
            </div>
          )}

          {/* Flechas */}
          <button
            onClick={e => { e.stopPropagation(); goTo(currentPage - 1); }}
            disabled={currentPage === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white text-xl flex items-center justify-center disabled:opacity-0 transition-all"
          >‹</button>
          <button
            onClick={e => { e.stopPropagation(); goTo(currentPage + 1); }}
            disabled={currentPage === PAGES.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white text-xl flex items-center justify-center disabled:opacity-0 transition-all"
          >›</button>
        </div>

        {/* Controles pegados debajo de la imagen */}
        <div className="flex items-center justify-center gap-3 mt-3 pb-6">
          <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>Página</span>
          <input
            type="number" min={1} max={36} value={pageInput}
            onChange={e => { setPageInput(e.target.value); const n = parseInt(e.target.value); if (!isNaN(n) && n >= 1 && n <= 36) goTo(n - 1); }}
            className={cn('w-14 text-center px-2 py-1.5 rounded-lg border outline-none text-sm font-bold', isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#0066B3]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#0066B3]')}
          />
          <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>de 36</span>
        </div>

        {/* Barra de progreso */}
        <div className={cn('w-full h-1 rounded-full -mt-4 mb-6 overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-200')}>
          <div className="h-full bg-[#0066B3] rounded-full transition-all duration-300" style={{ width: `${((currentPage + 1) / PAGES.length) * 100}%` }} />
        </div>
      </div>

      {/* Panel modal */}
      {activePanel && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4" onClick={() => setActivePanel(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className={cn('relative w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl', isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200')}
            onClick={e => e.stopPropagation()}
          >
            <div className={cn('flex items-center justify-between p-4 border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
              <div>
                <h3 className={cn('font-black text-lg uppercase tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>{activePanel.title}</h3>
                <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>{activePanel.items.length} productos disponibles</p>
              </div>
              <button onClick={() => setActivePanel(null)} className={cn('p-2 rounded-xl', isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-400')}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activePanel.items.map(p => (
                <div
                  key={p.code + p.name}
                  className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                    isSelected(p)
                      ? 'bg-[#0066B3]/15 border-[#0066B3]/40'
                      : isDark ? 'bg-slate-800/50 border-transparent' : 'bg-slate-50 border-transparent'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-slate-900')}>{p.name}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-slate-400')}>{p.code !== '-' ? p.code : p.category}</p>
                  </div>
                  <p className="text-[#0066B3] font-bold text-sm flex-shrink-0">{fmt(p.total)}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {getCantidad(p) > 0 && (
                      <>
                        <button onClick={() => removeOne(p)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-700 text-white hover:bg-red-500/50 transition-all font-bold">−</button>
                        <span className="text-[#0066B3] font-black text-sm w-6 text-center">{getCantidad(p)}</span>
                      </>
                    )}
                    <button
                      onClick={() => addOne(p)}
                      className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all font-bold',
                        getCantidad(p) > 0 ? 'bg-[#0066B3] text-white' : isDark ? 'bg-white/10 text-white/40 hover:bg-[#0066B3]/30' : 'bg-slate-200 text-slate-400'
                      )}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className={cn('p-4 border-t', isDark ? 'border-white/10' : 'border-slate-200')}>
              <button onClick={() => setActivePanel(null)} className="w-full bg-[#0066B3] text-white py-3 rounded-xl font-bold">
                Listo — {selectedItems.length} producto{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
