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
  const [porcentaje, setPorcentaje] = useState(5);
  const [porcentajeInput, setPorcentajeInput] = useState("5");
  const [hasManuallySetPorcentaje, setHasManuallySetPorcentaje] = useState(false);
  const [selectedRegalos, setSelectedRegalos] = useState<typeof products>([]);
  const [cuotaInput, setCuotaInput] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [totalManualInput, setTotalManualInput] = useState('');
  const [descuentoManual, setDescuentoManual] = useState(0);
  const [editandoTotal, setEditandoTotal] = useState(false);
  
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
  const totalUnidades = selectedItems.reduce((s, p) => s + (p.cantidad || 1), 0);
  
  const totalEfectivo = totalProductos - descuentoManual;
  const diferencia = descuentoManual;
  
  const ratio = totalProductos > 0 ? totalEfectivo / totalProductos : 1;
  const precioSinItbisEfectivo = precioSinItbis * ratio;
  const itbisEfectivo = itbisTotal * ratio;
  
  const inicialDadoNum = parseFloat(inicialDado.replace(/[^0-9.]/g, '')) || 0;
  const pagoInicial = Math.min(inicialDadoNum, totalEfectivo);
  const montoFinanciar = Math.max(0, totalEfectivo - pagoInicial);
  const TASA_INTERES_ANUAL = 26;

  const handleInicialChange = (value: string) => {
    setInicialDado(value);
    const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    if (totalEfectivo > 0) {
      const pct = Math.min(100, Math.max(5, (num / totalEfectivo) * 100));
      const pctRound = Math.round(pct);
      setPorcentaje(pctRound);
      setPorcentajeInput(pctRound.toString());
      setHasManuallySetPorcentaje(true);
    }
  };

  const handlePorcentajeInput = (value: string) => {
    setPorcentajeInput(value);
    const num = Math.round(parseFloat(value));
    if (!isNaN(num) && num >= 5 && num <= 100) {
      setPorcentaje(num);
      setHasManuallySetPorcentaje(true);
      if (totalEfectivo > 0) setInicialDado((totalEfectivo * (num / 100)).toFixed(2));
    }
  };

  const handlePorcentajeChange = (value: number) => {
    const pct = Math.min(100, Math.max(5, Math.round(value)));
    setPorcentaje(pct);
    setPorcentajeInput(pct.toString());
    setHasManuallySetPorcentaje(true);
    if (totalEfectivo > 0) setInicialDado((totalEfectivo * (pct / 100)).toFixed(2));
  };

  const lastTotalEfectivoRef = useRef(-1);

  useEffect(() => {
    if (totalEfectivo !== lastTotalEfectivoRef.current) {
      lastTotalEfectivoRef.current = totalEfectivo;
      if (totalEfectivo > 0) {
        if (!hasManuallySetPorcentaje) {
          setPorcentaje(5);
          setPorcentajeInput("5");
          setInicialDado((totalEfectivo * 0.05).toFixed(2));
        } else {
          setInicialDado((totalEfectivo * (porcentaje / 100)).toFixed(2));
        }
      } else {
        setPorcentaje(5);
        setPorcentajeInput("5");
        setInicialDado("");
        setHasManuallySetPorcentaje(false);
      }
    }
  }, [totalEfectivo, hasManuallySetPorcentaje, porcentaje]);

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

  // Estilos UI Globales (Conservando las proporciones originales compactas)
  const cardContainer = cn(
    "rounded-2xl p-4 flex flex-col h-full overflow-hidden transition-all duration-300",
    isDark 
      ? "bg-white/[0.03] backdrop-blur-[6px] border border-white/8 shadow-black/30" 
      : "bg-slate-50 border border-slate-200/80 shadow-slate-200/50"
  );
  
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-white/50" : "text-slate-500";
  const bgGlass = isDark ? "bg-white/[0.04] border-white/8" : "bg-white/80 border-slate-200/70";

  return (
    <section id="calculadora" className={cn("w-full min-h-screen transition-colors duration-500 ease-out", isDark ? "bg-[#050505]" : "bg-white")}>
      
      <div className="text-center py-4 px-4">
        <p className="text-[#0066B3] text-[11px] font-black tracking-[0.25em] uppercase mb-2">Leiham Company</p>
        <h2 className={cn("text-2xl font-black tracking-tight", textPrimary)}>
          Calculadora de <span className="text-[#0066B3]">Financiamiento</span>
        </h2>
      </div>

        {/* Móvil chips - RE-AÑADIDO */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-2" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <motion.button onClick={() => setActiveCategory(null)}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95, transition: { type: 'spring' } }}
            className={cn("flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition duration-200 ease-out", 
              !activeCategory ? 'bg-[#0066B3] text-white shadow-sm shadow-[#0066B3]/30' : cn(bgGlass, "border", textSecondary)
            )}>Todos</motion.button>
          {allCategories.map(cat => (
            <motion.button key={cat} onClick={() => handleCategoryClick(cat)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95, transition: { type: 'spring' } }}
              className={cn("flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition duration-200", 
                activeCategory === cat ? 'bg-[#0066B3] text-white shadow-sm shadow-[#0066B3]/30' : cn(bgGlass, "border", textSecondary)
              )}>
              {cat}
            </motion.button>
          ))}
        </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-[220px_1fr_300px_300px] gap-4 h-auto md:h-[680px]">



        {/* COLUMNA 1 — Categorías (Oculta en celular, Visible en Desktop) */}
        <div className={cn(cardContainer, "hidden md:flex flex-col")}>
          <h3 className={cn("font-black text-base tracking-tight mb-4", textPrimary)}>Categorías</h3>
          <div className="space-y-0.5 flex-1 overflow-y-auto pr-1 custom-scrollbar" data-lenis-prevent>
            {allCategories.map(cat => {
              const count = selectedItems.filter(i => i.category === cat).length;
              return (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  className={cn("w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition duration-200 flex justify-between items-center border border-transparent", 
                    activeCategory === cat 
                      ? (isDark ? 'bg-white/10 text-white' : 'bg-[#0066B3]/10 text-[#0066B3]') 
                      : cn("hover:bg-white/5", textSecondary)
                  )}>
                  <span className="truncate pr-2">{cat}</span>
                  {count > 0 && <span className="bg-[#0066B3] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2 — Productos */}
        <div className={cardContainer}>
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("font-black text-base tracking-tight", textPrimary)}>Productos</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => { setIsClearing(true); setSelectedItems([]); setTimeout(() => setIsClearing(false), 350); }}
                className={cn("text-[11px] font-bold transition-colors", isDark ? "text-white/30 hover:text-red-400" : "text-slate-400 hover:text-red-500")}
              >Limpiar</button>
            )}
          </div>

          <div className="relative mb-5">
            <Search className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5", textSecondary)} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto o código..."
              className={cn("w-full pl-10 pr-9 py-3 rounded-xl font-bold text-[13px] border outline-none transition", 
                isDark ? "bg-white/5 border-white/8 text-white placeholder:text-white/20 focus:border-[#0066B3]/60 focus:bg-white/10" : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-[#0066B3]/50 focus:bg-slate-50")}
            />
            {search && (
              <button onClick={() => setSearch("")} className={cn("absolute right-3.5 top-1/2 -translate-y-1/2", textSecondary)}>
                <X className="w-3.5 h-3.5 font-bold" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[300px] md:max-h-full custom-scrollbar" data-lenis-prevent>
            {visibleCategories.map(cat => (
              <div key={cat} ref={el => { categoryRefs.current[cat] = el; }} className="mb-4 last:mb-0">
                <p className={cn("text-[10px] font-black uppercase tracking-[0.15em] py-2 px-2 sticky top-0 backdrop-blur-md rounded-lg z-10 mb-1 border-b transition duration-200", 
                  isDark ? "text-white/25 bg-black/60 border-white/6" : "text-slate-400 bg-white/95 border-slate-100")}>
                  {cat}
                </p>
               <div className="space-y-4 md:space-y-0.5">
                    {filtered.filter(p => p.category === cat).map((product, productIdx) => (
                        <motion.div
                            id={`producto-${product.code}-${product.name.replace(/\s+/g, '-')}`}
                            key={product.code + product.name}
                            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: (isMobile || shouldReduceMotion) ? 0 : Math.min(productIdx * 0.03, 0.25) }}
                            className={cn("flex flex-col md:flex-row md:items-center gap-2 md:gap-3 px-3 py-4 md:py-2.5 rounded-xl transition duration-200 border-b md:border-b-0 border-white/10 last:border-b-0", 
                                getCantidad(product) > 0
                                    ? (isDark ? 'bg-[#0066B3]/12 border border-[#0066B3]/25' : 'bg-[#0066B3]/5 border border-[#0066B3]/15') 
                                    : cn(isDark ? 'hover:bg-white/5 border border-transparent' : 'bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200')
                            )}
                        >
                            <div className="flex-1 min-w-0 w-full">
                                <p className={cn("text-[13px] font-bold md:truncate whitespace-normal leading-snug", textPrimary)}>{product.name}</p>
                                <div className="flex gap-3 mt-1 md:mt-0.5 opacity-80 md:opacity-100">
                                    {product.code !== '-' && <p className={cn("text-[10px] md:text-[11px] font-bold", textSecondary)}>{product.code}</p>}
                                    <p className={cn("text-[10px] md:text-[11px] font-bold", textSecondary)}>ITBIS: {fmt(product.itbis)}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center md:justify-end gap-3 w-full md:w-auto mt-1 md:mt-0">
                                <div className="text-left md:text-right flex-shrink-0">
                                    <p className={cn("text-[13px] font-black tracking-tight", getCantidad(product) > 0 ? 'text-[#0066B3]' : textPrimary)}>{fmt(product.total)}</p>
                                    <p className={cn("text-[10px] md:text-[11px] font-bold", textSecondary)}>sin ITBIS: {fmt(product.price)}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                  {getCantidad(product) > 0 && (
                                    <>
                                      <motion.button onClick={() => removeOne(product)} whileTap={{ scale: 0.88 }} className={cn("w-7 h-7 md:w-6 md:h-6 rounded-lg flex items-center justify-center font-bold text-sm", isDark ? "bg-white/8 text-white/60 hover:text-red-400" : "bg-slate-100 text-slate-500 hover:text-red-500")}>
                                        −
                                      </motion.button>
                                      <span className="text-[#0066B3] font-black text-sm w-5 text-center">{getCantidad(product)}</span>
                                    </>
                                  )}
                                  <motion.button onClick={() => addOne(product)} whileTap={{ scale: 0.88 }} className={cn("w-7 h-7 md:w-6 md:h-6 rounded-lg flex items-center justify-center font-bold text-sm", getCantidad(product) > 0 ? 'bg-[#0066B3] text-white' : (isDark ? 'bg-white/8 text-white/40' : 'bg-slate-100 text-slate-400'))}>
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
          
          {/* Footer siempre visible */}
          <div className={cn('border-t mt-2 flex-shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
            
            {/* Header del resumen */}
            <div className="flex items-center justify-between px-4 py-2">
              <p className={cn('text-xs uppercase tracking-widest font-bold', isDark ? 'text-white/40' : 'text-slate-400')}>
                Seleccionados · {totalUnidades} producto{totalUnidades !== 1 ? 's' : ''}
              </p>
              <p className="text-[#0066B3] font-black text-sm">{fmt(totalProductos)}</p>
            </div>

            {/* Lista de seleccionados */}
            {selectedItems.length > 0 ? (
              <div className={cn('mx-3 mb-3 rounded-xl border overflow-hidden', isDark ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50')}>
                <div className="max-h-[180px] overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,102,179,0.2) transparent' }}>
                  {selectedItems.map((p, idx) => (
                    <div
                      key={p.code + p.name + idx}
                      onClick={() => {
                        // Scroll al producto en la lista y resaltarlo
                        const el = document.getElementById(`producto-${p.code}-${p.name.replace(/\s+/g, '-')}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.classList.add('ring-2', 'ring-[#0066B3]');
                          setTimeout(() => el.classList.remove('ring-2', 'ring-[#0066B3]'), 2000);
                        }
                      }}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors',
                        idx !== 0 && (isDark ? 'border-t border-white/5' : 'border-t border-slate-100'),
                        isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                      )}
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className={cn('text-xs font-semibold truncate', isDark ? 'text-white/80' : 'text-slate-700')}>
                          {p.name}
                        </p>
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-slate-400')}>
                          x{p.cantidad || 1} · {fmt(p.total * (p.cantidad || 1))}
                        </p>
                      </div>
                      <p className="text-[#0066B3] text-xs font-bold flex-shrink-0">
                        {fmt(p.total * (p.cantidad || 1))}
                      </p>
                    </div>
                  ))}
                </div>
                <div className={cn('flex justify-between items-center px-3 py-2 border-t font-black', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
                  <span className={cn('text-xs uppercase tracking-wider', isDark ? 'text-white/50' : 'text-slate-500')}>Total</span>
                  <span className="text-[#0066B3] text-sm">{fmt(totalProductos)}</span>
                </div>
              </div>
            ) : (
              <p className={cn('text-xs text-center pb-3', isDark ? 'text-white/20' : 'text-slate-300')}>
                Ningún producto seleccionado
              </p>
            )}
          </div>
        </div>

        {/* COLUMNA 3 — Calculadora Financiera */}
        <div className={cn("rounded-2xl p-5 flex flex-col gap-4 border transition duration-200 overflow-y-auto custom-scrollbar", isDark ? "bg-white/[0.03] border-white/8 shadow-2xl shadow-black/30" : "bg-slate-50 border-slate-200/80 shadow-slate-200/50")} data-lenis-prevent>
          
          <div className={cn("rounded-2xl p-4 border transition-all", isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200")}>
            <p className={cn("text-[10px] font-black tracking-[0.2em] uppercase mb-1", isDark ? "text-white/40" : "text-slate-400")}>
              Total a pagar
            </p>
            {editandoTotal ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={totalManualInput}
                  onChange={e => setTotalManualInput(e.target.value)}
                  onBlur={() => {
                    const raw = totalManualInput.replace(/[^0-9.]/g, '');
                    const val = parseFloat(raw);
                    if (!raw || val === 0) {
                      setDescuentoManual(0);
                    } else if (!isNaN(val) && val > 0) {
                      setDescuentoManual(totalProductos - val);
                    }
                    setEditandoTotal(false);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const raw = totalManualInput.replace(/[^0-9.]/g, '');
                      const val = parseFloat(raw);
                      if (!raw || val === 0) {
                        setDescuentoManual(0);
                      } else if (!isNaN(val) && val > 0) {
                        setDescuentoManual(totalProductos - val);
                      }
                      setEditandoTotal(false);
                    }
                  }}
                  placeholder={fmt(totalProductos)}
                  className={cn(
                    'w-full px-3 py-1.5 rounded-xl border outline-none font-black text-xl transition-all',
                    isDark ? 'bg-black/60 border-[#0066B3]/50 text-white' : 'bg-white border-[#0066B3]/50 text-slate-900'
                  )}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setTotalManualInput(totalEfectivo.toString());
                  setEditandoTotal(true);
                }}
                className="w-full text-left group"
              >
                <p className={cn('font-black text-2xl tracking-tighter group-hover:text-[#0066B3] transition-colors', isDark ? 'text-white' : 'text-slate-900')}>
                  {fmt(totalEfectivo)}
                </p>
                <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/20' : 'text-slate-400')}>
                  ✏️ Toca para editar
                </p>
              </button>
            )}
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div>
                <label className={cn("text-[11px] font-bold block mb-1.5", textSecondary)}>Inicial entregado <span className="opacity-50">RD$</span></label>
                <input value={inicialDado} onChange={e => handleInicialChange(e.target.value)} placeholder="0.00"
                  className={cn("w-full px-4 py-3 rounded-xl font-black text-sm border outline-none transition", isDark ? "bg-white/5 border-white/8 text-white focus:border-[#0066B3]/60" : "bg-white border-slate-200 text-slate-900 focus:border-[#0066B3]/60")}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={cn("text-[11px] font-bold", textSecondary)}>Porcentaje</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={porcentajeInput} onChange={e => handlePorcentajeInput(e.target.value)} onBlur={() => { const num = Math.round(parseFloat(porcentajeInput)); if (isNaN(num) || num < 5) { setPorcentajeInput("5"); setPorcentaje(5); } else if (num > 100) { setPorcentajeInput("100"); setPorcentaje(100); } else { setPorcentajeInput(num.toString()); setPorcentaje(num); } }}
                      className={cn("w-16 text-center px-2 py-1 rounded-lg font-black text-[13px] border outline-none", isDark ? "bg-white/5 border-white/8 text-white" : "bg-white border-slate-200 text-slate-800")}
                    />
                    <span className={cn("text-xs font-bold", textSecondary)}>%</span>
                  </div>
                </div>
                <input type="range" min={5} max={100} step={1} value={porcentaje} onChange={e => handlePorcentajeChange(Number(e.target.value))}
                  className={cn("w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#0066B3] transition", isDark ? "bg-white/10" : "bg-slate-200")}
                />
              </div>

              <div className={cn("space-y-1 pt-3 border-t", isDark ? "border-white/10" : "border-slate-200")}>
                {[
                  { label: 'Precio de compra', value: fmt(precioSinItbisEfectivo) },
                  { label: 'ITBIS', value: fmt(itbisEfectivo) },
                  { label: 'Tasa de interés anual', value: `${TASA_INTERES_ANUAL}%` },
                  { label: 'Valor productos', value: fmt(totalProductos) },
                  ...(descuentoManual !== 0 ? [{ 
                    label: descuentoManual > 0 ? 'Descuento aplicado' : 'Cargo adicional', 
                    value: `${descuentoManual > 0 ? '-' : '+'} ${fmt(Math.abs(descuentoManual))}`
                  }] : []),
                  { label: 'Total efectivo', value: fmt(totalEfectivo) },
                  { label: 'Inicial aplicado', value: fmt(inicialDadoNum) },
                  { label: 'Equivalencia %', value: `${porcentaje.toFixed(2)}%` },
                  { label: 'Monto a financiar', value: fmt(montoFinanciar) },
                  ...(filaActiva && montoFinanciar > 0 && !bajoDeMinimoMsg ? [
                    { label: 'Plan de pagos', value: `${filaActiva.cuotas} meses — ${filaActiva.pct.toFixed(2)}%`, highlight: true }
                  ] : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-1">
                    <span className={cn("text-[9px] font-bold uppercase tracking-widest", textSecondary)}>{row.label}</span>
                    <span className={cn(row.highlight ? 'text-[#0066B3] font-black text-lg' : (isDark ? 'text-white text-xs font-mono font-bold' : 'text-slate-900 text-xs font-mono font-bold'))}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className={cn("border-t pt-3", isDark ? "border-white/10" : "border-slate-200")}>
                <label className={cn("text-[11px] font-bold block mb-1.5", textSecondary)}>Plan de Pagos</label>
                <div className="relative">
                  <select value={mesSeleccionado ?? ""} onChange={e => handleMesChange(Number(e.target.value))}
                    className={cn("w-full px-4 py-3 rounded-xl border outline-none font-black text-xs cursor-pointer appearance-none transition", isDark ? "bg-white/5 border-white/8 text-white" : "bg-white border-slate-200 text-slate-900")}
                  >
                    <option value="">— Seleccionar meses —</option>
                    {TABLA_PAGOS.map(f => <option key={f.cuotas} value={f.cuotas}>{f.cuotas} MESES — {f.pct.toFixed(2)}%</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={cn("text-[11px] font-bold block mb-1.5", textSecondary)}>Cuota Mensual Deseada <span className="opacity-50">RD$</span></label>
                <input value={cuotaInput} onChange={e => handleCuotaChange(e.target.value)} placeholder="0.00"
                  className={cn("w-full px-4 py-3 rounded-xl font-black text-sm border outline-none transition", isDark ? "bg-white/5 border-white/8 text-white" : "bg-white border-slate-200 text-slate-900")}
                />
              </div>

              {bajoDeMinimoMsg && montoFinanciar > 0 && (
                <div className="px-3 py-2.5 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-[11px] font-bold space-y-1">
                  <p>⛔ Cuota equivale a <span className="text-red-500 font-black">{pctEscrito.toFixed(2)}%</span></p>
                  <p>El mínimo permitido es <span className="font-black">4.00%</span> (41 meses)</p>
                  <p>Cuota mínima: <span className="font-black">{fmt(cuotaMinimaRD)}</span></p>
                </div>
              )}

              {pctEscrito > 0 && !bajoDeMinimoMsg && !mesSeleccionado && montoFinanciar > 0 && (
                <div className={cn("p-3 rounded-xl border space-y-1.5 font-bold text-[11px]", isDark ? "bg-[#0066B3]/10 border-[#0066B3]/20" : "bg-[#0066B3]/5 border-[#0066B3]/10")}>
                  <p className={textSecondary}>Cuota equivale a <span className="text-[#0066B3]">{pctEscrito.toFixed(2)}%</span></p>
                  {filaAnterior && filaSiguiente && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between"><span>{filaAnterior.cuotas} meses</span><span className="text-[#0066B3]">{fmt(montoFinanciar * (filaAnterior.pct / 100))}</span></div>
                      <div className="flex justify-between"><span>{filaSiguiente.cuotas} meses</span><span className="text-[#0066B3]">{fmt(montoFinanciar * (filaSiguiente.pct / 100))}</span></div>
                    </div>
                  )}
                </div>
              )}

              {mesSeleccionado && filaActiva && montoFinanciar > 0 && (
                <div className={cn("mt-4 relative overflow-hidden rounded-2xl p-4 border transition duration-300", isDark ? "bg-[#0066B3]/15 border-[#0066B3]/30" : "bg-[#0066B3]/5 border-[#0066B3]/20")}>
                    <div className="relative z-10 flex flex-col items-center justify-center mb-2">
                       <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/80" : "text-[#0066B3]/80")}>CUOTA MENSUAL</span>
                       <span className={cn("text-3xl font-black tracking-tighter mt-0.5", isDark ? "text-white" : "text-[#0066B3]")}>{fmt(cuotaDelDropdown)}</span>
                    </div>
                    <div className="relative z-10 flex justify-between items-end border-t border-[#0066B3]/10 pt-2">
                      <div className="flex flex-col">
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest", isDark ? "text-white/50" : "text-[#0066B3]/70")}>PLAZO</span>
                        <span className={cn("text-xs font-black tracking-tight", isDark ? "text-white" : "text-[#0066B3]")}>{filaActiva.cuotas} MESES</span>
                      </div>
                      <div className="flex flex-col text-right items-end">
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest", isDark ? "text-white/50" : "text-[#0066B3]/70")}>FACTOR TASA</span>
                        <span className={cn("text-xs font-black tracking-tight", isDark ? "text-white" : "text-[#0066B3]")}>{filaActiva.pct.toFixed(2)}%</span>
                      </div>
                    </div>
                 </div>
              )}
          </div>
        </div>

        {/* COLUMNA 4 — Regalos */}
        <div className={cardContainer}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className={cn("text-base font-black tracking-tight", textPrimary)}>Regalos</h3>
            {totalEfectivo > 0 && <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", isDark ? "text-white/50 bg-white/10" : "text-slate-500 bg-slate-100")}>MAX {fmt(totalEfectivo * 0.10)}</span>}
          </div>

          {totalEfectivo <= 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-50">
              <Gift className="w-6 h-6" />
              <p className="text-[11px] font-bold text-center">Selecciona productos<br/>para ver regalos</p>
            </div>
          ) : (() => {
            const EXCLUIR = ['aro', 'reparac', 'reemplaz', 'tapa'];
            const maxR = totalEfectivo * 0.10;
            const totalRegalos = selectedRegalos.reduce((s, p) => s + p.total, 0);
            const porcentajeUsado = totalEfectivo > 0 ? (totalRegalos / totalEfectivo) * 100 : 0;
            const cerca = totalRegalos > 0 && porcentajeUsado >= 7 && totalRegalos <= maxR;
            const excedido = totalRegalos > maxR;
            const REGALOS_VOLUMEN = ['PR1044', 'PR0196', 'PR1675', 'PR1685', 'PR2120', 'PR2129', 'PR0008', 'PR0021', 'CO2124', 'CU0825'];
            const elegiblesNormales = products.filter(p => !EXCLUIR.some(ex => p.category.toLowerCase().includes(ex) || p.name.toLowerCase().includes(ex)) && p.total <= maxR && !REGALOS_VOLUMEN.includes(p.code));
            const elegiblesVolumen = products.filter(p => REGALOS_VOLUMEN.includes(p.code));
            const elegibles = [...elegiblesVolumen, ...elegiblesNormales].map((p, index) => {
              const sel = isRegaloSelected(p);
              const fueraDeRango = REGALOS_VOLUMEN.includes(p.code) && p.total > maxR;
              const excederiaSiAgrego = !sel && (totalRegalos + p.total) > maxR;
              const disabled = fueraDeRango || excederiaSiAgrego;
              return { ...p, sel, fueraDeRango, excederiaSiAgrego, disabled, originalIndex: index };
            }).sort((a, b) => {
              if (a.disabled === b.disabled) return a.originalIndex - b.originalIndex;
              return a.disabled ? 1 : -1;
            });

            return (
              <div className="flex flex-col flex-1 overflow-hidden gap-2">
                {selectedRegalos.length > 0 && (
                  <div className={cn("px-3 py-2 rounded-xl text-[11px] font-bold flex justify-between items-center", excedido ? "bg-red-500/10 text-red-500" : cerca ? "bg-amber-500/10 text-amber-500" : "bg-[#0066B3]/10 text-[#0066B3]")}>
                    <span>{excedido ? '¡Excede!' : cerca ? 'Aproximándose' : 'En rango'}</span>
                    <span className="font-black">{fmt(totalRegalos)}</span>
                  </div>
                )}
                
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Máx 10% · Sin combinaciones</p>
                
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar" data-lenis-prevent>
                  <AnimatePresence mode="popLayout">
                    {elegibles.map((p, i) => {
                      return (
                        <motion.div 
                          layout 
                          key={p.code} 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: p.disabled ? 0.3 : 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 0.95 }} 
                          transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.2) }} 
                          onClick={() => !p.fueraDeRango && (!p.excederiaSiAgrego || p.sel) ? toggleRegalo(p) : null}
                          className={cn("px-3 py-2 rounded-xl transition duration-200 relative", p.fueraDeRango ? "cursor-not-allowed border border-transparent" : p.sel ? "bg-[#0066B3]/15 border border-[#0066B3]/30 cursor-pointer" : p.excederiaSiAgrego ? "cursor-not-allowed border border-transparent" : cn(isDark ? "hover:bg-white/5 border border-transparent" : "bg-white border border-slate-100", "cursor-pointer"))}>
                          {REGALOS_VOLUMEN.includes(p.code) && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-amber-500 text-black px-1.5 py-0.5 rounded-full">VOL</span>}
                          <p className={cn("text-[11px] font-bold truncate pr-3", p.sel ? "text-[#0066B3]" : textPrimary)}>{p.name}</p>
                          <div className="flex justify-between items-end mt-1">
                            <p className={cn("text-[9px] font-bold", textSecondary)}>{p.category}</p>
                            <p className={cn("text-[11px] font-black tracking-tight", p.sel ? "text-[#0066B3]" : textPrimary)}>{fmt(p.total)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </section>
  );
}
