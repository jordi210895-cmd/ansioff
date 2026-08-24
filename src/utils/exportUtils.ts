import { jsPDF } from 'jspdf';
import { getStats } from './stats';

interface Note {
    id: number | string;
    text?: string;
    content?: string;
    created_at: string;
}

interface CBTEntry {
    id: number | string;
    date?: string;
    created_at?: string;
    trigger?: string;
    thought?: string;
    negative_thought?: string;
    emotions?: string;
    cognitive_distortion?: string;
    distortion?: string | null;
    evidence?: string;
    alternative_thought?: string;
    alternative?: string;
    belief_before?: number;
    belief_after?: number;
}

interface ExposureEntry {
    id?: number | string;
    date?: string;
    created_at?: string;
    title?: string;
    situation?: string;
    initial_discomfort?: number; // 0 - 10 (SUDs inicial/anticipatorio)
    max_discomfort?: number;     // 0 - 10 (SUDs máximo/pico de ansiedad)
    final_discomfort?: number;   // 0 - 10 (SUDs final/habituación)
    duration_mins?: number;
    notes?: string;
    sensations?: string;
    learnings?: string;
}

export const generateClinicalPDFDocument = (): jsPDF => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginBottom = 20;

    const checkAddPage = (neededHeight: number = 20) => {
        if (yPos + neededHeight > pageHeight - marginBottom) {
            doc.addPage();
            yPos = 20;
            return true;
        }
        return false;
    };

    const drawField = (label: string, value?: string | null, isBoldValue: boolean = false) => {
        if (!value && value !== '0') return;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`${label}: `, 20, yPos);
        const labelWidth = doc.getTextWidth(`${label}: `);

        doc.setFont('helvetica', isBoldValue ? 'bold' : 'normal');
        doc.setTextColor(30, 30, 30);

        const lines = doc.splitTextToSize(value, 170 - labelWidth);

        lines.forEach((line: string, index: number) => {
            checkAddPage(7);
            if (index === 0) {
                doc.text(line, 20 + labelWidth, yPos);
            } else {
                doc.text(line, 20, yPos);
            }
            yPos += 6;
        });
    };

    // --- ENCABEZADO Y PORTADA ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(3, 8, 15);
    doc.text('ANSIOFF - Informe Clinico y Diario de Registro', 105, 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Informe generado el: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, 36, { align: 'center' });

    const stats = getStats();
    yPos = 48;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(3, 8, 15);
    doc.text('Resumen General de Actividad', 20, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`• Registros de pensamiento (CBT): ${stats.cbtEntries}`, 25, yPos); yPos += 6;
    doc.text(`• Minutos de respiracion guiada: ${stats.breathMins} min`, 25, yPos); yPos += 6;
    doc.text(`• Usos del kit de emergencia SOS: ${stats.sosUses}`, 25, yPos); yPos += 6;
    doc.text(`• Puntos de habito y progreso: ${stats.points}`, 25, yPos); yPos += 8;

    // Motor/Objetivo de Exposición
    const exposureReason = localStorage.getItem('ansioff_exposure_reason');
    if (exposureReason && exposureReason.trim()) {
        yPos += 2;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(90, 173, 207);
        doc.text('Motor y Objetivo Personal de Avance:', 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);

        const reasonLines = doc.splitTextToSize(`"${exposureReason.trim()}"`, 170);
        reasonLines.forEach((line: string) => {
            checkAddPage(6);
            doc.text(line, 20, yPos);
            yPos += 6;
        });
        yPos += 4;
    }

    doc.setDrawColor(220, 220, 220);
    doc.line(20, yPos, 190, yPos);
    yPos += 12;

    // --- SECCIÓN 1: EXPOSICIONES GRADUALES Y CURVA DE MALESTAR (SUDs) ---
    checkAddPage(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(3, 8, 15);
    doc.text('1. Registro de Exposiciones Graduales (SUDs)', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(110, 110, 110);
    const expDesc = "Registro de desensibilizacion sistematica en vivo/imaginacion. Evalua la evolucion de las Unidades Subjetivas de Malestar (SUDs 0-10) desde la anticipacion inicial, el pico maximo alcanzado y el nivel final tras la habituacion.";
    const expDescLines = doc.splitTextToSize(expDesc, 170);
    expDescLines.forEach((line: string) => {
        doc.text(line, 20, yPos);
        yPos += 5;
    });
    yPos += 6;

    let exposureLogs: ExposureEntry[] = [];
    const storedExposureStr = localStorage.getItem('ansioff_exposure_logs') || localStorage.getItem('ansioff_exposure_records') || localStorage.getItem('ansioff_exposure_steps');
    if (storedExposureStr) {
        try {
            exposureLogs = JSON.parse(storedExposureStr);
        } catch (e) {
            console.error("Error parsing exposure logs:", e);
        }
    }

    if (!Array.isArray(exposureLogs) || exposureLogs.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text('No hay registros de exposiciones guardados.', 20, yPos);
        yPos += 14;
    } else {
        exposureLogs.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());

        exposureLogs.forEach((log) => {
            const dateVal = log.created_at || log.date || new Date().toISOString();
            const rawDate = new Date(dateVal);
            const dateStr = rawDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + rawDate.getHours().toString().padStart(2, '0') + ':' + rawDate.getMinutes().toString().padStart(2, '0');

            checkAddPage(45);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(124, 58, 237); // Accent purple
            doc.text(dateStr.toUpperCase(), 20, yPos);
            yPos += 6;

            doc.setFontSize(10);
            drawField('Situacion / Tarea', log.situation || log.title || 'Exposicion gradual');

            const initialVal = log.initial_discomfort !== undefined ? `${log.initial_discomfort} / 10` : null;
            const maxVal = log.max_discomfort !== undefined ? `${log.max_discomfort} / 10` : null;
            const finalVal = log.final_discomfort !== undefined ? `${log.final_discomfort} / 10` : null;

            if (initialVal || maxVal || finalVal) {
                let sudsText = '';
                if (initialVal) sudsText += `Inicial (Anticipacion): ${initialVal} `;
                if (maxVal) sudsText += `| Pico Maximo: ${maxVal} `;
                if (finalVal) sudsText += `| Final (Habituacion): ${finalVal}`;

                drawField('Niveles de Malestar (SUDs)', sudsText.trim(), true);
            }

            if (log.duration_mins) {
                drawField('Duracion de la prueba', `${log.duration_mins} minutos`);
            }

            if (log.notes) {
                drawField('Observaciones y Sensaciones', log.notes);
            }
            if (log.learnings) {
                drawField('Aprendizaje clinico', log.learnings);
            }

            yPos += 4;
            doc.setDrawColor(230, 230, 230);
            doc.line(20, yPos, 190, yPos);
            yPos += 10;
        });
    }

    // --- SECCIÓN 2: REGISTROS DE PENSAMIENTO (CBT) ---
    checkAddPage(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(3, 8, 15);
    doc.text('2. Registros de Pensamiento (CBT)', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(110, 110, 110);
    const cbtDesc = "Analisis de reestructuracion cognitiva: identificacion de detonantes, pensamientos automaticos negativos, distorsiones detectadas y elaboracion de alternativas amables.";
    const cbtDescLines = doc.splitTextToSize(cbtDesc, 170);
    cbtDescLines.forEach((line: string) => {
        doc.text(line, 20, yPos);
        yPos += 5;
    });
    yPos += 6;

    let cbtEntries: CBTEntry[] = [];
    const localCbtStr = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries');
    if (localCbtStr) {
        try {
            cbtEntries = JSON.parse(localCbtStr);
        } catch (e) {
            console.error("Error parsing CBT records:", e);
        }
    }

    if (!Array.isArray(cbtEntries) || cbtEntries.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text('No hay registros de pensamiento guardados.', 20, yPos);
        yPos += 14;
    } else {
        cbtEntries.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());

        cbtEntries.forEach(entry => {
            const dateVal = entry.created_at || entry.date || new Date().toISOString();
            const d = new Date(dateVal);
            const dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            checkAddPage(45);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(3, 8, 15);
            doc.text(dateStr, 20, yPos);
            yPos += 6;

            const thoughtText = entry.thought || entry.negative_thought || entry.trigger || '';
            const distortionText = entry.distortion || entry.cognitive_distortion || '';
            const evidenceText = entry.evidence || entry.emotions || '';
            const alternativeText = entry.alternative || entry.alternative_thought || '';

            drawField('Detonante / Pensamiento', thoughtText);
            drawField('Distorsion Cognitiva', distortionText);
            drawField('Evidencias y Emociones', evidenceText);
            drawField('Pensamiento Alternativo', alternativeText);

            if (entry.belief_before !== undefined || entry.belief_after !== undefined) {
                const beliefStr = `Creencia inicial: ${entry.belief_before ?? '—'}/10 | Creencia tras alternativa: ${entry.belief_after ?? '—'}/10`;
                drawField('Nivel de Creencia', beliefStr, true);
            }

            yPos += 4;
            doc.setDrawColor(230, 230, 230);
            doc.line(20, yPos, 190, yPos);
            yPos += 10;
        });
    }

    // --- SECCIÓN 3: DIARIO DE NOTAS Y PREPARACIÓN TERAPÉUTICA ---
    checkAddPage(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(3, 8, 15);
    doc.text('3. Diario y Notas para Sesion Clinica', 20, yPos);
    yPos += 7;

    const prepNotes = localStorage.getItem('ansioff_therapy_journal_prep');
    if (prepNotes && prepNotes.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(90, 100, 220);
        doc.text('Notas de Preparacion para la Consulta:', 20, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        const prepLines = doc.splitTextToSize(prepNotes.trim(), 170);
        prepLines.forEach((line: string) => {
            checkAddPage(6);
            doc.text(line, 20, yPos);
            yPos += 6;
        });
        yPos += 8;
    }

    const notesStr = localStorage.getItem('ansioff_notes');
    let notes: Note[] = [];
    if (notesStr) {
        try {
            notes = JSON.parse(notesStr);
        } catch (e) {
            console.error("Error parsing notes:", e);
        }
    }

    if (!Array.isArray(notes) || notes.length === 0) {
        if (!prepNotes) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120);
            doc.text('No hay notas libres registradas.', 20, yPos);
            yPos += 14;
        }
    } else {
        notes.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        notes.forEach(note => {
            const rawDate = note.created_at ? new Date(note.created_at) : new Date();
            const dateStr = rawDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + rawDate.getHours().toString().padStart(2, '0') + ':' + rawDate.getMinutes().toString().padStart(2, '0');

            checkAddPage(30);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(140, 140, 140);
            doc.text(dateStr.toUpperCase(), 20, yPos);
            yPos += 6;

            const textContent = (note.content || note.text || '').trim();
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(40, 40, 40);

            if (textContent) {
                const lines = doc.splitTextToSize(textContent, 170);
                lines.forEach((line: string) => {
                    checkAddPage(6);
                    doc.text(line, 20, yPos);
                    yPos += 6;
                });
            }

            yPos += 6;
        });
    }

    return doc;
};

export const exportClinicalDiaryPDF = (): boolean => {
    try {
        const doc = generateClinicalPDFDocument();
        const fileName = 'Ansioff_Informe_Clinico.pdf';

        try {
            doc.save(fileName);
        } catch (e) {
            console.warn('doc.save failed, using blob fallback', e);
            const pdfBlob = doc.output('blob');
            const blobUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            a.target = '_blank';
            a.click();
        }

        return true;
    } catch (error) {
        console.error('Error generating PDF', error);
        return false;
    }
};

export const shareClinicalReportPDF = async (): Promise<{ shared: boolean; error?: string }> => {
    try {
        const doc = generateClinicalPDFDocument();
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], 'Ansioff_Informe_Clinico.pdf', { type: 'application/pdf' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'Mi Informe de Terapia Ansioff',
                text: 'Adjunto mi registro clinico de ansiedad, exposiciones y estado de animo.',
                files: [file],
            });
            return { shared: true };
        } else {
            // Fallback para navegadores que no soportan compartir archivos nativos
            exportClinicalDiaryPDF();
            return { shared: false };
        }
    } catch (err) {
        console.warn('Error in Web Share API:', err);
        exportClinicalDiaryPDF();
        return { shared: false, error: String(err) };
    }
};
