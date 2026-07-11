'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, LockKeyhole, RefreshCw, Sparkles, X } from 'lucide-react';
import type { PersonalizedPlan } from '@/lib/onboarding';
import type { PaywallProduct } from '@/lib/subscriptions';

export type PaywallPlacement = 'onboarding' | 'feature' | 'reminder' | 'recovery';

interface PaywallProps {
    open: boolean;
    placement: PaywallPlacement;
    plan: PersonalizedPlan | null;
    products: PaywallProduct[];
    loading?: boolean;
    error?: string;
    onClose: () => void;
    onPurchase: (product: PaywallProduct, useWinBackOffer: boolean) => Promise<void>;
    onRestore: () => Promise<void>;
}

export default function Paywall({ open, placement, plan, products, loading = false, error, onClose, onPurchase, onRestore }: PaywallProps) {
    const displayProducts = useMemo(
        () => placement === 'recovery' ? products.filter((product) => Boolean(product.winBackOffer)) : products,
        [placement, products],
    );
    const annual = displayProducts.find((product) => product.kind === 'annual');
    const [selectedId, setSelectedId] = useState<string | null>(annual?.id || displayProducts[0]?.id || null);
    const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        if (!open) return;
        setSelectedId(annual?.id || displayProducts[0]?.id || null);
        setActionError('');
    }, [annual?.id, displayProducts, open]);

    const selected = useMemo(() => displayProducts.find((product) => product.id === selectedId) || annual || displayProducts[0], [annual, displayProducts, selectedId]);
    if (!open) return null;

    const purchase = async () => {
        if (!selected) return;
        setBusy('purchase');
        setActionError('');
        try {
            await onPurchase(selected, placement === 'recovery');
        } catch (purchaseError: any) {
            if (!purchaseError?.userCancelled) setActionError(purchaseError?.message || 'No se pudo completar la compra. Inténtalo de nuevo.');
        } finally {
            setBusy(null);
        }
    };

    const restore = async () => {
        setBusy('restore');
        setActionError('');
        try {
            await onRestore();
        } catch (restoreError: any) {
            setActionError(restoreError?.message || 'No encontramos una compra que restaurar.');
        } finally {
            setBusy(null);
        }
    };

    const headline = placement === 'recovery'
        ? 'Recupera tu espacio de calma'
        : plan?.title || 'Tu plan completo está preparado';

    return (
        <div className="paywall-root" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
            <style jsx>{`
                .paywall-root{position:fixed;inset:0;z-index:1300;background:#03080f;color:#e5f2f7;overflow-y:auto;font-family:var(--font-plus-jakarta),sans-serif;}
                .paywall-shell{width:100%;max-width:520px;min-height:100%;margin:0 auto;padding:max(16px,env(safe-area-inset-top)) 20px max(18px,env(safe-area-inset-bottom));display:flex;flex-direction:column;}
                .close{width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:#bdd2db;display:flex;align-items:center;justify-content:center;margin-left:auto;cursor:pointer;}
                .hero{padding:12px 0 24px;text-align:center;}
                .hero-mark{width:66px;height:66px;border-radius:20px;background:rgba(90,173,207,.12);border:1px solid rgba(90,173,207,.28);color:#74c7df;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;}
                .eyebrow{color:#69bdd8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;margin-bottom:9px;}
                h1{font-size:30px;line-height:1.18;letter-spacing:0;margin:0 auto 10px;max-width:430px;}
                .subtitle{font-size:14px;line-height:1.55;color:rgba(210,232,240,.62);max-width:400px;margin:0 auto;}
                .benefits{display:grid;gap:12px;padding:2px 0 22px;}
                .benefit{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;font-size:13px;line-height:1.45;color:#d5e7ed;}
                .benefit-icon{width:24px;height:24px;border-radius:8px;background:rgba(105,189,216,.12);color:#78c9e1;display:flex;align-items:center;justify-content:center;}
                .plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
                .plan{min-height:112px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);border-radius:16px;color:#ddecf2;text-align:left;padding:15px;position:relative;font:inherit;cursor:pointer;}
                .plan.selected{border-color:#5aadcf;background:rgba(90,173,207,.11);}
                .plan-badge{position:absolute;top:-10px;right:10px;background:#5aadcf;color:#031018;border-radius:999px;padding:4px 8px;font-size:9px;font-weight:850;text-transform:uppercase;}
                .plan-name{font-size:13px;font-weight:800;margin-bottom:9px;}
                .plan-price{font-size:21px;font-weight:800;line-height:1.15;}
                .plan-period{font-size:10px;color:rgba(210,232,240,.5);margin-top:4px;}
                .trial{font-size:10px;color:#83d9b3;font-weight:750;margin-top:8px;}
                .purchase{width:100%;min-height:58px;border:0;border-radius:16px;background:#5aadcf;color:#031018;font:inherit;font-size:15px;font-weight:850;display:flex;align-items:center;justify-content:center;gap:9px;cursor:pointer;}
                .purchase:disabled{opacity:.45;cursor:default;}
                .terms{font-size:10px;line-height:1.5;color:rgba(210,232,240,.44);text-align:center;margin:11px auto 4px;max-width:420px;}
                .text-action{width:100%;min-height:42px;border:0;background:transparent;color:#8ca8b5;font:inherit;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;}
                .text-action strong{color:#85d0e5;}
                .legal{display:flex;justify-content:center;gap:18px;margin-top:auto;padding-top:8px;font-size:10px;}
                .legal a{color:rgba(210,232,240,.5);}
                .error{background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.25);color:#fda4af;padding:11px 13px;border-radius:12px;font-size:12px;line-height:1.4;margin-bottom:12px;}
                .unavailable{padding:26px 0;text-align:center;color:rgba(210,232,240,.6);font-size:13px;line-height:1.5;}
                @media(max-height:700px){.hero{padding-top:4px;padding-bottom:14px}.hero-mark{width:52px;height:52px;margin-bottom:12px}h1{font-size:26px}.benefits{gap:8px;padding-bottom:14px}.plan{min-height:100px}.paywall-shell{padding-top:max(8px,env(safe-area-inset-top));}}
            `}</style>
            <div className="paywall-shell">
                <button className="close" onClick={onClose} aria-label="Cerrar y continuar gratis"><X size={20} /></button>
                <div className="hero">
                    <div className="hero-mark"><Sparkles size={30} /></div>
                    <div className="eyebrow">ANSIOFF Premium</div>
                    <h1 id="paywall-title">{headline}</h1>
                    <p className="subtitle">Combina apoyo inmediato, reflexión y rutinas para volver cuando lo necesites.</p>
                </div>
                <div className="benefits">
                    {[
                        'Herramientas inmediatas cuando sube el malestar.',
                        'Diario y reflexión IA para encontrar temas repetidos.',
                        'Rutinas de respiración, sueño y autocuidado.',
                        'Actividad y constancia sin penalizar los descansos.',
                    ].map((benefit) => <div className="benefit" key={benefit}><span className="benefit-icon"><Check size={15} /></span><span>{benefit}</span></div>)}
                </div>

                {(error || actionError) && <div className="error">{actionError || error}</div>}
                {loading && <div className="unavailable"><Loader2 className="animate-spin" style={{ margin: '0 auto 10px' }} />Cargando precios de la App Store...</div>}
                {!loading && displayProducts.length > 0 && (
                    <>
                        <div className="plans" role="radiogroup" aria-label="Elige un plan">
                            {displayProducts.map((product) => (
                                <button key={product.id} className={`plan ${selected?.id === product.id ? 'selected' : ''}`} onClick={() => setSelectedId(product.id)} role="radio" aria-checked={selected?.id === product.id}>
                                    {product.kind === 'annual' && <span className="plan-badge">{placement === 'recovery' ? (product.winBackDiscountPercent ? `${product.winBackDiscountPercent}% real` : 'Oferta real') : 'Mejor valor'}</span>}
                                    <div className="plan-name">{product.title}</div>
                                    <div className="plan-price">{placement === 'recovery' ? product.winBackPrice : product.price}</div>
                                    <div className="plan-period">{placement === 'recovery' ? product.winBackPeriodLabel : product.kind === 'annual' ? `al año${product.monthlyEquivalent ? ` · ${product.monthlyEquivalent}/mes` : ''}` : 'al mes'}</div>
                                    {placement !== 'recovery' && product.trialLabel && <div className="trial">{product.trialLabel}</div>}
                                </button>
                            ))}
                        </div>
                        <button className="purchase" onClick={purchase} disabled={!selected || busy !== null}>
                            {busy === 'purchase' ? <Loader2 className="animate-spin" size={19} /> : <LockKeyhole size={18} />}
                            {placement === 'recovery' ? 'Recuperar ANSIOFF Premium' : selected?.trialLabel ? `Empezar ${selected.trialLabel}` : `Continuar con ${selected?.title.toLowerCase()}`}
                        </button>
                        <p className="terms">{placement === 'recovery' ? 'La oferta y su elegibilidad proceden de la App Store. Después del periodo mostrado, la suscripción se renueva al precio ordinario indicado por Apple.' : 'La suscripción se renueva automáticamente por el precio y periodo mostrados por la App Store. Puedes cancelarla antes de la renovación desde las suscripciones de tu Apple ID.'}</p>
                    </>
                )}
                {!loading && displayProducts.length === 0 && <div className="unavailable">Los planes no están disponibles ahora mismo. Puedes continuar con las herramientas gratuitas y volver a intentarlo más tarde.</div>}
                <button className="text-action" onClick={onClose}><strong>Continuar con la versión gratuita</strong></button>
                <button className="text-action" onClick={restore} disabled={busy !== null}>{busy === 'restore' ? <Loader2 className="animate-spin" size={15} /> : <RefreshCw size={15} />} Restaurar compras</button>
                <div className="legal"><a href="/privacy" target="_blank">Privacidad</a><a href="https://ansioff.com/terms" target="_blank" rel="noreferrer">Términos</a></div>
            </div>
        </div>
    );
}
