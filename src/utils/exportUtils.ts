import { jsPDF } from 'jspdf';
import { getStats } from './stats';

export interface ReportOptions {
    period: 'semanal' | 'mensual';
    includeMood: boolean;
    includeDiary: boolean;
    includeExposure: boolean;
    includeGoals: boolean;
    userId?: string;
}

export interface ReportDataCounts {
    moodCount: number;
    diaryCount: number;
    exposureSituations: number;
    exposureCount: number;
    goalsCount: number;
    goalsTotal: number;
    avgAnxiety: number;
}

interface Note {
    id: number | string;
    text?: string;
    content?: string;
    created_at?: string;
    date?: string;
}

interface CBTEntry {
    id: number | string;
    date?: string;
    created_at?: string;
    trigger?: string;
    thought?: string;
    negative_thought?: string;
    emotions?: string;
    evidence?: string;
    distortion?: string | null;
    cognitive_distortion?: string;
    alternative?: string;
    alternative_thought?: string;
    belief_before?: number;
    belief_after?: number;
}

interface ExposureEntry {
    id: string;
    before: number;
    during: number;
    after: number;
    tool: string;
    comment: string;
    createdAt: string;
}

interface ExposureSituation {
    id: string;
    name: string;
    level: number;
    entries: ExposureEntry[];
}

export function getReportCounts(period: 'semanal' | 'mensual', userId?: string): ReportDataCounts {
    if (typeof window === 'undefined') {
        return {
            moodCount: 0,
            diaryCount: 0,
            exposureSituations: 0,
            exposureCount: 0,
            goalsCount: 0,
            goalsTotal: 0,
            avgAnxiety: 0,
        };
    }

    const now = new Date();
    const daysLimit = period === 'semanal' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysLimit);

    // 1. Mood
    let moodCount = 0;
    let totalAnxiety = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ansioff_home_mood_')) {
            const dateStr = key.replace('ansioff_home_mood_', '');
            const date = new Date(dateStr);
            if (!isNaN(date.getTime()) && date >= cutoffDate) {
                try {
                    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
                    if (parsed && typeof parsed.anxiety === 'number') {
                        moodCount++;
                        totalAnxiety += parsed.anxiety;
                    }
                } catch { }
            }
        }
    }

    // 2. Diary (Notes & CBT)
    let diaryCount = 0;
    try {
        const notesStr = localStorage.getItem('ansioff_notes');
        const notes: Note[] = notesStr ? JSON.parse(notesStr) : [];
        diaryCount += notes.filter((n) => {
            const d = new Date(n.created_at || n.date || '');
            return !isNaN(d.getTime()) && d >= cutoffDate;
        }).length;
    } catch { }

    try {
        const cbtStr = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries');
        const cbt: CBTEntry[] = cbtStr ? JSON.parse(cbtStr) : [];
        diaryCount += cbt.filter((c) => {
            const d = new Date(c.created_at || c.date || '');
            return !isNaN(d.getTime()) && d >= cutoffDate;
        }).length;
    } catch { }

    // 3. Exposure
    let exposureSituations = 0;
    let exposureCount = 0;
    try {
        const key = `ansioff_exposure_hierarchy_v1:${userId || 'guest'}`;
        const raw = localStorage.getItem(key);
        const situations: ExposureSituation[] = raw ? JSON.parse(raw) : [];
        exposureSituations = situations.length;
        situations.forEach((s) => {
            if (Array.isArray(s.entries)) {
                exposureCount += s.entries.filter((e) => {
                    const d = new Date(e.createdAt || '');
                    return !isNaN(d.getTime()) && d >= cutoffDate;
                }).length;
            }
        });
    } catch { }

    // 4. Goals
    let goalsCount = 0;
    let goalsTotal = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ansioff_home_goal_') && !key.includes('streak') && !key.includes('last')) {
            const dateStr = key.replace('ansioff_home_goal_', '');
            const date = new Date(dateStr);
            if (!isNaN(date.getTime()) && date >= cutoffDate) {
                try {
                    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
                    if (parsed && parsed.text) {
                        goalsTotal++;
                        if (parsed.done) goalsCount++;
                    }
                } catch { }
            }
        }
    }

    const avgAnxiety = moodCount > 0 ? Number((totalAnxiety / moodCount).toFixed(1)) : 0;

    return {
        moodCount,
        diaryCount,
        exposureSituations,
        exposureCount,
        goalsCount,
        goalsTotal,
        avgAnxiety,
    };
}

