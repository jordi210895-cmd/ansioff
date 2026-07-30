'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Check, Share2, Download, Eye, Calendar, Sparkles } from 'lucide-react';
import { generateReportPDF, ReportOptions, ReportDataCounts, getReportCounts } from '@/utils/exportUtils';

interface ExportReportScreenProps {
    onBack: () => void;
    userId?: string;
    isPremium?: boolean;
    onUpgrade?: () => void;
}

export default function ExportReportScreen({ onBack, userId }: ExportReportScreenProps) {
    const [period, setPeriod] = useState<'semanal' | 'mensual'>('mensual');
    const [sections, setSections] = useState({
        mood: true,
        diary: true,
        exposure: true,
        goals: true,
    });
    const [counts, setCounts] = useState<ReportDataCounts>({
        moodCount: 0,
        diaryCount: 0,
        exposureSituations: 0,
        exposureCount: 0,
        goalsCount: 0,
        goalsTotal: 0,
        avgAnxiety: 0,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState<{
        fileName: string;
        fileSize: string;
        blobUrl: string;
        pdfDoc?: any;
    } | null>(null);

    useEffect(() => {
        setCounts(getReportCounts(period, userId));
    }, [period, userId]);

    const toggleSection = (key: keyof typeof sections) => {
        setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const getCurrentPeriodLabel = () => {
        const now = new Date();
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        if (period === 'mensual') {
            return `${monthNames[now.getMonth()].slice(0, 3)} ${now.getFullYear()}`;
        }
        return 'Últimos 7 días';
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        setTimeout(() => {
            try {
                const options: ReportOptions = {
                    period,
                    includeMood: sections.mood,
                    includeDiary: sections.diary,
                    includeExposure: sections.exposure,
                    includeGoals: sections.goals,
                    userId,
                };
                const result = generateReportPDF(options);
                setPdfGenerated(result);
            } catch (err) {
                console.error('Error al generar PDF', err);
            } finally {
                setIsGenerating(false);
            }
        }, 300);
    };

    const handleDownload = () => {
        if (!pdfGenerated) return;
        if (pdfGenerated.pdfDoc && typeof pdfGenerated.pdfDoc.save === 'function') {
            pdfGenerated.pdfDoc.save(pdfGenerated.fileName);
        } else {
            const a = document.createElement('a');
            a.href = pdfGenerated.blobUrl;
            a.download = pdfGenerated.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleShare = async () => {
        if (!pdfGenerated) return;
        if (navigator.share && window.isSecureContext) {
            try {
                const response = await fetch(pdfGenerated.blobUrl);
                const blob = await response.blob();
                const file = new File([blob], pdfGenerated.fileName, { type: 'application/pdf' });
                await navigator.share({
                    title: 'Informe ANSIOFF',
                    text: 'Te comparto mi informe de progreso de ANSIOFF.',
                    files: [file],
                });
                return;
            } catch (e) {
                console.warn('Share API non-critical fallback:', e);
            }
        }
        window.open(pdfGenerated.blobUrl, '_blank');
    };

    return (
        <div className="report-screen">
            <style jsx>{`
                .report-screen {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    background: #0f0c1e;
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
                    z-index: 50;
                }
                .report-screen::before {
                    content: '';
                    position: absolute;
                    top: -80px;
                    left: -80px;
                    width: 320px;
                    height: 320px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(75, 20, 140, 0.45), transparent 70%);
                    pointer-events: none;
                }
                .report-scroll {
                    position: relative;
                    z-index: 1;
                    height: 100%;
                    overflow-y: auto;
                    padding: calc(20px + var(--safe-top, 0px)) 20px calc(180px + var(--safe-bottom, 0px));
                    scrollbar-width: none;
                }
                .report-scroll::-webkit-scrollbar { display: none; }

                .report-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 22px;
                }
                .report-title {
                    font-size: 34px;
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.5px;
                    color: #fff;
                    margin-bottom: 5px;
                }
                .report-sub {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.42);
                }
                .back-btn {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.75);
                    cursor: pointer;
                }

                .sections-title {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.13em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.3);
                    margin-bottom: 10px;
                }

                .period-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 18px;
                }
                .period-tab {
                    flex: 1;
                    padding: 11px;
                    border-radius: 14px;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    color: rgba(255, 255, 255, 0.45);
                }
                .period-tab.active {
                    background: rgba(0, 196, 255, 0.12);
                    border-color: rgba(0, 196, 255, 0.4);
                    color: #00c4ff;
                }

                .date-range {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    border-radius: 14px;
                    padding: 12px 14px;
                    margin-bottom: 22px;
                }
                .date-ico { font-size: 16px; }
                .date-txt { font-size: 13px; color: rgba(255, 255, 255, 0.55); flex: 1; }
                .date-val { font-size: 13px; font-weight: 600; color: #00c4ff; }

                .section-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    border-radius: 16px;
                    padding: 14px 16px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    user-select: none;
                    transition: border-color 0.18s ease, background 0.18s ease;
                }
                .section-row.active {
                    border-color: rgba(0, 196, 255, 0.25);
                    background: rgba(255, 255, 255, 0.08);
                }
                .section-ico {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: rgba(0, 196, 255, 0.1);
                    border: 1px solid rgba(0, 196, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                .section-info { flex: 1; }
                .section-name { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 2px; }
                .section-count { font-size: 11px; color: rgba(255, 255, 255, 0.38); }
                .section-check {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: transparent;
                    transition: all 0.18s ease;
                }
                .section-check.checked {
                    background: #00c4ff;
                    border-color: #00c4ff;
                    color: #07101e;
                    font-weight: 800;
                }

                .gen-btn {
                    width: 100%;
                    padding: 16px;
                    margin-top: 14px;
                    background: #00c4ff;
                    color: #07101e;
                    border: none;
                    border-radius: 16px;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    font-family: inherit;
                    letter-spacing: 0.02em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    box-shadow: 0 8px 24px rgba(0, 196, 255, 0.28);
                    transition: transform 0.18s ease, opacity 0.18s ease;
                }
                .gen-btn:active { transform: scale(0.98); }
                .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .preview-card {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(0, 196, 255, 0.3);
                    border-radius: 16px;
                    padding: 14px 16px;
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slide-up 0.25s ease-out;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .preview-ico { font-size: 28px; }
                .preview-info { flex: 1; min-width: 0; }
                .preview-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 3px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .preview-size { font-size: 11px; color: rgba(255, 255, 255, 0.38); }
                .preview-actions { display: flex; gap: 6px; }
                .preview-btn {
                    background: rgba(0, 196, 255, 0.12);
                    border: 1px solid rgba(0, 196, 255, 0.3);
                    border-radius: 10px;
                    padding: 7px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #00c4ff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            `}</style>

            <div className="report-scroll">
                <header className="report-header">
                    <div>
                        <h1 className="report-title">Informe<br />para tu psicólogo</h1>
                        <p className="report-sub">Exporta tu progreso en PDF</p>
                    </div>
                    <button className="back-btn" onClick={onBack} aria-label="Volver">
                        <ArrowLeft size={18} />
                    </button>
                </header>

                <div className="sections-title">Periodo del informe</div>
                <div className="period-tabs">
                    <button
                        className={`period-tab ${period === 'semanal' ? 'active' : ''}`}
                        onClick={() => setPeriod('semanal')}
                        type="button"
                    >
                        Semanal
                    </button>
                    <button
                        className={`period-tab ${period === 'mensual' ? 'active' : ''}`}
                        onClick={() => setPeriod('mensual')}
                        type="button"
                    >
                        Mensual
                    </button>
                </div>

                <div className="date-range">
                    <span className="date-ico">📅</span>
                    <span className="date-txt">Periodo seleccionado</span>
                    <span className="date-val">{getCurrentPeriodLabel()}</span>
                </div>

                <div className="sections-title">Incluir en el informe</div>

                <div
                    className={`section-row ${sections.mood ? 'active' : ''}`}
                    onClick={() => toggleSection('mood')}
                >
                    <div className="section-ico">😌</div>
                    <div className="section-info">
                        <div className="section-name">Estado de ánimo</div>
                        <div className="section-count">
                            {counts.moodCount} registros este {period === 'mensual' ? 'mes' : 'periodo'}
                        </div>
                    </div>
                    <div className={`section-check ${sections.mood ? 'checked' : ''}`}>
                        ✓
                    </div>
                </div>

                <div
                    className={`section-row ${sections.diary ? 'active' : ''}`}
                    onClick={() => toggleSection('diary')}
                >
                    <div className="section-ico">📝</div>
                    <div className="section-info">
                        <div className="section-name">Diario</div>
                        <div className="section-count">
                            {counts.diaryCount} entradas este {period === 'mensual' ? 'mes' : 'periodo'}
                        </div>
                    </div>
                    <div className={`section-check ${sections.diary ? 'checked' : ''}`}>
                        ✓
                    </div>
                </div>

                <div
                    className={`section-row ${sections.exposure ? 'active' : ''}`}
                    onClick={() => toggleSection('exposure')}
                >
                    <div className="section-ico">📈</div>
                    <div className="section-info">
                        <div className="section-name">Exposición gradual</div>
                        <div className="section-count">
                            {counts.exposureSituations} situaciones · {counts.exposureCount} exposiciones
                        </div>
                    </div>
                    <div className={`section-check ${sections.exposure ? 'checked' : ''}`}>
                        ✓
                    </div>
                </div>

                <div
                    className={`section-row ${sections.goals ? 'active' : ''}`}
                    onClick={() => toggleSection('goals')}
                >
                    <div className="section-ico">🎯</div>
                    <div className="section-info">
                        <div className="section-name">Objetivos cumplidos</div>
                        <div className="section-count">
                            {counts.goalsCount} objetivos este {period === 'mensual' ? 'mes' : 'periodo'}
                        </div>
                    </div>
                    <div className={`section-check ${sections.goals ? 'checked' : ''}`}>
                        ✓
                    </div>
                </div>

                <button
                    className="gen-btn"
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || (!sections.mood && !sections.diary && !sections.exposure && !sections.goals)}
                >
                    <span className="gen-btn-ico">📄</span>
                    {isGenerating ? 'Generando informe...' : 'Generar informe PDF'}
                </button>

                {pdfGenerated && (
                    <div className="preview-card">
                        <span className="preview-ico">📋</span>
                        <div className="preview-info">
                            <div className="preview-name">{pdfGenerated.fileName}</div>
                            <div className="preview-size">Listo · {pdfGenerated.fileSize}</div>
                        </div>
                        <div className="preview-actions">
                            <button className="preview-btn" onClick={handleDownload}>
                                <Download size={14} /> Descargar
                            </button>
                            <button className="preview-btn" onClick={handleShare}>
                                <Share2 size={14} /> Compartir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
