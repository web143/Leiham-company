"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Check, X, Gift, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

interface Props {
  isDark?: boolean;
  externalItems?: any[];
}

export default function CalculadoraFinanciamiento({ isDark = true, externalItems = [] }: Props) {
  const [selectedItems, setSelectedItems] = useState<(typeof products[0] & { cantidad?: number })[]>([]);

  useEffect(() => {
    if (externalItems.length > 0) {
      const itemsConCantidad = new Map<string, { item: any; cantidad: number }>();
      externalItems.forEach(p => {
        const key = `${p.code}_${p.name}`;
        if (itemsConCantidad.has(key)) {
          itemsConCantidad.get(key)!.cantidad++;
        } else {
          itemsConCantidad.set(key, { item: p, cantidad: 1 });
        }
      });
      
      const newItems = Array.from(itemsConCantidad.values()).map(({ item, cantidad }) => ({
        ...item,
        cantidad,
      }));
      
      setSelectedItems(newItems);
    } else if (externalItems.length === 0 && selectedItems.length > 0) {
      setSelectedItems([]);
    }
  }, [externalItems]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [inicialDado, setInicialDado] = useState("");
  const [porcentaje, setPorcentaje] = useState(4);
  const [porcentajeInput, setPorcentajeInput] = useState("4");
  const [selectedRegalos, setSelectedRegalos] = useState<typeof products>([]);
  const [cuotaInput, setCuotaInput] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
    if (activeCategory === cat) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory(cat);
    setTimeout(() => categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const getCantidad = (p: typeof products[0]) => {
    const item = selectedItems.find(i => i.code === p.code && i.name === p.name);
    return item ? (item.cantidad || 1) : 0;
  };

  const addOne = (p: typeof products[0]) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.code === p.code && i.name === p.name);
      if (exists) {
        return prev.map(i => i.code === p.code && i.name === p.name ? { ...i, cantidad: (i.cantidad || 1) + 1 } : i);
      }
      return [...prev, { ...p, cantidad: 1 }];
    });
  };

  const removeOne = (p: typeof products[0]) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.code === p.code && i.name === p.name);
      if (exists) {
        if ((exists.cantidad || 1) > 1) {
          return prev.map(i => i.code === p.code && i.name === p.name ? { ...i, cantidad: (i.cantidad || 1) - 1 } : i);
        }
        return prev.filter(i => !(i.code === p.code && i.name === p.name));
      }
      return prev;
    });
  };

  const isSelected = (p: typeof products[0]) => getCantidad(p) > 0;

  const fmt = (n: number) => `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return activeCategory ? products.filter(p => p.category === activeCategory) : products;
    
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
  
  const totalProductos = selectedItems.reduce((s, p) => s + (p.total * (p.cantidad || 1)), 0);
  const precioSinItbis = selectedItems.reduce((s, p) => s + (p.price * (p.cantidad || 1)), 0);
  const itbisTotal = selectedItems.reduce((s, p) => s + (p.itbis * (p.cantidad || 1)), 0);
  
  const inicialDadoNum = parseFloat(inicialDado.replace(/[^0-9.]/g, '')) || 0;
  const pagoInicial = Math.min(inicialDadoNum, totalProductos);
  const montoFinanciar = Math.max(0, totalProductos - pagoInicial);
  const TASA_INTERES_ANUAL = 26;

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
    setPorcentajeInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 4 && num <= 100) {
      setPorcentaje(num);
      if (totalProductos > 0) setInicialDado((totalProductos * (num / 100)).toFixed(2));
    }
  };

  const handlePorcentajeChange = (value: number) => {
    const pct = Math.min(100, Math.max(4, value));
    setPorcentaje(pct);
    setPorcentajeInput(pct.toFixed(2));
    if (totalProductos > 0) setInicialDado((totalProductos * (pct / 100)).toFixed(2));
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
  const pctEscrito = montoFinanciar > 0 && cuotaInputNum > 0 ? (cuotaInputNum / montoFinanciar) * 100 : 0;
  const filaActiva = mesSeleccionado ? TABLA_PAGOS.find(f => f.cuotas === mesSeleccionado) ?? null : pctEscrito > 0 ? TABLA_PAGOS.reduce((prev, curr) => Math.abs(curr.pct - pctEscrito) < Math.abs(prev.pct - pctEscrito) ? curr : prev) : null;
  const filaAnterior = pctEscrito > 0 && !mesSeleccionado ? TABLA_PAGOS.filter(f => f.pct >= pctEscrito).slice(-1)[0] ?? null : null;
  const filaSiguiente = pctEscrito > 0 && !mesSeleccionado ? TABLA_PAGOS.find(f => f.pct < pctEscrito) ?? null : null;
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

  // Estilos UI Globales
  const cardContainer = cn(
    "rounded-[2rem] p-6 flex flex-col h-full border overflow-hidden shadow-2xl transition-all duration-300",
    isDark 
      ? "bg-white/[0.03] backdrop-blur-[12px] border-white/10 shadow-black/40" 
      : "bg-white/90 backdrop-blur-[12px] border-slate-200/60 shadow-slate-200/70"
  );
  
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-white/50" : "text-slate-500";
  const bgGlass = isDark ? "bg-white/[0.04] border-white/10" : "bg-white/80 border-slate-200";

  return (
    <section id="calculadora" className={cn("w-full min-h-screen transition-colors duration-500 ease-out", isDark ? "bg-[#050505]" : "bg-slate-50")}>
      
      <div className="text-center py-6 px-4">
        <p className="text-[#0066B3] text-xs font-black tracking-[0.3em] uppercase mb-2">Leiham Company</p>
        <h2 className={cn("text-3xl font-black tracking-tight", textPrimary)}>
          Calculadora de <span className="text-[#0066B3]">Financiamiento</span>
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-[240px_1fr_320px_320px] gap-5 h-auto md:h-[720px]">

        {/* Móvil chips */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 custom-scrollbar" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <motion.button onClick={() => setActiveCategory(null)}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95, transition: { type: 'spring' } }}
            className={cn("flex-shrink-0 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition duration-200", 
              !activeCategory ? 'bg-[#0066B3] text-white shadow-lg shadow-[#0066B3]/30' : cn(bgGlass, "border", textSecondary)
            )}>TODOS</motion.button>
          {allCategories.map(cat => (
            <motion.button key={cat} onClick={() => handleCategoryClick(cat)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95, transition: { type: 'spring' } }}
              className={cn("flex-shrink-0 px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap uppercase tracking-wider transition duration-200", 
                activeCategory === cat ? 'bg-[#0066B3] text-white shadow-lg shadow-[#0066B3]/30' : cn(bgGlass, "border", textSecondary)
              )}>
              {cat}
            </motion.button>
          ))}
        </div>

        {/* COLUMNA 1 — Categorías */}
        <div className={cn("hidden md:flex flex-col", cardContainer)}>
          <h3 className={cn("font-black text-xs uppercase tracking-[0.2em] mb-5", textPrimary)}>Categorías</h3>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar" data-lenis-prevent>
            {allCategories.map(cat => {
              const count = selectedItems.filter(i => i.category === cat).length;
              return (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  className={cn("w-full text-left px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition duration-200 border", 
                    activeCategory === cat 
                      ? (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-[#0066B3]/10 text-[#0066B3] border-[#0066B3]/20') 
                      : cn(bgGlass, "hover:scale-[1.02]", textSecondary)
                  )}>
                  <span className="truncate pr-2">{cat}</span>
                  {count > 0 && <span className="bg-[#0066B3] text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-auto">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2 — Productos */}
        <div className={cardContainer}>
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("font-black text-xs uppercase tracking-[0.2em]", textPrimary)}>Catálogo Master</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => { setIsClearing(true); setSelectedItems([]); setTimeout(() => setIsClearing(false), 350); }}
                className="text-[11px] font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full transition"
              >LIMPIAR</button>
            )}
          </div>

          <div className="relative mb-5">
            <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", textSecondary)} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto o código..."
              className={cn("w-full pl-11 pr-10 py-3.5 rounded-2xl font-bold text-sm border outline-none transition", 
                bgGlass, textPrimary, "focus:border-[#0066B3]/60 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(0,102,179,0.15)]")}
            />
            {search && (
              <button onClick={() => setSearch("")} className={cn("absolute right-4 top-1/2 -translate-y-1/2", textSecondary)}>
                <X className="w-4 h-4 font-bold" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[300px] md:max-h-full custom-scrollbar" data-lenis-prevent>
            {visibleCategories.map(cat => (
              <div key={cat} ref={el => { categoryRefs.current[cat] = el; }} className="mb-6 last:mb-0">
                <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] py-2 px-3 sticky top-0 backdrop-blur-xl rounded-xl z-10 mb-2 border", 
                  isDark ? "text-[#0066B3] bg-black/80 border-white/5" : "text-[#0066B3] bg-white/95 border-slate-100")}>
                  {cat}
                </p>
                <div className="space-y-2">
                    {filtered.filter(p => p.category === cat).map((product, productIdx) => (
                        <motion.div
                            key={product.code + product.name}
                            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: (isMobile || shouldReduceMotion) ? 0 : Math.min(productIdx * 0.03, 0.2) }}
                            className={cn("flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 rounded-2xl transition duration-200 border", 
                                getCantidad(product) > 0
                                    ? (isDark ? 'bg-[#0066B3]/15 border-[#0066B3]/40' : 'bg-[#0066B3]/5 border-[#0066B3]/30') 
                                    : cn(bgGlass, "hover:border-[#0066B3]/30 hover:shadow-lg")
                            )}
                        >
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-sm font-bold truncate", textPrimary)}>{product.name}</p>
                                <div className="flex gap-3 mt-1">
                                    {product.code !== '-' && <p className={cn("text-xs font-bold", textSecondary)}>{product.code}</p>}
                                    <p className={cn("text-xs font-bold", textSecondary)}>ITBIS: {fmt(product.itbis)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between sm:justify-end items-center sm:items-end sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                                <div className="text-left sm:text-right">
                                    <p className={cn("text-sm font-black tracking-tight", getCantidad(product) > 0 ? 'text-[#0066B3]' : textPrimary)}>{fmt(product.total)}</p>
                                    <p className={cn("text-[10px] uppercase font-bold tracking-wider", textSecondary)}>sin ITBIS: {fmt(product.price)}</p>
                                </div>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  {getCantidad(product) > 0 && (
                                    <>
                                      <motion.button onClick={() => removeOne(product)} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 font-bold border border-red-500/20">
                                        −
                                      </motion.button>
                                      <span className="text-[#0066B3] font-black text-sm w-5 text-center">{getCantidad(product)}</span>
                                    </>
                                  )}
                                  <motion.button onClick={() => addOne(product)} whileTap={{ scale: 0.9 }} className={cn("w-8 h-8 rounded-xl flex items-center justify-center font-bold border", getCantidad(product) > 0 ? 'bg-[#0066B3] text-white border-[#0066B3]' : 'bg-transparent text-[#0066B3] border-[#0066B3]/30 hover:bg-[#0066B3]/10')}>
                                    +
                                  </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className={cn("pt-4 mt-4 flex justify-between items-center border-t", isDark ? "border-white/10" : "border-slate-200")}>
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", textSecondary)}>Seleccionados</p>
              <p className={cn("text-lg font-black tracking-tighter", textPrimary)}>{selectedItems.length} <span className="text-xs font-bold tracking-normal opacity-50">ítems</span></p>
            </div>
            <div className="text-right">
              <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", textSecondary)}>Total Catálogo</p>
              <p className="text-[#0066B3] text-xl font-black tracking-tighter">{fmt(totalProductos)}</p>
            </div>
          </div>
        </div>

        {/* COLUMNA 3 — Calculadora Financiera */}
        <div className={cardContainer} data-lenis-prevent>
          
          {/* Card Principal: Total */}
          <div className={cn("relative overflow-hidden rounded-3xl p-6 border transition duration-300 shadow-xl mb-6", isDark ? "bg-white/[0.05] border-white/20 shadow-black/50" : "bg-white border-slate-200 shadow-[#0066B3]/10")}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
            <div className="relative z-10 text-center mb-6">
               <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-80", textPrimary)}>Total De Los Productos</span>
               <motion.div animate={{ filter: isClearing ? "blur(4px)" : "blur(0px)", opacity: isClearing ? 0.3 : 1 }} className={cn("text-4xl md:text-5xl font-black tracking-tighter drop-shadow-md mt-1", textPrimary)}>
                 {fmt(totalProductos)}
               </motion.div>
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1 h-3 rounded-full bg-white/40" />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", textSecondary)}>Inicial</span>
                </div>
                <span className={cn("text-lg font-black tracking-tighter", textPrimary)}>{fmt(inicialDadoNum)}</span>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", textSecondary)}>{porcentaje.toFixed(2)}% valor</span>
              </div>
              <div className="flex flex-col text-right items-end">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", textSecondary)}>A Financiar</span>
                  <div className="w-1 h-3 rounded-full bg-[#0066B3]" />
                </div>
                <span className={cn("text-lg font-black tracking-tighter text-[#0066B3]")}>{fmt(montoFinanciar)}</span>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", textSecondary)}>Base de cuotas</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div>
                <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", textSecondary)}>Inicial Entregado (RD$)</label>
                <input value={inicialDado} onChange={e => handleInicialChange(e.target.value)} placeholder="0.00"
                  className={cn("w-full px-5 py-4 rounded-2xl font-black text-lg border outline-none transition", bgGlass, textPrimary, "focus:border-[#0066B3] focus:shadow-[0_0_0_4px_rgba(0,102,179,0.15)]")}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className={cn("text-xs font-bold uppercase tracking-widest", textSecondary)}>Porcentaje</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={porcentajeInput} onChange={e => handlePorcentajeInput(e.target.value)} onBlur={() => { const num = parseFloat(porcentajeInput); if (isNaN(num) || num < 4) { setPorcentajeInput("4"); setPorcentaje(4); } }}
                      className={cn("w-20 text-center px-3 py-2 rounded-xl font-black border text-sm transition outline-none", bgGlass, textPrimary, "focus:border-[#0066B3]")}
                    />
                    <span className={cn("text-sm font-black", textSecondary)}>%</span>
                  </div>
                </div>
                <input type="range" min={4} max={100} step={0.01} value={porcentaje} onChange={e => handlePorcentajeChange(Number(e.target.value))}
                  className={cn("w-full h-2 rounded-full appearance-none cursor-pointer accent-[#0066B3] transition", isDark ? "bg-white/10" : "bg-slate-200")}
                />
              </div>

              <div className={cn("space-y-3 pt-4 border-t", isDark ? "border-white/10" : "border-slate-200")}>
                {[
                  { label: 'Precio de compra', value: fmt(precioSinItbis) },
                  { label: 'ITBIS', value: fmt(itbisTotal) },
                  { label: 'Tasa anual fija', value: `${TASA_INTERES_ANUAL}%` },
                  ...(filaActiva && montoFinanciar > 0 && !bajoDeMinimoMsg ? [{ label: 'Plan cuotas', value: `${filaActiva.cuotas}m / ${filaActiva.pct.toFixed(2)}%`, highlight: true }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", textSecondary)}>{row.label}</span>
                    <span className={cn('text-sm font-black tracking-tight', (row as { highlight?: boolean }).highlight ? 'text-[#0066B3]' : textPrimary)}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className={cn("border-t pt-5", isDark ? "border-white/10" : "border-slate-200")}>
                <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", textSecondary)}>Plan de Pagos</label>
                <div className="relative">
                  <select value={mesSeleccionado ?? ""} onChange={e => handleMesChange(Number(e.target.value))}
                    className={cn("w-full pl-5 pr-10 py-4 rounded-2xl border outline-none font-black text-sm cursor-pointer appearance-none transition", bgGlass, textPrimary, "focus:border-[#0066B3] focus:shadow-[0_0_0_4px_rgba(0,102,179,0.15)]")}
                  >
                    <option value="">— SELECCIONAR MESES —</option>
                    {TABLA_PAGOS.map(f => <option key={f.cuotas} value={f.cuotas}>{f.cuotas} MESES — {f.pct.toFixed(2)}%</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", textSecondary)}>O Escribe Cuota Mensual Máxima</label>
                <input value={cuotaInput} onChange={e => handleCuotaChange(e.target.value)} placeholder="0.00"
                  className={cn("w-full px-5 py-4 rounded-2xl font-black text-lg border outline-none transition", bgGlass, textPrimary, "focus:border-[#0066B3] focus:shadow-[0_0_0_4px_rgba(0,102,179,0.15)]")}
                />
              </div>

              {pctEscrito > 0 && !bajoDeMinimoMsg && !mesSeleccionado && montoFinanciar > 0 && (
                <div className={cn("p-4 rounded-2xl border space-y-3 font-bold text-xs", isDark ? "bg-[#0066B3]/10 border-[#0066B3]/20" : "bg-[#0066B3]/5 border-[#0066B3]/20")}>
                  <p className={textPrimary}>Tu cuota es el <span className="text-[#0066B3] text-sm font-black">{pctEscrito.toFixed(2)}%</span> del monto.</p>
                  {filaAnterior && filaSiguiente && (
                    <div className="space-y-2 pt-2 border-t border-[#0066B3]/20">
                      <div className="flex justify-between"><span>{filaAnterior.cuotas} meses</span><span className="text-[#0066B3] font-black">{fmt(montoFinanciar * (filaAnterior.pct / 100))}</span></div>
                      <div className="flex justify-between"><span>{filaSiguiente.cuotas} meses</span><span className="text-[#0066B3] font-black">{fmt(montoFinanciar * (filaSiguiente.pct / 100))}</span></div>
                    </div>
                  )}
                  {filaActiva && <div className="flex justify-between pt-2 border-t border-[#0066B3]/20"><span>Sugerido ({filaActiva.cuotas}m)</span><span className="text-[#0066B3] font-black text-sm">{fmt(montoFinanciar * (filaActiva.pct / 100))}</span></div>}
                </div>
              )}

              {mesSeleccionado && filaActiva && montoFinanciar > 0 && (
                <div className="relative group mt-4">
                  <div className={cn("relative overflow-hidden rounded-3xl p-6 border transition duration-300 shadow-xl", isDark ? "bg-[#0066B3]/20 border-[#0066B3]/50 shadow-[#0066B3]/20" : "bg-[#0066B3]/5 border-[#0066B3]/40 shadow-[#0066B3]/10")}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0066B3]/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-1 mb-6">
                       <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-90", isDark ? "text-white" : "text-[#0066B3]")}>CUOTA MENSUAL</span>
                       <span className={cn("text-4xl md:text-5xl font-black tracking-tighter drop-shadow-md", isDark ? "text-white" : "text-[#0066B3]")}>{fmt(cuotaDelDropdown)}</span>
                    </div>
                    <div className="relative z-10 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isDark ? "text-white/60" : "text-[#0066B3]/70")}>PLAZO</span>
                        <span className={cn("text-lg font-black tracking-tighter", isDark ? "text-white" : "text-[#0066B3]")}>{filaActiva.cuotas} MESES</span>
                      </div>
                      <div className="flex flex-col text-right items-end">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isDark ? "text-white/60" : "text-[#0066B3]/70")}>FACTOR TASA</span>
                        <span className={cn("text-lg font-black tracking-tighter", isDark ? "text-white" : "text-[#0066B3]")}>{filaActiva.pct.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-1 rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition duration-500 pointer-events-none -z-10 bg-[#0066B3]" />
                </div>
              )}
          </div>
        </div>

        {/* COLUMNA 4 — Regalos */}
        <div className={cardContainer}>
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("font-black text-xs uppercase tracking-[0.2em]", textPrimary)}>Incentivos</h3>
            {totalProductos > 0 && <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">MAX {fmt(totalProductos * 0.10)}</span>}
          </div>

          {totalProductos === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10 opacity-60">
              <Gift className="w-10 h-10" />
              <p className="text-xs font-bold text-center uppercase tracking-widest">Calcula orden<br/>para desbloquear</p>
            </div>
          ) : (() => {
            const EXCLUIR = ['aro', 'reparac', 'reemplaz', 'tapa'];
            const maxR = totalProductos * 0.10;
            const totalRegalos = selectedRegalos.reduce((s, p) => s + p.total, 0);
            const porcentajeUsado = totalProductos > 0 ? (totalRegalos / totalProductos) * 100 : 0;
            const cerca = totalRegalos > 0 && porcentajeUsado >= 7 && totalRegalos <= maxR;
            const excedido = totalRegalos > maxR;
            const REGALOS_VOLUMEN = ['PR1044', 'PR0196', 'PR1675', 'PR1685', 'PR2120', 'PR2129', 'PR0008', 'PR0021', 'CO2124', 'CU0825'];
            const elegiblesNormales = products.filter(p => !EXCLUIR.some(ex => p.category.toLowerCase().includes(ex) || p.name.toLowerCase().includes(ex)) && p.total <= maxR && !REGALOS_VOLUMEN.includes(p.code));
            const elegiblesVolumen = products.filter(p => REGALOS_VOLUMEN.includes(p.code));
            const elegibles = [...elegiblesVolumen, ...elegiblesNormales];

            return (
              <div className="flex flex-col flex-1 overflow-hidden">
                {selectedRegalos.length > 0 && (
                  <div className={cn("px-4 py-3 rounded-2xl mb-4 font-bold text-xs flex justify-between items-center border", excedido ? "bg-red-500/10 border-red-500/20 text-red-500" : cerca ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-[#0066B3]/10 border-[#0066B3]/20 text-[#0066B3]")}>
                    <span>{excedido ? '¡Excedido!' : cerca ? 'Aproximándose' : 'En rango'}</span>
                    <span className="text-lg font-black">{fmt(totalRegalos)}</span>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar" data-lenis-prevent>
                  {elegibles.map((p, i) => {
                    const sel = isRegaloSelected(p);
                    const fueraDeRango = REGALOS_VOLUMEN.includes(p.code) && p.total > maxR;
                    const excederiaSiAgrego = !sel && (totalRegalos + p.total) > maxR;
                    return (
                      <motion.div key={p.code} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.05, 0.2) }} onClick={() => !fueraDeRango && (!excederiaSiAgrego || sel) ? toggleRegalo(p) : null}
                        className={cn("px-4 py-3 rounded-2xl border transition duration-200 relative", fueraDeRango ? "opacity-30 cursor-not-allowed bg-transparent" : sel ? "bg-[#0066B3]/20 border-[#0066B3]/50 cursor-pointer shadow-lg" : excederiaSiAgrego ? "opacity-30 cursor-not-allowed bg-transparent" : cn(bgGlass, "cursor-pointer hover:border-[#0066B3]/30 hover:scale-[1.02]"))}>
                        {REGALOS_VOLUMEN.includes(p.code) && <span className="absolute -top-2 -right-2 text-[8px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-full uppercase">Vol</span>}
                        <p className={cn("text-xs font-bold truncate pr-3", sel ? "text-[#0066B3]" : textPrimary)}>{p.name}</p>
                        <div className="flex justify-between items-end mt-2">
                          <p className={cn("text-[9px] font-bold uppercase tracking-widest", textSecondary)}>{p.category}</p>
                          <p className={cn("text-sm font-black tracking-tight", sel ? "text-[#0066B3]" : textPrimary)}>{fmt(p.total)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </section>
  );
}