export function generateReportPDF(options: ReportOptions) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const counts = getReportCounts(options.period, options.userId);
    const now = new Date();
    const daysLimit = options.period === 'semanal' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysLimit);

    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = monthNames[now.getMonth()];
    const periodSub = options.period === 'mensual'
        ? `${monthName} ${now.getFullYear()} · 1–31 ${monthName.toLowerCase()}`
        : `Últimos 7 días · ${(now.getDate() - 6).toString().padStart(2, '0')}–${now.getDate()} ${monthName.toLowerCase()}`;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;

    // Header Background (#0a0f1e -> #1a1040)
    doc.setFillColor(10, 15, 30);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Logo ANSIOFF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('ANSI', 14, 14);
    doc.setTextColor(0, 196, 255);
    doc.text('OFF', 33, 14);

    // Tagline
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 195, 220);
    doc.text('Calma · Respira · Vive', 14, 19);

    // Report Title & Period
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Informe de progreso ${options.period}`, 14, 29);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 196, 255);
    doc.text(periodSub, 14, 35);

    // Generation timestamp (right aligned)
    doc.setFontSize(8);
    doc.setTextColor(160, 175, 200);
    doc.text(`Generado el ${formattedDate}`, pageWidth - 14, 29, { align: 'right' });
    doc.setTextColor(120, 135, 160);
    doc.text('ANSIOFF v2.1', pageWidth - 14, 34, { align: 'right' });

    y = 42;

    // Stats Row (4 boxes)
    const boxWidth = pageWidth / 4;
    doc.setFillColor(248, 249, 252);
    doc.rect(0, y, pageWidth, 20, 'F');

    doc.setDrawColor(232, 234, 240);
    doc.line(0, y + 20, pageWidth, y + 20);

    const statsData = [
        { num: String(counts.moodCount), label: 'REGISTROS', color: [10, 15, 30] },
        { num: counts.avgAnxiety > 0 ? String(counts.avgAnxiety) : '—', label: 'ANSIEDAD MEDIA', color: [0, 168, 216] },
        { num: String(counts.goalsCount), label: 'OBJETIVOS', color: [26, 158, 92] },
        { num: String(counts.exposureCount), label: 'EXPOSICIONES', color: [212, 122, 0] },
    ];

    statsData.forEach((st, i) => {
        const xPos = i * boxWidth;
        if (i > 0) {
            doc.line(xPos, y + 3, xPos, y + 17);
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(st.color[0], st.color[1], st.color[2]);
        doc.text(st.num, xPos + boxWidth / 2, y + 9, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(136, 136, 136);
        doc.text(st.label, xPos + boxWidth / 2, y + 15, { align: 'center' });
    });

    y += 26;

    // Helper for Section Headers
    const drawSectionHeader = (title: string, icon: string) => {
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(10, 15, 30);
        doc.text(`${icon}  ${title.toUpperCase()}`, 14, y);
        doc.setDrawColor(0, 196, 255);
        doc.setLineWidth(0.6);
        doc.line(14, y + 2, pageWidth - 14, y + 2);
        doc.setLineWidth(0.2);
        y += 8;
    };

    // 1. ESTADO DE ÁNIMO DIARIO
    if (options.includeMood) {
        drawSectionHeader('Estado de ánimo diario', '😌');

        // Fetch real mood entries from localStorage
        const moodEntries: { dateStr: string; emoji: string; label: string; anxiety: number }[] = [];
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ansioff_home_mood_')) {
                    const dateStr = key.replace('ansioff_home_mood_', '');
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime()) && date >= cutoffDate) {
                        try {
                            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
                            if (parsed && parsed.label && typeof parsed.anxiety === 'number') {
                                const formattedDay = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                                moodEntries.push({
                                    dateStr: formattedDay,
                                    emoji: parsed.emoji || '😐',
                                    label: parsed.label,
                                    anxiety: parsed.anxiety,
                                });
                            }
                        } catch { }
                    }
                }
            }
        }

        if (moodEntries.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 140, 140);
            doc.text('No hay registros de estado de ánimo guardados en este periodo.', 14, y + 4);
            y += 12;
        } else {
            // Table header
            doc.setFillColor(240, 242, 248);
            doc.rect(14, y, pageWidth - 28, 7, 'F');

            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(85, 85, 85);
            doc.text('FECHA', 18, y + 5);
            doc.text('ESTADO', 65, y + 5);
            doc.text('ANSIEDAD', 130, y + 5);
            y += 8;

            moodEntries.forEach((row) => {
                if (y > pageHeight - 25) {
                    doc.addPage();
                    y = 20;
                }
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(51, 51, 51);
                doc.text(row.dateStr, 18, y + 4);
                doc.text(`${row.emoji} ${row.label}`, 65, y + 4);

                // Bar background
                doc.setFillColor(240, 242, 248);
                doc.rect(130, y + 1, 30, 4, 'F');
                // Bar fill
                doc.setFillColor(0, 196, 255);
                doc.rect(130, y + 1, (row.anxiety / 10) * 30, 4, 'F');

                doc.text(`${row.anxiety}/10`, 164, y + 4);

                doc.setDrawColor(240, 242, 248);
                doc.line(14, y + 6, pageWidth - 14, y + 6);
                y += 7;
            });

            doc.setFontSize(7.5);
            doc.setTextColor(153, 153, 153);
            doc.text(`Mostrando ${moodEntries.length} registros. Ansiedad media del periodo: ${counts.avgAnxiety} / 10`, 14, y + 3);
            y += 10;
        }
    }

    // 2. DIARIO DE PENSAMIENTOS
    if (options.includeDiary) {
        drawSectionHeader('Diario de pensamientos', '📝');

        const realEntries: { dateStr: string; text: string }[] = [];
        if (typeof window !== 'undefined') {
            try {
                const notesStr = localStorage.getItem('ansioff_notes');
                const notes: Note[] = notesStr ? JSON.parse(notesStr) : [];
                notes.forEach((n) => {
                    const d = new Date(n.created_at || n.date || '');
                    if (!isNaN(d.getTime()) && d >= cutoffDate && (n.text || n.content)) {
                        const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} · ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                        realEntries.push({ dateStr, text: (n.text || n.content || '').trim() });
                    }
                });
            } catch { }

            try {
                const cbtStr = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries');
                const cbt: CBTEntry[] = cbtStr ? JSON.parse(cbtStr) : [];
                cbt.forEach((c) => {
                    const d = new Date(c.created_at || c.date || '');
                    if (!isNaN(d.getTime()) && d >= cutoffDate) {
                        const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                        const thought = c.thought || c.negative_thought || c.trigger || '';
                        const pattern = c.distortion || c.cognitive_distortion || '';
                        const evidence = c.evidence || c.emotions || '';
                        const alternative = c.alternative || c.alternative_thought || '';
                        const content = [
                            thought && `Pensamiento: ${thought}`,
                            pattern && `Patrón: ${pattern}`,
                            evidence && `Evidencia: ${evidence}`,
                            alternative && `Alternativa amable: ${alternative}`,
                        ].filter(Boolean).join('\n');
                        if (content) realEntries.push({ dateStr, text: content });
                    }
                });
            } catch { }
        }

        if (realEntries.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 140, 140);
            doc.text('No hay entradas de diario registradas en este periodo.', 14, y + 4);
            y += 12;
        } else {
            realEntries.forEach((ent) => {
                if (y > pageHeight - 35) {
                    doc.addPage();
                    y = 20;
                }

                const splitLines = doc.splitTextToSize(ent.text, pageWidth - 36);
                const boxHeight = 10 + splitLines.length * 4;

                doc.setFillColor(248, 249, 252);
                doc.rect(14, y, pageWidth - 28, boxHeight, 'F');
                doc.setFillColor(0, 196, 255);
                doc.rect(14, y, 1.5, boxHeight, 'F');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7.5);
                doc.setTextColor(0, 160, 200);
                doc.text(ent.dateStr, 18, y + 5);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(51, 51, 51);
                doc.text(splitLines, 18, y + 9);

                y += boxHeight + 4;
            });
            y += 4;
        }
    }

    // 3. EXPOSICIÓN GRADUAL
    if (options.includeExposure) {
        drawSectionHeader('Exposición gradual', '📈');

        const realSituations: { title: string; initialLevel: number; count: number; avgReduction: string }[] = [];
        if (typeof window !== 'undefined') {
            try {
                const key = `ansioff_exposure_hierarchy_v1:${options.userId || 'guest'}`;
                const raw = localStorage.getItem(key);
                const situations: ExposureSituation[] = raw ? JSON.parse(raw) : [];
                situations.forEach((s) => {
                    const validEntries = (s.entries || []).filter((e) => {
                        const d = new Date(e.createdAt || '');
                        return !isNaN(d.getTime()) && d >= cutoffDate;
                    });
                    if (validEntries.length > 0) {
                        const totalRed = validEntries.reduce((acc, curr) => acc + (curr.before - curr.after), 0);
                        const avgRed = (totalRed / validEntries.length).toFixed(1);
                        realSituations.push({
                            title: s.name,
                            initialLevel: s.level,
                            count: validEntries.length,
                            avgReduction: totalRed > 0 ? `-${avgRed}` : `${avgRed}`,
                        });
                    }
                });
            } catch { }
        }

        if (realSituations.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 140, 140);
            doc.text('No hay registros de exposición en este periodo.', 14, y + 4);
            y += 12;
        } else {
            realSituations.forEach((exp) => {
                if (y > pageHeight - 30) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFillColor(248, 249, 252);
                doc.rect(14, y, pageWidth - 28, 16, 'F');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(10, 15, 30);
                doc.text(exp.title, 18, y + 6);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(85, 85, 85);
                doc.text(
                    `Nivel inicial: ${exp.initialLevel} · ${exp.count} exposiciones este periodo · Reducción media: `,
                    18,
                    y + 11
                );
                doc.setTextColor(26, 158, 92);
                doc.setFont('helvetica', 'bold');
                doc.text(exp.avgReduction, 125, y + 11);

                y += 20;
            });
            y += 4;
        }
    }

    // 4. OBJETIVOS CUMPLIDOS
    if (options.includeGoals) {
        drawSectionHeader('Objetivos cumplidos', '🎯');

        const realGoals: { text: string; dateStr: string }[] = [];
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ansioff_home_goal_') && !key.includes('streak') && !key.includes('last')) {
                    const dateStr = key.replace('ansioff_home_goal_', '');
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime()) && date >= cutoffDate) {
                        try {
                            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
                            if (parsed && parsed.text && parsed.done) {
                                const formattedDay = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                                realGoals.push({ text: parsed.text, dateStr: formattedDay });
                            }
                        } catch { }
                    }
                }
            }
        }

        if (realGoals.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 140, 140);
            doc.text('No hay objetivos completados en este periodo.', 14, y + 4);
            y += 12;
        } else {
            realGoals.forEach((g) => {
                if (y > pageHeight - 30) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFillColor(26, 158, 92);
                doc.circle(17, y + 2.5, 2, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(255, 255, 255);
                doc.text('v', 16.2, y + 3.2);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(51, 51, 51);
                doc.text(g.text, 22, y + 3.5);

                doc.setFontSize(7.5);
                doc.setTextColor(153, 153, 153);
                doc.text(g.dateStr, pageWidth - 18, y + 3.5, { align: 'right' });

                doc.setDrawColor(240, 242, 248);
                doc.line(14, y + 6, pageWidth - 14, y + 6);
                y += 7;
            });

            const percent = counts.goalsTotal > 0 ? Math.round((counts.goalsCount / counts.goalsTotal) * 100) : 0;
            doc.setFontSize(7.5);
            doc.setTextColor(153, 153, 153);
            doc.text(
                `${counts.goalsCount} de ${counts.goalsTotal} objetivos completados este periodo (${percent}% de cumplimiento)`,
                14,
                y + 3
            );
        }
    }

    // PDF Footer on every page
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(240, 242, 248);
        doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(136, 136, 136);
        doc.text(
            'Este informe ha sido generado automáticamente por ANSIOFF. No constituye un diagnóstico clínico.',
            14,
            pageHeight - 5
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(10, 15, 30);
        doc.text('ANSI', pageWidth - 26, pageHeight - 5);
        doc.setTextColor(0, 168, 216);
        doc.text('OFF', pageWidth - 18, pageHeight - 5);
    }

    const fileName = `ANSIOFF_${options.period === 'mensual' ? monthName : 'Semanal'}_${now.getFullYear()}.pdf`;
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const fileSizeMB = (pdfBlob.size / (1024 * 1024)).toFixed(1);
    const fileSizeKB = (pdfBlob.size / 1024).toFixed(0);
    const fileSize = pdfBlob.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

    return {
        fileName,
        fileSize,
        blobUrl,
        pdfDoc: doc,
    };
}

export const exportClinicalDiaryPDF = () => {
    try {
        const result = generateReportPDF({
            period: 'mensual',
            includeMood: true,
            includeDiary: true,
            includeExposure: true,
            includeGoals: true,
        });
        return downloadReportPDF(result, 'Ansioff_Diario_Clinico.pdf');
    } catch (error) {
        console.error('Error generating PDF', error);
        return false;
    }
};

interface DownloadableReport {
    fileName: string;
    blobUrl: string;
    pdfDoc?: {
        save?: (fileName: string) => void;
    };
}

export function downloadReportPDF(
    result: DownloadableReport,
    fileName = result.fileName
): boolean {
    try {
        if (typeof document !== 'undefined' && result.blobUrl) {
            const link = document.createElement('a');
            link.href = result.blobUrl;
            link.download = fileName;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
        }

        if (result.pdfDoc && typeof result.pdfDoc.save === 'function') {
            result.pdfDoc.save(fileName);
            return true;
        }
    } catch (error) {
        console.warn('Blob PDF download failed; using jsPDF fallback.', error);
        if (result.pdfDoc && typeof result.pdfDoc.save === 'function') {
            result.pdfDoc.save(fileName);
            return true;
        }
    }

    return false;
}
