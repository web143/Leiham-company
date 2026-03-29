"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Check, X, Gift, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

const TABLA_PAGOS = [
  { cuotas: 2, pct: 51.95 }, { cuotas: 3, pct: 35.07 }, { cuotas: 4, pct: 26.64 },
  { cuotas: 5, pct: 21.58 }, { cuotas: 6, pct: 18.21 }, { cuotas: 7, pct: 15.80 },
  { cuotas: 8, pct: 14.00 }, { cuotas: 9, pct: 12.60 }, { cuotas: 10, pct: 11.48 },
  { cuotas: 11, pct: 10.56 }, { cuotas: 12, pct: 9.80 }, { cuotas: 13, pct: 9.16 },
  { cuotas: 14, pct: 8.61 }, { cuotas: 15, pct: 8.13 }, { cuotas: 16, pct: 7.71 },
  { cuotas: 17, pct: 7.35 }, { cuotas: 18, pct: 7.02 }, { cuotas: 19, pct: 6.73 },
  { cuotas: 20, pct: 6.47 }, { cuotas: 21, pct: 6.23 }, { cuotas: 22, pct: 6.02 },
  { cuotas: 23, pct: 5.82 }, { cuotas: 24, pct: 5.65 }, { cuotas: 25, pct: 5.48 },
  { cuotas: 26, pct: 5.33 }, { cuotas: 27, pct: 5.19 }, { cuotas: 28, pct: 5.06 },
  { cuotas: 29, pct: 4.95 }, { cuotas: 30, pct: 4.83 }, { cuotas: 31, pct: 4.73 },
  { cuotas: 32, pct: 4.63 }, { cuotas: 33, pct: 4.54 }, { cuotas: 34, pct: 4.46 },
  { cuotas: 35, pct: 4.38 }, { cuotas: 36, pct: 4.30 }, { cuotas: 37, pct: 4.23 },
  { cuotas: 38, pct: 4.16 }, { cuotas: 39, pct: 4.10 }, { cuotas: 40, pct: 4.04 },
  { cuotas: 41, pct: 4.00 },
];

