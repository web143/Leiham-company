import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function CalculadoraFinanciamiento({ isDark = true }: { isDark?: boolean }) {
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [inicialDado, setInicialDado] = useState("");
  const [porcentaje, setPorcentaje] = useState(4);
  const [porcentajeInput, setPorcentajeInput] = useState("4");

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleCategoryClick = (cat: string) => {
    // Si ya está activa, desactivar
    if (activeCategory === cat) {
      setActiveCategory(null);
      return;
    }
    
    setActiveCategory(cat);
    
    // Scroll al header de esa categoría en la lista
    setTimeout(() => {
      categoryRefs.current[cat]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const isSelected = (p: typeof products[0]) =>
    selectedItems.some(i => i.code === p.code && i.name === p.name);

  const toggle = (p: typeof products[0]) => {
    if (isSelected(p)) {
      setSelectedItems(prev => prev.filter(i => !(i.code === p.code && i.name === p.name)));
    } else {
      setSelectedItems(prev => [...prev, p]);
    }
  };

  const fmt = (n: number) => `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    
    if (!searchLower) {
      return activeCategory 
        ? products.filter(p => p.category === activeCategory)
        : products;
    }
    
    return products.filter(p => {
      const matchName = p.name.toLowerCase().includes(searchLower);
      const matchCode = p.code.toLowerCase().includes(searchLower);
      const matchTotal = p.total.toString().includes(searchLower);
      const matchPrice = p.price.toString().includes(searchLower);
      const matchCategory = activeCategory ? p.category === activeCategory : true;
      
      return (matchName || matchCode || matchTotal || matchPrice) && matchCategory;
    });
  }, [search, activeCategory]);

  const visibleCategories = useMemo(() => [...new Set(filtered.map(p => p.category))].sort(), [filtered]);
  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))].sort(), []);

  const totalProductos = selectedItems.reduce((s, p) => s + p.total, 0);

  // Cuando se escribe el inicial — calcula el porcentaje automáticamente
  const inicialDadoNum = parseFloat(inicialDado.replace(/[^0-9.]/g, '')) || 0;

  // Si el usuario escribe en el input de inicial, actualiza el slider también
  const handleInicialChange = (value: string) => {
    setInicialDado(value);
    const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    if (totalProductos > 0) {
      const pct = Math.min(100, Math.max(4, (num / totalProductos) * 100));
      setPorcentaje(parseFloat(pct.toFixed(2)));
      setPorcentajeInput(pct.toFixed(2));
    }
  };

  const handlePorcentajeInput = (value: string) => {
    // Permite borrar y escribir libremente
    setPorcentajeInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 4 && num <= 100) {
      setPorcentaje(num);
      if (totalProductos > 0) {
        setInicialDado((totalProductos * (num / 100)).toFixed(2));
      }
    }
  };

  // Si el usuario mueve el slider, actualiza el inicial también
  const handlePorcentajeChange = (value: number) => {
    const pct = Math.min(100, Math.max(4, value));
    setPorcentaje(pct);
    setPorcentajeInput(pct.toFixed(2));
    if (totalProductos > 0) {
      const inicial = totalProductos * (pct / 100);
      setInicialDado(inicial.toFixed(2));
    }
  };

  // Cuando cambia la lista de productos seleccionados,
  // recalcular el porcentaje basado en el inicial dado actual
  useEffect(() => {
    if (totalProductos > 0 && inicialDadoNum > 0) {
      const nuevoPct = Math.min(100, Math.max(4, (inicialDadoNum / totalProductos) * 100));
      setPorcentaje(nuevoPct);
      setPorcentajeInput(nuevoPct.toFixed(2));
    } else if (totalProductos === 0) {
      setPorcentaje(4);
      setPorcentajeInput("4");
    }
  }, [selectedItems]);

  // Cálculos derivados — siempre basados en inicialDadoNum
  const pagoInicial = Math.min(inicialDadoNum, totalProductos);
  const montoFinanciar = Math.max(0, totalProductos - pagoInicial);
  const cuotaMensual = montoFinanciar * 0.04;
  const numeroCuotas = montoFinanciar > 0 ? 25 : 0;


  return (
    <section className={cn("w-full min-h-screen transition-colors duration-300", isDark ? "bg-black" : "bg-white")}>
      
      {/* Título de sección */}
      <div className="text-center py-6 px-4">
        <p className="text-[#0066B3] text-xs tracking-[0.3em] uppercase mb-2">Leiham Company</p>
        <h2 className={cn("text-3xl font-black tracking-tight uppercase transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
          Calculadora de <span className="text-[#0066B3]">Financiamiento</span>
        </h2>
      </div>

      {/* Layout tres columnas */}
      <div className="max-w-[1200px] mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-[240px_1fr_320px] gap-4 h-auto md:h-[580px]">

        {/* Chips móvil — solo visible en móvil */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 custom-scrollbar"
             style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <button onClick={() => setActiveCategory(null)}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors", 
              !activeCategory ? 'bg-[#0066B3] text-white' : (isDark ? 'bg-slate-800 text-white/50' : 'bg-slate-200 text-slate-500')
            )}>
            Todos
          </button>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}
              className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors", 
                activeCategory === cat ? 'bg-[#0066B3] text-white' : (isDark ? 'bg-slate-800 text-white/50' : 'bg-slate-200 text-slate-500')
              )}>
              {cat}
              {selectedItems.filter(i => i.category === cat).length > 0 &&
                <span className="ml-1">·{selectedItems.filter(i => i.category === cat).length}</span>}
            </button>
          ))}
        </div>

        {/* COLUMNA 1 — Navegación / categorías (Solo Desktop) */}
        <div className={cn("hidden md:flex rounded-2xl p-4 flex-col h-full overflow-hidden transition-all duration-300", isDark ? "bg-slate-900/40 border border-white/5" : "bg-slate-100 border border-slate-200")}>
          <h3 className={cn("font-bold text-lg mb-4 tracking-tight transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>Categorías</h3>
          <div className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {allCategories.map(cat => {
              const count = selectedItems.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn("w-full text-left px-3 py-1.5 rounded-xl text-xs flex justify-between items-center group transition-all duration-300", 
                    activeCategory === cat 
                      ? (isDark ? 'bg-slate-800/50 text-white' : 'bg-slate-200 text-slate-900') 
                      : (isDark ? 'text-white/50 hover:text-white hover:bg-slate-800/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
                  )}
                >
                  <span className="truncate pr-2">{cat}</span>
                  {count > 0 && (
                    <span className="bg-[#0066B3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2 — Lista de productos con buscador */}
        <div className={cn("rounded-2xl p-4 flex flex-col h-auto md:h-full overflow-hidden transition-all duration-300", isDark ? "bg-slate-900/40 border border-white/5" : "bg-slate-100 border border-slate-200")}>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className={cn("font-bold text-lg tracking-tight transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>Productos disponibles</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className={cn("text-xs font-bold transition-colors uppercase tracking-widest", isDark ? "text-red-400/60 hover:text-red-400" : "text-red-400 hover:text-red-600")}
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Buscador */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066B3] w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca por nombre o código..."
              className={cn("w-full pl-11 pr-10 py-3.5 rounded-2xl border outline-none text-base md:text-sm transition-all focus:border-[#0066B3]/50", 
                isDark ? "bg-slate-800/40 border-white/5 text-white placeholder:text-white/10" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400")}
            />
            {search && (
              <button onClick={() => setSearch("")} className={cn("absolute right-4 top-1/2 -translate-y-1/2 transition-colors", isDark ? "text-white/20 hover:text-white" : "text-slate-400 hover:text-slate-900")}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-2 max-h-[300px] md:max-h-[420px] custom-scrollbar"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: isDark ? 'rgba(0,102,179,0.3) transparent' : 'rgba(0,102,179,0.2) #f1f5f9' 
            }}>
            {visibleCategories.length === 0 ? (
                <div className="text-center py-20">
                    <p className={cn("text-sm transition-colors", isDark ? "text-white/20" : "text-slate-400")}>No se encontraron productos.</p>
                </div>
            ) : visibleCategories.map(cat => (
              <div 
                key={cat} 
                ref={el => { categoryRefs.current[cat] = el; }}
                className="mb-6 last:mb-0"
              >
                <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] py-3 px-3 sticky top-0 backdrop-blur-md rounded-lg z-10 mb-2 border-b transition-all duration-300", 
                  isDark ? "text-white/20 bg-black/50 border-white/5" : "text-slate-400 bg-white/90 border-slate-200")}>
                  {cat}
                </p>
                <div className="space-y-1">
                    {filtered.filter(p => p.category === cat).map(product => (
                        <motion.div
                            key={product.code + product.name}
                            layout
                            className={cn("flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer border", 
                                isSelected(product) 
                                    ? (isDark ? 'bg-[#0066B3]/10 border-[#0066B3]/20' : 'bg-[#0066B3]/5 border-[#0066B3]/30') 
                                    : (isDark ? 'hover:bg-slate-800/40 border-transparent' : 'hover:bg-slate-50 border-transparent')
                            )}
                            onClick={() => toggle(product)}
                        >
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all", 
                                isSelected(product) ? 'bg-[#0066B3] text-white shadow-lg shadow-[#0066B3]/30 scale-105' : (isDark ? 'bg-white/5 text-white/20' : 'bg-slate-200 text-slate-400')
                            )}>
                                {isSelected(product) ? <Check className="w-4 h-4 stroke-[3]" /> : <Search className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-xs truncate transition-colors", isDark ? "text-white" : "text-slate-900")}>{product.name}</p>
                                <div className="flex gap-3 mt-0.5">
                                    {product.code !== '-' && (
                                        <p className={cn("text-xs transition-colors", isDark ? "text-white/30" : "text-slate-400")}>{product.code}</p>
                                    )}
                                    <p className={cn("text-xs transition-colors", isDark ? "text-white/30" : "text-slate-400")}>ITBIS: {fmt(product.itbis)}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-[#0066B3] text-xs font-semibold">{fmt(product.total)}</p>
                                <p className={cn("text-xs transition-colors", isDark ? "text-white/20" : "text-slate-400")}>sin ITBIS: {fmt(product.price)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer total */}
          <div className={cn("border-t pt-4 mt-4 flex justify-between items-center transition-all duration-300", isDark ? "border-white/10" : "border-slate-200")}>
            <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors", isDark ? "text-white/30" : "text-slate-400")}>Items seleccionados</p>
              <p className={cn("text-lg font-black transition-colors", isDark ? "text-white" : "text-slate-900")}>{selectedItems.length} <span className={cn("text-xs font-medium", isDark ? "text-white/30" : "text-slate-400")}>unidades</span></p>
            </div>
            <div className="text-right">
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors", isDark ? "text-white/30" : "text-slate-400")}>Monto Total</p>
              <p className="text-[#0066B3] text-lg font-bold tracking-tighter">{fmt(totalProductos)}</p>
            </div>
          </div>
        </div>

        {/* COLUMNA 3 — Calculadora */}
        <div className={cn("rounded-2xl p-6 flex flex-col gap-4 border shadow-2xl transition-all duration-300 h-full overflow-hidden", 
          isDark ? "bg-slate-900/60 border-[#0066B3]/20 shadow-[#0066B3]/5" : "bg-slate-100 border-slate-200 shadow-slate-200/50")}>

          {/* Totales top */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn("rounded-2xl p-4 border transition-all duration-300", isDark ? "bg-black/40 border-white/5" : "bg-white border-slate-200")}>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors", isDark ? "text-white/30" : "text-slate-400")}>Total</p>
              <p className={cn("text-xl font-bold tracking-tighter transition-colors", isDark ? "text-white" : "text-slate-900")}>{fmt(totalProductos)}</p>
            </div>
            <div className={cn("border rounded-2xl p-4 shadow-inner transition-all duration-300", 
              isDark ? "bg-[#0066B3]/20 border-[#0066B3]/30" : "bg-[#0066B3]/10 border-[#0066B3]/20")}>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors", isDark ? "text-[#0066B3]/70" : "text-[#0066B3]")}>Cuota/Mes</p>
              <p className="text-xl font-bold text-[#0066B3] tracking-tighter">{fmt(cuotaMensual)}</p>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-6">
              <div>
                <label className={cn("text-[10px] font-black tracking-[0.2em] uppercase block mb-3 transition-colors", isDark ? "text-white/40" : "text-slate-400")}>
                  Inicial entregado <span className="text-[#0066B3]/50">(RD$)</span>
                </label>
                <div className="relative">
                    <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors", isDark ? "text-white/20" : "text-slate-300")}>$</span>
                    <input
                    value={inicialDado}
                    onChange={e => handleInicialChange(e.target.value)}
                    placeholder="0.00"
                    className={cn("w-full pl-8 pr-4 py-4 rounded-2xl border outline-none transition-all font-mono text-base md:text-sm", 
                      isDark ? "bg-black/40 border-white/5 text-white focus:border-[#0066B3]/50" : "bg-white border-slate-300 text-slate-900 focus:border-[#0066B3]/30")}
                    />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className={cn("text-[10px] font-black tracking-[0.2em] uppercase transition-colors", isDark ? "text-white/40" : "text-slate-400")}>
                    Porcentaje inicial
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={porcentajeInput}
                      onChange={e => handlePorcentajeInput(e.target.value)}
                      onBlur={() => {
                        const num = parseFloat(porcentajeInput);
                        if (isNaN(num) || num < 4) {
                          setPorcentajeInput("4");
                          setPorcentaje(4);
                        }
                      }}
                      className={cn("w-20 text-center px-2 py-1 rounded-lg border outline-none text-sm font-bold transition-all", 
                        isDark ? "bg-slate-800 border-[#0066B3]/30 text-[#0066B3]" : "bg-white border-slate-300 text-slate-900")}
                    />
                    <span className="text-[#0066B3] font-black text-sm">%</span>
                  </div>
                </div>
                <input
                  type="range" min={4} max={100}
                  step={0.01}
                  value={porcentaje}
                  onChange={e => handlePorcentajeChange(Number(e.target.value))}
                  className={cn("w-full h-2 md:h-1.5 rounded-lg appearance-none cursor-pointer accent-[#0066B3] transition-all", 
                    isDark ? "bg-slate-800" : "bg-slate-200")}
                />
                <div className={cn("flex justify-between text-[9px] font-black mt-3 uppercase tracking-wider transition-colors", 
                  isDark ? "text-white/20" : "text-slate-300")}>
                  <span>Min 4%</span><span>25%</span><span>50%</span><span>75%</span><span>Full 100%</span>
                </div>
              </div>
          </div>

          {/* Desglose */}
          <div className={cn("flex-1 space-y-2 border-t pt-4 overflow-y-auto pr-1 custom-scrollbar transition-all duration-300", isDark ? "border-white/10" : "border-slate-200")}>
            {[
              { label: 'Valor productos', value: fmt(totalProductos) },
              { label: 'Inicial aplicado', value: fmt(inicialDadoNum) },
              { label: 'Equivalencia %', value: `${porcentaje}%` },
              { label: 'Pago de entrada', value: fmt(pagoInicial) },
              { label: 'Monto a financiar', value: fmt(montoFinanciar) },
              { label: 'Cuota mensual (4%)', value: fmt(cuotaMensual), highlight: true },
              { label: 'Plan de pagos', value: `${numeroCuotas} meses` },
            ].map(row => (
              <div key={row.label}
                className={cn("flex justify-between items-center py-1 transition-all duration-300", 
                  row.highlight && (isDark ? 'bg-[#0066B3]/5 px-4 rounded-xl border border-[#0066B3]/10 py-2 mt-2 mb-1' : 'bg-[#0066B3]/5 px-4 rounded-xl border border-[#0066B3]/20 py-2 mt-2 mb-1')
                )}>
                <span className={row.highlight ? (isDark ? 'text-white font-bold text-xs uppercase tracking-tight' : 'text-slate-900 font-bold text-xs uppercase tracking-tight') : (isDark ? 'text-white/30 text-[9px] font-bold uppercase tracking-widest' : 'text-slate-400 text-[9px] font-bold uppercase tracking-widest')}>
                  {row.label}
                </span>
                <span className={row.highlight ? 'text-[#0066B3] font-black text-lg tracking-tighter' : (isDark ? 'text-white text-xs font-mono font-bold' : 'text-slate-900 text-xs font-mono font-bold')}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
