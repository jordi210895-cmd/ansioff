'use client';

import { useEffect, useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Check, Loader2, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { PersonalizedPlan } from '@/lib/onboarding';
import type { PaywallProduct } from '@/lib/subscriptions';

export type PaywallPlacement = 'onboarding' | 'feature' | 'reminder' | 'recovery' | 'trialExpired';

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
    onReload: () => Promise<void>;
}

type PlanKind = PaywallProduct['kind'];

const FALLBACK_MONTHLY_PRICE = 8.99;
const FALLBACK_ANNUAL_PRICE = 59.99;

function formatEuro(value: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function Paywall({ open, placement, plan, products, loading = false, onClose, onPurchase, onRestore, onReload }: PaywallProps) {
    const displayProducts = useMemo(
        () => placement === 'recovery' ? products.filter((product) => Boolean(product.winBackOffer)) : products,
        [placement, products],
    );
    const annual = displayProducts.find((product) => product.kind === 'annual');
    const monthly = displayProducts.find((product) => product.kind === 'monthly');
    const [selectedKind, setSelectedKind] = useState<PlanKind>('monthly');
    const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        if (!open) return;
        setSelectedKind(monthly ? 'monthly' : annual ? 'annual' : 'monthly');
        setActionError('');
    }, [annual, monthly, open]);

    const selected = selectedKind === 'monthly' ? monthly : annual;
    const storeName = Capacitor.getPlatform() === 'android' ? 'Play Store' : Capacitor.getPlatform() === 'ios' ? 'App Store' : 'la tienda';
    const monthlyPriceValue = monthly?.priceValue || FALLBACK_MONTHLY_PRICE;
    const annualPriceValue = annual?.priceValue || FALLBACK_ANNUAL_PRICE;
    const yearlyMonthlyCost = monthlyPriceValue * 12;
    const annualSavingsValue = Math.max(0, yearlyMonthlyCost - annualPriceValue);
    const annualSavingsPercent = yearlyMonthlyCost > 0 ? Math.max(0, Math.round((annualSavingsValue / yearlyMonthlyCost) * 100)) : 0;
    const selectedPrice = selected?.price || (selectedKind === 'annual' ? formatEuro(FALLBACK_ANNUAL_PRICE) : formatEuro(FALLBACK_MONTHLY_PRICE));
    const planOptions: Array<{
        kind: PlanKind;
        product?: PaywallProduct;
        title: string;
        price: string;
        period: string;
        badge?: string;
        savings?: string;
    }> = [
        {
            kind: 'monthly',
            product: monthly,
            title: 'Mensual',
            price: monthly?.price || formatEuro(FALLBACK_MONTHLY_PRICE),
            period: 'al mes',
        },
        {
            kind: 'annual',
            product: annual,
            title: 'Anual',
            price: annual?.price || formatEuro(FALLBACK_ANNUAL_PRICE),
            period: 'al año',
            badge: annualSavingsPercent ? `Ahorra ${annualSavingsPercent}%` : 'Mejor valor',
            savings: annualSavingsValue ? `Ahorras ${formatEuro(annualSavingsValue)} al año` : undefined,
        },
    ];

    if (!open) return null;
    const purchase = async () => {
        setBusy('purchase');
        setActionError('');
        try {
            if (!selected) {
                await onReload();
                setActionError('La pasarela está terminando de cargar los planes. Vuelve a tocar “Probar por 0 €” en unos segundos.');
                return;
            }
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
        ? 'Recupera tu espacio de pausa'
        : placement === 'trialExpired'
            ? 'Tus 7 días gratis han terminado'
        : plan?.title || 'Tu plan completo está preparado';
    const subtitle = placement === 'trialExpired'
        ? 'Para seguir usando todas las herramientas, elige Premium mensual o anual.'
        : 'Combina pausas guiadas, reflexión y rutinas para volver cuando lo necesites.';

    return (
        <div className="paywall-root" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
            <style jsx>{`
                .paywall-root{position:fixed;inset:0;z-index:1300;background:#03080f;color:#e5f2f7;overflow-y:auto;font-family:var(--font-plus-jakarta),sans-serif;}
                .paywall-shell{width:100%;max-width:520px;min-height:100%;margin:0 auto;padding:max(14px,env(safe-area-inset-top)) 20px max(18px,env(safe-area-inset-bottom));display:flex;flex-direction:column;}
                .close{width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:#bdd2db;display:flex;align-items:center;justify-content:center;margin-left:auto;cursor:pointer;}
                .hero{padding:10px 0 20px;text-align:center;}
                .hero-mark{width:66px;height:66px;border-radius:20px;background:rgba(90,173,207,.12);border:1px solid rgba(90,173,207,.28);color:#74c7df;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
                .eyebrow{color:#69bdd8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;margin-bottom:9px;}
                h1{font-size:30px;line-height:1.18;letter-spacing:0;margin:0 auto 10px;max-width:430px;}
                .subtitle{font-size:14px;line-height:1.55;color:rgba(210,232,240,.62);max-width:400px;margin:0 auto;}
                .benefits{display:grid;gap:12px;padding:2px 0 20px;}
                .benefit{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;font-size:13px;line-height:1.45;color:#d5e7ed;}
                .benefit-icon{width:24px;height:24px;border-radius:8px;background:rgba(105,189,216,.12);color:#78c9e1;display:flex;align-items:center;justify-content:center;}
                .plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
                .plan{min-height:142px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));border-radius:18px;color:#ddecf2;text-align:left;padding:16px 14px 14px;position:relative;font:inherit;cursor:pointer;box-shadow:0 14px 34px rgba(0,0,0,.18);}
                .plan.selected{border-color:#5aadcf;background:linear-gradient(180deg,rgba(90,173,207,.2),rgba(90,173,207,.07));box-shadow:0 0 0 1px rgba(90,173,207,.22),0 18px 38px rgba(25,95,125,.2);}
                .plan-badge{position:absolute;top:-10px;right:10px;background:#5aadcf;color:#031018;border-radius:999px;padding:4px 8px;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.03em;}
                .plan-name{font-size:13px;font-weight:850;margin-bottom:10px;letter-spacing:.02em;}
                .plan-price{font-size:28px;font-weight:950;line-height:1.02;color:#f1fbff;margin-bottom:6px;letter-spacing:-.03em;}
                .plan-period{font-size:11px;color:rgba(210,232,240,.58);margin-top:5px;}
                .plan-trial{font-size:11px;color:#9be7c6;font-weight:800;line-height:1.25;margin-top:12px;}
                .plan-saving{font-size:10px;line-height:1.35;color:#79d4ed;font-weight:800;margin-top:10px;}
                .store-pill{display:flex;align-items:center;justify-content:center;gap:8px;width:max-content;max-width:100%;margin:2px auto 10px;padding:8px 13px;border:1px solid rgba(210,232,240,.18);border-radius:999px;color:rgba(210,232,240,.72);font-size:12px;font-weight:700;}
                .purchase{width:100%;min-height:58px;border:0;border-radius:16px;background:#5aadcf;color:#031018;font:inherit;font-size:15px;font-weight:850;display:flex;align-items:center;justify-content:center;gap:9px;cursor:pointer;}
                .purchase:disabled{opacity:.45;cursor:default;}
                .no-pay{display:flex;align-items:center;justify-content:center;gap:7px;margin:12px 0 4px;color:rgba(229,242,247,.76);font-size:13px;font-weight:800;}
                .terms{font-size:10px;line-height:1.5;color:rgba(210,232,240,.44);text-align:center;margin:8px auto 4px;max-width:420px;}
                .text-action{width:100%;min-height:38px;border:0;background:transparent;color:#8ca8b5;font:inherit;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;margin:2px 0 8px;}
                .text-action strong{color:#85d0e5;}
                .legal{display:flex;justify-content:center;gap:12px;margin:6px 0 12px;font-size:12px;font-weight:800;flex-wrap:wrap;}
                .legal a{color:#9bdcef;text-decoration:underline;text-underline-offset:3px;}
                .error{background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.25);color:#fda4af;padding:11px 13px;border-radius:12px;font-size:12px;line-height:1.4;margin-bottom:12px;}
                @media(max-height:740px){.hero{padding-top:4px;padding-bottom:14px}.hero-mark{width:52px;height:52px;margin-bottom:12px}h1{font-size:26px}.subtitle{font-size:13px}.benefits{gap:8px;padding-bottom:14px}.plan{min-height:128px;padding:14px 12px}.plan-price{font-size:24px}.paywall-shell{padding-top:max(8px,env(safe-area-inset-top));}}
            `}</style>
            <div className="paywall-shell">
                {placement !== 'trialExpired' && <button className="close" onClick={onClose} aria-label={placement === 'onboarding' ? 'Cerrar y crear cuenta para probar gratis' : 'Cerrar'}><X size={20} /></button>}
                <div className="hero">
                    <div className="hero-mark"><Sparkles size={30} /></div>
                    <div className="eyebrow">ANSIOFF Premium</div>
                    <h1 id="paywall-title">{headline}</h1>
                    <p className="subtitle">{subtitle}</p>
                </div>
                <div className="benefits">
                    {[
                        'Herramientas breves para crear una pausa.',
                        'Diario y reflexión IA para encontrar temas repetidos.',
                        'Rutinas de foco, noche y organización personal.',
                        'Actividad y constancia sin penalizar los descansos.',
                    ].map((benefit) => <div className="benefit" key={benefit}><span className="benefit-icon"><Check size={15} /></span><span>{benefit}</span></div>)}
                </div>

                {actionError && <div className="error">{actionError}</div>}
                <div className="plans" role="radiogroup" aria-label="Elige un plan">
                    {planOptions.map((option) => {
                        const selectedPlan = selectedKind === option.kind;
                        return (
                            <button key={option.kind} className={`plan ${selectedPlan ? 'selected' : ''}`} onClick={() => setSelectedKind(option.kind)} role="radio" aria-checked={selectedPlan}>
                                {option.badge && <span className="plan-badge">{option.badge}</span>}
                                <div className="plan-name">{option.title}</div>
                                <div className="plan-price">{placement === 'recovery' && option.product?.winBackPrice ? option.product.winBackPrice : option.price}</div>
                                <div className="plan-period">{placement === 'recovery' && option.product?.winBackPeriodLabel ? option.product.winBackPeriodLabel : option.period}</div>
                                <div className="plan-trial">Prueba gratuita de 7 días</div>
                                {option.savings && <div className="plan-saving">{option.savings}</div>}
                            </button>
                        );
                    })}
                </div>
                <div className="store-pill"><ShieldCheck size={15} /> Asegurado con {storeName}</div>
                <button className="text-action" onClick={restore} disabled={busy !== null}>
                    {busy === 'restore' ? <Loader2 className="animate-spin" size={15} /> : <RefreshCw size={15} />}
                    Ya tengo un plan. <strong>Restaurar compra</strong>
                </button>
                <div className="legal" aria-label="Enlaces legales de la suscripción">
                    <a href="https://ansioff.com/privacy" target="_blank" rel="noreferrer">Política de privacidad</a>
                    <a href="https://ansioff.com/terms" target="_blank" rel="noreferrer">Términos de uso (EULA)</a>
                </div>
                <button className="purchase" onClick={purchase} disabled={busy !== null || loading}>
                    {busy === 'purchase' ? <Loader2 className="animate-spin" size={19} /> : <Sparkles size={18} />}
                    {placement === 'recovery' ? 'Recuperar ANSIOFF Premium' : 'Probar por 0 €'}
                </button>
                {placement !== 'recovery' && <div className="no-pay"><Check size={17} /> No hay pago ahora</div>}
                <p className="terms">{placement === 'recovery'
                    ? 'La oferta y su elegibilidad proceden de la tienda. Después del periodo mostrado, la suscripción se renueva al precio ordinario indicado.'
                    : `Al tocar “Probar por 0 €”, se abrirá ${storeName} con el plan ${selectedKind === 'annual' ? 'anual' : 'mensual'}. Sin cargo durante 7 días. Después, ${selectedPrice} ${selectedKind === 'annual' ? 'al año' : 'al mes'}, con renovación automática. Puedes cancelar antes de que termine la prueba desde las suscripciones de tu cuenta.`}</p>
            </div>
        </div>
    );
}
