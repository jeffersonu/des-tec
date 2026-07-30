import React, { useState, useEffect } from 'react';
import { Coffee, QrCode, ShoppingCart, Check, CheckCircle2 } from 'lucide-react';

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

/**
 * RestaurantQrDemo Component.
 * Simulates a guest checking-in, reading the interactive menu, adding/removing items in a cart,
 * and dispatching a meal request to the kitchen panel.
 */
export const RestaurantQrDemo: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1 = scanning QR, 2 = browsing menu, 3 = checkout, 4 = complete success
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: 'm1', name: 'Roll Dragón Tempura', price: 12 },
    { id: 'm2', name: 'Nigiri Salmón Especial', price: 10 },
    { id: 'm3', name: 'Ramen Tonkotsu', price: 14 }
  ];

  /**
   * Increases item quantity or adds a new item to the cart map.
   */
  const handleAddToCart = (id: string, name: string, price: number) => {
    setCart((prev) => {
      const existing = prev[id] || { name, price, qty: 0 };
      return {
        ...prev,
        [id]: { ...existing, qty: existing.qty + 1 }
      };
    });
  };

  /**
   * Decreases item quantity or deletes item if quantity drops to zero.
   */
  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: { ...existing, qty: existing.qty - 1 }
      };
    });
  };

  /**
   * Computes cumulative cart values.
   */
  const getCartTotal = () => {
    return (Object.values(cart) as CartItem[]).reduce((total, item) => total + (item.price * item.qty), 0);
  };

  /**
   * Computes cumulative item count.
   */
  const getCartCount = () => {
    return (Object.values(cart) as CartItem[]).reduce((total, item) => total + item.qty, 0);
  };

  /**
   * Dispatches the cart order to the restaurant backend.
   */
  const submitOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1800);
  };

  // Simulates automatic QR scanning latency on first paint or reset
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-slate-100 font-sans max-w-[320px] mx-auto shadow-xl select-none">
      {/* Restaurant Title Header */}
      <div className="bg-slate-950 p-3 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Coffee className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="text-[11px] font-bold text-slate-200">Sushi Lounge (Mesa #4)</h4>
        </div>
        <button
          onClick={() => {
            setStep(1);
            setCart({});
          }}
          className="text-[9px] text-slate-400 hover:text-white cursor-pointer"
        >
          Resetear
        </button>
      </div>

      {/* Screen viewports */}
      <div className="flex-1 p-3 min-h-[220px] max-h-[240px] overflow-y-auto bg-slate-950/45 text-left flex flex-col justify-between">
        
        {/* PHASE 1: QR CODE DETECTOR */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-4 text-center">
            <div className="relative p-3 bg-white rounded-xl border border-slate-800">
              <QrCode className="w-14 h-14 text-slate-900" />
              {/* Animated laser scan lines */}
              <div className="absolute inset-x-0 h-0.5 bg-red-500 animate-bounce top-1/2" />
            </div>
            <div className="text-xs font-bold text-slate-200">Buscando mesa...</div>
            <p className="text-[10px] text-slate-500 max-w-[180px]">Mesa #4 detectada. Iniciando menú interactivo.</p>
          </div>
        )}

        {/* PHASE 2: BROWSE DISHES */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">RECOMENDACIONES</div>
              <div className="space-y-1.5">
                {menuItems.map((item) => {
                  const qty = (cart[item.id] as CartItem | undefined)?.qty || 0;
                  return (
                    <div key={item.id} className="flex justify-between items-center bg-slate-800/80 border border-slate-700/50 p-2 rounded-lg">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-100">{item.name}</h5>
                        <span className="text-[9px] font-mono text-[var(--color-secondary)] font-bold">{item.price}€</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {qty > 0 && (
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 font-bold flex items-center justify-center text-xs cursor-pointer"
                          >
                            -
                          </button>
                        )}
                        {qty > 0 && <span className="text-[10px] font-bold font-mono w-3 text-center">{qty}</span>}
                        <button
                          onClick={() => handleAddToCart(item.id, item.name, item.price)}
                          className="w-5 h-5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky footer checkout bar if cart has items */}
            {getCartCount() > 0 && (
              <button
                onClick={() => setStep(3)}
                className="mt-3 bg-emerald-600 hover:bg-emerald-50 text-white py-1.5 px-2.5 rounded-lg text-[10px] font-bold flex justify-between items-center transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{getCartCount()} productos</span>
                </div>
                <span className="font-mono">{getCartTotal()}€</span>
              </button>
            )}
          </div>
        )}

        {/* PHASE 3: CHECKOUT CART RESUME */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <button
                onClick={() => setStep(2)}
                className="text-[9px] text-[var(--color-primary)] flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <span>← Volver al Menú</span>
              </button>
              <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                RESUMEN DE PEDIDO
              </div>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto">
                {(Object.entries(cart) as Array<[string, CartItem]>).map(([id, item]) => (
                  <div key={id} className="flex justify-between items-center text-[10px]">
                    <span className="truncate max-w-[150px] text-slate-300">
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-100">{item.price * item.qty}€</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span>Total:</span>
                <span className="font-mono text-emerald-400">{getCartTotal()}€</span>
              </div>
              <button
                onClick={submitOrder}
                disabled={isSubmitting}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-2 rounded-lg text-xs font-bold flex justify-center items-center space-x-1 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirmar y Pedir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: DISPATCH SUCCESS SUCCESS */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2.5 py-4 text-center">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h5 className="text-xs font-extrabold text-slate-100">¡Pedido Enviado a Cocina!</h5>
            <p className="text-[9.5px] text-slate-400 max-w-[210px] leading-relaxed">
              Mesa #4 sincronizada en el panel de comanda. El chef está preparando tus platos.
            </p>
            <button
              onClick={() => {
                setCart({});
                setStep(1);
              }}
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg font-bold border border-slate-700/65 transition-colors cursor-pointer"
            >
              Nuevo Escaneo QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantQrDemo;