export default function CalculadoraFinanciamiento({ isDark = true }: { isDark?: boolean }) {
  const [selectedItems, setSelectedItems] = useState<typeof products>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [inicialDado, setInicialDado] = useState("");
  const [porcentaje, setPorcentaje] = useState(4);
  const [porcentajeInput, setPorcentajeInput] = useState("4");
  const [selectedRegalos, setSelectedRegalos] = useState<typeof products>([]);
  const [cuotaInput, setCuotaInput] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const mobileChipsRef = useRef<HTMLDivElement>(null);

  const toggleRegalo = (p: typeof products[0]) => {
    setSelectedRegalos(prev =>
      prev.some(i => i.code === p.code && i.name === p.name)
        ? prev.filter(i => !(i.code === p.code && i.name === p.name))
        : [...prev, p]
    );
  };

  const isRegaloSelected = (p: typeof products[0]) =>
    selectedRegalos.some(i => i.code === p.code && i.name === p.name);

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

  const getCantidad = (p: typeof products[0]) =>
    selectedItems.filter(i => i.code === p.code && i.name === p.name).length;

  const addOne = (p: typeof products[0]) => {
    setSelectedItems(prev => [...prev, p]);
  };

  const removeOne = (p: typeof products[0]) => {
    setSelectedItems(prev => {
      const idx = prev.findLastIndex(i => i.code === p.code && i.name === p.name);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const isSelected = (p: typeof products[0]) => getCantidad(p) > 0;

  // toggle kept for compatibility (not used in product list anymore)
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
  const inicialDadoNum = parseFloat(inicialDado.replace(/[^0-9.]/g, '')) || 0;
  const pagoInicial = Math.min(inicialDadoNum, totalProductos);
  const montoFinanciar = Math.max(0, totalProductos - pagoInicial);

  // Precio sin ITBIS (suma de p.price de los items seleccionados)
  const precioSinItbis = selectedItems.reduce((s, p) => s + p.price, 0);

  // ITBIS total (suma de p.itbis de los items seleccionados)
  const itbisTotal = selectedItems.reduce((s, p) => s + p.itbis, 0);

  // Tasa de interés anual fija
  const TASA_INTERES_ANUAL = 26;

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

  const cuotaInputNum = parseFloat(cuotaInput.replace(/[^0-9.]/g, '')) || 0;

  const pctEscrito = montoFinanciar > 0 && cuotaInputNum > 0
    ? (cuotaInputNum / montoFinanciar) * 100
    : 0;

  const filaActiva = mesSeleccionado
    ? TABLA_PAGOS.find(f => f.cuotas === mesSeleccionado) ?? null
    : pctEscrito > 0
    ? TABLA_PAGOS.reduce((prev, curr) =>
        Math.abs(curr.pct - pctEscrito) < Math.abs(prev.pct - pctEscrito) ? curr : prev)
    : null;

  const filaAnterior = pctEscrito > 0 && !mesSeleccionado
    ? TABLA_PAGOS.filter(f => f.pct >= pctEscrito).slice(-1)[0] ?? null
    : null;
  const filaSiguiente = pctEscrito > 0 && !mesSeleccionado
    ? TABLA_PAGOS.find(f => f.pct < pctEscrito) ?? null
    : null;

  const bajoDeMinimoMsg = pctEscrito > 0 && pctEscrito < 4.00 && !mesSeleccionado;
  const cuotaMinimaRD = montoFinanciar * 0.04;

  const cuotaDelDropdown = filaActiva ? montoFinanciar * (filaActiva.pct / 100) : 0;

  const handleMesChange = (cuotas: number) => {
    setMesSeleccionado(cuotas);
    setCuotaInput("");
  };

  const handleCuotaChange = (value: string) => {
    setCuotaInput(value);
    setMesSeleccionado(null);
  };

  useEffect(() => {
    setCuotaInput("");
    setMesSeleccionado(null);
  }, [selectedItems]);

  return (
    <section className={cn("w-full min-h-screen transition-colors duration-200 ease-out", isDark ? "bg-black" : "bg-white")}>
      
      <div className="text-center py-4 px-4">
        <p className="text-[#0066B3] text-[11px] tracking-[0.25em] uppercase mb-2 font-medium">Leiham Company</p>
        <h2 className={cn("text-2xl font-semibold tracking-tight transition-colors duration-200 ease-out", isDark ? "text-white" : "text-slate-900")}>
          Calculadora de <span className="text-[#0066B3]">Financiamiento</span>
        </h2>
      </div>

      {/* Layout cuatro columnas */}
      <div className="max-w-[1400px] mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-[220px_1fr_300px_300px] gap-4 h-auto md:h-[680px]">

        {/* Chips móvil — solo visible en móvil */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 custom-scrollbar"
             style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <button onClick={() => setActiveCategory(null)}
            className={cn("flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold transition duration-200 ease-out active:scale-[0.97]", 
              !activeCategory ? 'bg-[#0066B3] text-white shadow-sm shadow-[#0066B3]/30' : (isDark ? 'bg-white/8 text-white/60 hover:text-white/90' : 'bg-slate-100 text-slate-500 hover:text-slate-800')
            )}>
            Todos
          </button>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}
              className={cn("flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition duration-200 ease-out active:scale-[0.97]", 
                activeCategory === cat ? 'bg-[#0066B3] text-white shadow-sm shadow-[#0066B3]/30' : (isDark ? 'bg-white/8 text-white/60 hover:text-white/90' : 'bg-slate-100 text-slate-500 hover:text-slate-800')
              )}>
              {cat}
              {selectedItems.filter(i => i.category === cat).length > 0 &&
                <span className="ml-1 opacity-80">·{selectedItems.filter(i => i.category === cat).length}</span>}
            </button>
          ))}
        </div>

        {/* COLUMNA 1 — Navegación / categorías (Solo Desktop) */}
        <div className={cn("hidden md:flex rounded-2xl p-4 flex-col h-full overflow-hidden transition duration-200 ease-out", isDark ? "bg-white/[0.03] border border-white/8" : "bg-slate-50 border border-slate-200/80")}>
          <h3 className={cn("font-semibold text-base mb-4 tracking-tight transition-colors duration-200 ease-out", isDark ? "text-white" : "text-slate-900")}>Categorías</h3>
          <div className="space-y-0.5 flex-1 overflow-y-auto pr-1 custom-scrollbar" data-lenis-prevent>
            {allCategories.map(cat => {
              const count = selectedItems.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn("w-full text-left px-3 py-2 rounded-xl text-[11px] flex justify-between items-center transition duration-200 ease-out cursor-pointer", 
                    activeCategory === cat 
                      ? (isDark ? 'bg-white/10 text-white font-medium' : 'bg-[#0066B3]/8 text-[#0066B3] font-medium') 
                      : (isDark ? 'text-white/40 hover:text-white/80 hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')
                  )}
                >
                  <span className="truncate pr-2">{cat}</span>
                  {count > 0 && (
                    <span className="bg-[#0066B3] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2 — Lista de productos con buscador */}
        <div className={cn("rounded-2xl p-4 flex flex-col h-auto md:h-full overflow-hidden transition duration-200 ease-out", isDark ? "bg-white/[0.03] border border-white/8" : "bg-slate-50 border border-slate-200/80")}>

          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("font-semibold text-base tracking-tight transition-colors duration-200 ease-out", isDark ? "text-white" : "text-slate-900")}>Productos</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => { setIsClearing(true); setSelectedItems([]); setTimeout(() => setIsClearing(false), 350); }}
                className={cn("text-[11px] font-medium transition-colors", isDark ? "text-white/30 hover:text-red-400" : "text-slate-400 hover:text-red-500")}
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Buscador */}
          <div className="relative mb-5">
            <Search className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5", isDark ? "text-white/25" : "text-slate-400")} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto o código..."
              className={cn("w-full pl-10 pr-9 py-3 rounded-xl border outline-none text-[13px] transition duration-200 ease-out", 
                isDark 
                  ? "bg-white/5 border-white/8 text-white placeholder:text-white/20 focus:border-[#0066B3]/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(0,102,179,0.12)]" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0066B3]/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,102,179,0.08)]")}
            />
            {search && (
              <button onClick={() => setSearch("")} className={cn("absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer", isDark ? "text-white/20 hover:text-white/60" : "text-slate-300 hover:text-slate-600")}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[300px] md:max-h-[420px] custom-scrollbar" data-lenis-prevent
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: isDark ? 'rgba(255,255,255,0.06) transparent' : 'rgba(0,0,0,0.08) transparent' 
            }}>
            {visibleCategories.length === 0 ? (
                <div className="text-center py-20">
                    <p className={cn("text-sm transition-colors", isDark ? "text-white/20" : "text-slate-400")}>No se encontraron productos.</p>
                </div>
            ) : visibleCategories.map(cat => (
              <div 
                key={cat} 
                ref={el => { categoryRefs.current[cat] = el; }}
                className="mb-4 last:mb-0"
              >
                <p className={cn("text-[10px] font-semibold uppercase tracking-[0.15em] py-2 px-2 sticky top-0 backdrop-blur-md rounded-lg z-10 mb-1 border-b transition duration-200 ease-out", 
                  isDark ? "text-white/25 bg-black/60 border-white/6" : "text-slate-400 bg-white/95 border-slate-100")}>
                  {cat}
                </p>
                <div className="space-y-0.5">
                    {filtered.filter(p => p.category === cat).map((product, productIdx) => (
                        <motion.div
                            key={product.code + product.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: Math.min(productIdx * 0.03, 0.25), ease: [0.23, 1, 0.32, 1] }}
                            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 ease-out", 
                                getCantidad(product) > 0
                                    ? (isDark ? 'bg-[#0066B3]/12 ring-1 ring-[#0066B3]/25' : 'bg-white ring-1 ring-[#0066B3]/30 shadow-sm') 
                                    : (isDark ? 'hover:bg-white/5' : 'bg-white border border-slate-100 shadow-sm hover:border-[#0066B3]/20 hover:shadow-md')
                            )}
                        >
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-[13px] truncate transition-colors", isDark ? "text-white/90" : "text-slate-800")}>{product.name}</p>
                                <div className="flex gap-3 mt-0.5">
                                    {product.code !== '-' && (
                                        <p className={cn("text-[11px] transition-colors", isDark ? "text-white/25" : "text-slate-400")}>{product.code}</p>
                                    )}
                                    <p className={cn("text-[11px] transition-colors", isDark ? "text-white/25" : "text-slate-400")}>ITBIS: {fmt(product.itbis)}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 mr-2">
                                <p className={cn("text-[13px] font-semibold", getCantidad(product) > 0 ? 'text-[#0066B3]' : (isDark ? 'text-white/70' : 'text-slate-700'))}>{fmt(product.total)}</p>
                                <p className={cn("text-[11px] transition-colors", isDark ? "text-white/20" : "text-slate-400")}>sin ITBIS: {fmt(product.price)}</p>
                            </div>
                            {/* Controles de cantidad */}
                            <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              {getCantidad(product) > 0 && (
                                <>
                                  <button
                                    onClick={() => removeOne(product)}
                                    className={cn("w-6 h-6 rounded-lg flex items-center justify-center transition text-sm font-bold",
                                      isDark ? "bg-white/8 text-white/60 hover:bg-red-500/40 hover:text-red-300" : "bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500")}
                                  >
                                    −
                                  </button>
                                  <span className="text-[#0066B3] font-bold text-sm w-5 text-center">
                                    {getCantidad(product)}
                                  </span>
                                </>
                              )}
                              <button
                                onClick={() => addOne(product)}
                                className={cn("w-6 h-6 rounded-lg flex items-center justify-center transition text-sm font-bold",
                                  getCantidad(product) > 0
                                    ? 'bg-[#0066B3] text-white hover:bg-[#0066B3]/80'
                                    : (isDark ? 'bg-white/8 text-white/40 hover:bg-[#0066B3]/40 hover:text-white' : 'bg-slate-100 text-slate-400 hover:bg-[#0066B3]/15 hover:text-[#0066B3]')
                                )}
                              >
                                +
                              </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer total */}
          <div className={cn("border-t pt-3 mt-3 flex justify-between items-center transition duration-200 ease-out", isDark ? "border-white/6" : "border-slate-100")}>
            <div>
              <p className={cn("text-[11px] font-medium mb-0.5 transition-colors", isDark ? "text-white/30" : "text-slate-400")}>Seleccionados</p>
              <p className={cn("text-base font-semibold transition-colors", isDark ? "text-white" : "text-slate-900")}>{selectedItems.length} <span className={cn("text-[11px] font-normal", isDark ? "text-white/30" : "text-slate-400")}>productos</span></p>
            </div>
            <div className="text-right">
              <p className={cn("text-[11px] font-medium mb-0.5 transition-colors", isDark ? "text-white/30" : "text-slate-400")}>Total</p>
              <p className="text-[#0066B3] text-base font-semibold tracking-tight">{fmt(totalProductos)}</p>
            </div>
          </div>
        </div>

        {/* COLUMNA 3 — Calculadora (Unificada para todos los tamaños) */}
        <div className={cn("rounded-2xl p-5 flex flex-col gap-4 border transition duration-200 ease-out h-full overflow-y-auto custom-scrollbar", 
          isDark ? "bg-white/[0.03] border-white/8 shadow-2xl shadow-black/30" : "bg-white border-slate-200/80 shadow-xl shadow-slate-100")} data-lenis-prevent>

          {/* Card Total — estilo Apple: número flotante, sin fondo saturado */}
          <div className={cn("rounded-2xl px-5 py-4 border transition duration-200 ease-out", isDark ? "bg-white/[0.04] border-white/8" : "bg-slate-50 border-slate-100")}>
            <p className={cn("text-[11px] font-medium mb-1 transition-colors", isDark ? "text-white/35" : "text-slate-400")}>Total a pagar</p>
            <motion.p
              animate={{ filter: isClearing ? "blur(4px)" : "blur(0px)", opacity: isClearing ? 0.3 : 1 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className={cn("text-3xl font-light tracking-tight", isDark ? "text-white" : "text-slate-900")}
            >{fmt(totalProductos)}</motion.p>
          </div>

          {/* Inputs - Bloque 1: Inicial */}
          <div className="space-y-5">
              <div>
                <label className={cn("text-[11px] font-medium block mb-2 transition-colors", isDark ? "text-white/40" : "text-slate-500")}>
                  Inicial entregado <span className={isDark ? "text-white/20" : "text-slate-300"}>RD$</span>
                </label>
                <div className="relative">
                    <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors", isDark ? "text-white/20" : "text-slate-300")}>$</span>
                    <input
                    value={inicialDado}
                    onChange={e => handleInicialChange(e.target.value)}
                    placeholder="0.00"
                    className={cn("w-full pl-8 pr-4 py-3.5 rounded-xl border outline-none transition font-mono text-[15px] md:text-sm", 
                      isDark 
                        ? "bg-white/5 border-white/8 text-white placeholder:text-white/15 focus:border-[#0066B3]/60 focus:shadow-[0_0_0_3px_rgba(0,102,179,0.12)]" 
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-[#0066B3]/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,102,179,0.08)]")}
                    />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className={cn("text-[11px] font-medium transition-colors", isDark ? "text-white/40" : "text-slate-500")}>
                    Porcentaje inicial
                  </label>
                  <div className="flex items-center gap-1.5">
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
                      className={cn("w-16 text-center px-2 py-1 rounded-lg border outline-none text-sm font-semibold transition", 
                        isDark ? "bg-white/8 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800")}
                    />
                    <span className={cn("text-sm font-medium", isDark ? "text-white/40" : "text-slate-500")}>%</span>
                  </div>
                </div>
                <input
                  type="range" min={4} max={100}
                  step={0.01}
                  value={porcentaje}
                  onChange={e => handlePorcentajeChange(Number(e.target.value))}
                  className={cn("w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#0066B3] transition", 
                    isDark ? "bg-white/10" : "bg-slate-200")}
                />
                <div className={cn("flex justify-between text-[10px] font-medium mt-2 transition-colors", 
                  isDark ? "text-white/15" : "text-slate-300")}>
                  <span>4%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
          </div>

          {/* Desglose */}
          <div className={cn("space-y-2 border-t pt-3 transition duration-200 ease-out", isDark ? "border-white/10" : "border-slate-200")}>
            {[
              { label: 'Precio de compra', value: fmt(precioSinItbis) },
              { label: 'ITBIS', value: fmt(itbisTotal) },
              { label: 'Tasa de interés anual', value: `${TASA_INTERES_ANUAL}%` },
              { label: 'Valor productos', value: fmt(totalProductos) },
              { label: 'Inicial aplicado', value: fmt(inicialDadoNum) },
              { label: 'Equivalencia %', value: `${porcentaje.toFixed(2)}%` },
              { label: 'Monto a financiar', value: fmt(montoFinanciar) },
              ...(filaActiva && montoFinanciar > 0 && !bajoDeMinimoMsg ? [
                { label: 'Plan de pagos', value: `${filaActiva.cuotas} meses — ${filaActiva.pct.toFixed(2)}%`, highlight: true },
              ] : []),
            ].map((row) => (
              <div key={row.label}
                className="flex justify-between items-center py-1 transition duration-200 ease-out">
                <span className={cn(isDark ? 'text-white/30 text-[9px] font-bold uppercase tracking-widest' : 'text-slate-400 text-[9px] font-bold uppercase tracking-widest')}>
                  {row.label}
                </span>
                <span className={cn(
                  'text-xs font-mono font-bold',
                  (row as { highlight?: boolean }).highlight
                    ? 'text-[#0066B3]'
                    : isDark ? 'text-white' : 'text-slate-900'
                )}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Separador */}
          <div className={cn("border-t pt-1", isDark ? "border-white/5" : "border-slate-200")} />

          {/* Inputs - Bloque 2: Plan de cuotas */}
          <div className="space-y-4">
              {/* Dropdown meses */}
              <div>
                <label className={cn("text-[11px] font-medium block mb-2",
                  isDark ? "text-white/40" : "text-slate-500")}>
                  Plan de pagos
                </label>
                <div className="relative">
                  <select
                    value={mesSeleccionado ?? ""}
                    onChange={e => handleMesChange(Number(e.target.value))}
                    className={cn("w-full pl-4 pr-9 py-3 rounded-xl border outline-none text-[13px] font-medium transition cursor-pointer appearance-none",
                      isDark
                        ? "bg-white/5 border-white/8 text-white focus:border-[#0066B3]/60 focus:shadow-[0_0_0_3px_rgba(0,102,179,0.12)]"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0066B3]/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,102,179,0.08)]")}
                  >
                    <option value="">— Seleccionar meses —</option>
                    {TABLA_PAGOS.map(f => (
                      <option key={f.cuotas} value={f.cuotas}>
                        {f.cuotas} meses — {f.pct.toFixed(2)}%
                      </option>
                    ))}
                  </select>
                  {/* Flecha personalizada */}
                  <svg className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", isDark ? "text-white/30" : "text-slate-400")} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Input cuota mensual */}
              <div>
                <label className={cn("text-[11px] font-medium block mb-2",
                  isDark ? "text-white/40" : "text-slate-500")}>
                  O escribe la cuota mensual <span className={isDark ? "text-white/20" : "text-slate-300"}>RD$</span>
                </label>
                <div className="relative">
                  <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 text-sm",
                    isDark ? "text-white/20" : "text-slate-300")}>$</span>
                  <input
                    value={cuotaInput}
                    onChange={e => handleCuotaChange(e.target.value)}
                    placeholder="0.00"
                    className={cn("w-full pl-8 pr-4 py-3 rounded-xl border outline-none font-mono text-[13px] transition",
                      isDark
                        ? "bg-white/5 border-white/8 text-white placeholder:text-white/15 focus:border-[#0066B3]/60 focus:shadow-[0_0_0_3px_rgba(0,102,179,0.12)]"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-[#0066B3]/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,102,179,0.08)]")}
                  />
                </div>
              </div>

              {/* Mensaje cuando escribe cuota — bajo mínimo */}
              {bajoDeMinimoMsg && montoFinanciar > 0 && (
                <div className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs space-y-1">
                  <p>⛔ Porcentaje escrito: <strong>{pctEscrito.toFixed(2)}%</strong></p>
                  <p>El mínimo permitido es <strong>4.00% (41 meses)</strong></p>
                  <p>Cuota mínima: <strong>{fmt(cuotaMinimaRD)}</strong></p>
                </div>
              )}

              {/* Mensaje cuando escribe cuota — válida */}
              {pctEscrito > 0 && !bajoDeMinimoMsg && !mesSeleccionado && montoFinanciar > 0 && (
                <div className={cn("px-3 py-2.5 rounded-xl border text-xs space-y-1.5",
                  isDark ? "bg-[#0066B3]/10 border-[#0066B3]/20" : "bg-[#0066B3]/5 border-[#0066B3]/20")}>
                  
                  <p className={isDark ? "text-white/60" : "text-slate-600"}>
                    Tu cuota representa el{" "}
                    <span className="text-[#0066B3] font-bold">{pctEscrito.toFixed(2)}%</span>
                    {" "}del monto a financiar
                  </p>

                  {filaAnterior && filaSiguiente && (
                    <div className={cn("space-y-1 pt-1 border-t", isDark ? "border-white/10" : "border-slate-200")}>
                      <p className={isDark ? "text-white/40" : "text-slate-400"}>Cae entre:</p>
                      <div className="flex justify-between items-center">
                        <span className={isDark ? "text-white/60" : "text-slate-600"}>
                          {filaAnterior.cuotas} meses — {filaAnterior.pct.toFixed(2)}%
                        </span>
                        <span className="text-[#0066B3] font-bold">
                          {fmt(montoFinanciar * (filaAnterior.pct / 100))}/mes
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDark ? "text-white/60" : "text-slate-600"}>
                          {filaSiguiente.cuotas} meses — {filaSiguiente.pct.toFixed(2)}%
                        </span>
                        <span className="text-[#0066B3] font-bold">
                          {fmt(montoFinanciar * (filaSiguiente.pct / 100))}/mes
                        </span>
                      </div>
                    </div>
                  )}

                  {filaActiva && (
                    <div className={cn("flex justify-between items-center pt-1 border-t font-bold",
                      isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-900")}>
                      <span>Opción más cercana: {filaActiva.cuotas} meses — {filaActiva.pct.toFixed(2)}%</span>
                      <span className="text-[#0066B3]">{fmt(montoFinanciar * (filaActiva.pct / 100))}/mes</span>
                    </div>
                  )}
                </div>
              )}

              {/* Resultado del dropdown */}
              {mesSeleccionado && filaActiva && montoFinanciar > 0 && (
                <div className={cn("px-4 py-3 rounded-xl border transition duration-200 ease-out",
                  isDark ? "bg-[#0066B3]/10 border-[#0066B3]/20 shadow-lg shadow-[#0066B3]/5" : "bg-[#0066B3]/5 border-[#0066B3]/20 shadow-md shadow-slate-200")}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors", isDark ? "text-[#0066B3]" : "text-[#0066B3]")}>
                        {filaActiva.cuotas} meses — {filaActiva.pct.toFixed(2)}%
                      </p>
                      <span className={isDark ? "text-white/50 text-xs" : "text-slate-500 text-xs"}>Cuota mensual</span>
                    </div>
                    <span className="text-[#0066B3] font-black text-xl">{fmt(cuotaDelDropdown)}</span>
                  </div>
                </div>
              )}
          </div>


        </div>

        {/* COLUMNA 4 — Regalos */}
        <div className={cn("rounded-2xl p-4 flex flex-col border transition duration-200 ease-out h-full overflow-hidden",
          isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-200/80")}>
          
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
              isDark ? "bg-white/8" : "bg-white shadow-sm border border-slate-100")}>
              <Gift className={cn("w-3.5 h-3.5", isDark ? "text-white/60" : "text-slate-500")} />
            </div>
            <h3 className={cn("text-[13px] font-semibold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Regalos
            </h3>
            {totalProductos > 0 && (
              <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full",
                isDark ? "text-white/50 bg-white/6 border border-white/8" : "text-slate-500 bg-white border border-slate-200 shadow-sm")}>
                Hasta {fmt(totalProductos * 0.10)}
              </span>
            )}
          </div>

          {totalProductos === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center",
                isDark ? "bg-white/5" : "bg-slate-100")}>
                <Gift className={cn("w-5 h-5", isDark ? "text-white/20" : "text-slate-300")} />
              </div>
              <p className={cn("text-[11px] text-center leading-relaxed", isDark ? "text-white/25" : "text-slate-400")}>
                Selecciona productos para<br/>ver los regalos disponibles
              </p>
            </div>
          ) : (() => {
            const EXCLUIR = ['aro', 'reparac', 'reemplaz', 'tapa'];
            const maxR = totalProductos * 0.10;
            const totalRegalos = selectedRegalos.reduce((s, p) => s + p.total, 0);
            const porcentajeUsado = totalProductos > 0 ? (totalRegalos / totalProductos) * 100 : 0;
            const cerca = totalRegalos > 0 && porcentajeUsado >= 7 && totalRegalos <= maxR;
            const excedido = totalRegalos > maxR;

            const REGALOS_VOLUMEN = [
              'PR1044', 'PR0196', 'PR1675', 'PR1685',
              'PR2120', 'PR2129', 'PR0008', 'PR0021',
              'CO2124', 'CU0825'
            ];

            const elegiblesNormales = products.filter(p =>
              !EXCLUIR.some(ex =>
                p.category.toLowerCase().includes(ex) ||
                p.name.toLowerCase().includes(ex)
              ) && p.total <= maxR && !REGALOS_VOLUMEN.includes(p.code)
            );

            // Volumen siempre se muestran, sin importar maxR o EXCLUIR
            const elegiblesVolumen = products.filter(p =>
              REGALOS_VOLUMEN.includes(p.code)
            );

            // Combinar — volumen siempre primero
            const elegibles = [...elegiblesVolumen, ...elegiblesNormales];

            return (
              <div className="flex flex-col flex-1 overflow-hidden gap-3">

                {/* Alerta */}
                {selectedRegalos.length > 0 && (
                  <div className={cn("flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium flex-shrink-0 gap-2",
                    excedido
                      ? (isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600')
                      : cerca
                      ? (isDark ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-amber-50 border border-amber-200 text-amber-700')
                      : (isDark ? 'bg-white/5 border border-white/8 text-white/60' : 'bg-white border border-slate-100 text-slate-600 shadow-sm')
                  )}>
                    <div className="flex items-center gap-1.5">
                      {excedido
                        ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        : cerca
                        ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        : <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span>
                        {excedido
                          ? `Excede ${fmt(totalRegalos - maxR)}`
                          : cerca
                          ? `Quedan ${fmt(maxR - totalRegalos)}`
                          : `${selectedRegalos.length} seleccionado${selectedRegalos.length > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <span className="font-semibold">{fmt(totalRegalos)}</span>
                  </div>
                )}

                {/* Nota política */}
                <p className={cn("text-[10px] flex-shrink-0 leading-relaxed", isDark ? "text-white/20" : "text-slate-400")}>
                  Máx. 10% · Solo descuento O regalo · 6-12 meses: no aplica
                </p>

                {/* Lista vertical scrolleable */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1" data-lenis-prevent
                  style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? 'rgba(255,255,255,0.06) transparent' : 'rgba(0,0,0,0.08) transparent' }}>
                  {elegibles.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                    {elegibles.map((p, giftIdx) => {
                    const sel = isRegaloSelected(p);
                    const totalRegalosActual = selectedRegalos.reduce((s, r) => s + r.total, 0);
                    const fueraDeRango = REGALOS_VOLUMEN.includes(p.code) && p.total > maxR;
                    const excederiaSiAgrego = !sel && (totalRegalosActual + p.total) > maxR;
                    return (
                      <motion.div
                        key={p.code + p.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15, delay: Math.min(giftIdx * 0.03, 0.2), ease: [0.23, 1, 0.32, 1] }}
                        onClick={() => !fueraDeRango && (!excederiaSiAgrego || sel) ? toggleRegalo(p) : null}
                        className={cn(
                          "px-3 py-2 rounded-xl border transition cursor-pointer relative active:scale-[0.99]",
                          fueraDeRango
                            ? (isDark ? 'bg-yellow-500/5 border-yellow-500/10 opacity-50 cursor-not-allowed' : 'bg-yellow-50 border-yellow-100 opacity-50 cursor-not-allowed')
                            : sel
                            ? 'bg-[#0066B3]/20 border-[#0066B3]/40'
                            : excederiaSiAgrego
                            ? (isDark ? 'opacity-30 border-transparent cursor-not-allowed' : 'opacity-30 border-transparent cursor-not-allowed')
                            : REGALOS_VOLUMEN.includes(p.code)
                            ? (isDark ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40' : 'bg-yellow-50 border-yellow-200 hover:border-yellow-400')
                            : (isDark ? 'bg-white/[0.04] border border-white/6 hover:bg-white/[0.07] hover:border-white/10' : 'bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200')
                        )}>
                        
                        {/* Badge de volumen */}
                        {REGALOS_VOLUMEN.includes(p.code) && (
                          <span className={cn("absolute -top-1.5 -right-1.5 text-[9px] font-black text-black px-1.5 py-0.5 rounded-full leading-none",
                            fueraDeRango ? 'bg-yellow-500/50' : 'bg-yellow-500'
                          )}>
                            ⭐ VOL
                          </span>
                        )}

                        <div className="flex justify-between items-start">
                          <p className={cn("text-xs font-semibold leading-tight flex-1 mr-2",
                            sel ? 'text-[#0066B3]' : 
                            REGALOS_VOLUMEN.includes(p.code) 
                              ? (isDark ? 'text-yellow-400/90' : 'text-yellow-700')
                              : (isDark ? "text-white/80" : "text-slate-700"))}>
                            {p.name}
                          </p>
                          {sel && <Check className="w-3 h-3 text-[#0066B3] flex-shrink-0 mt-0.5" />}
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          <p className={cn("text-[10px]", isDark ? "text-white/20" : "text-slate-400")}>{p.category}</p>
                          <p className={cn("text-xs font-bold", sel ? 'text-[#0066B3]' : 'text-[#0066B3]')}>{fmt(p.total)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                    </AnimatePresence>
                  ) : (
                    <p className={cn("text-xs text-center py-4", isDark ? "text-white/20" : "text-slate-400")}>
                      Ningún producto califica
                    </p>
                  )}
                  </div>

                <div className={cn("flex items-start gap-1.5 flex-shrink-0 pt-1",
                  isDark ? "text-white/20" : "text-slate-400")}>
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">
                    Extractor, Power Blender, Easy Release y Purificador: máx. 5%
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
