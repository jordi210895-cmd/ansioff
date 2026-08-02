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

export const exportClinicalDiaryPDF = (): boolean => {
    try {
        const doc = new jsPDF();
        let yPos = 20;
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginBottom = 20;

        // Cover / Title Page
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(3, 8, 15);
        doc.text('ANSIOFF - Diario y Registro Clinico', 105, 35, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fecha de informe: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, 47, { align: 'center' });

        const stats = getStats();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(3, 8, 15);
        doc.text('Resumen de Actividad', 20, 68);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text(`• Registros de pensamiento (CBT): ${stats.cbtEntries}`, 25, 78);
        doc.text(`• Minutos de respiracion guiada: ${stats.breathMins}`, 25, 86);
        doc.text(`• Usos del kit SOS: ${stats.sosUses}`, 25, 94);
        doc.text(`• Puntos de progreso: ${stats.points}`, 25, 102);

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 112, 190, 112);

        yPos = 125;

        // Section: Notas Libres
        const notesStr = localStorage.getItem('ansioff_notes');
        let notes: Note[] = [];
        if (notesStr) {
            try {
                notes = JSON.parse(notesStr);
            } catch (e) {
                console.error("Error parsing notes:", e);
            }
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(3, 8, 15);
        doc.text('Diario de Notas Libres', 20, yPos);
        yPos += 12;

        if (!Array.isArray(notes) || notes.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(11);
            doc.setTextColor(120, 120, 120);
            doc.text('No hay notas libres registradas.', 20, yPos);
            yPos += 15;
        } else {
            notes.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

            notes.forEach(note => {
                const rawDate = note.created_at ? new Date(note.created_at) : new Date();
                const dateStr = rawDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + rawDate.getHours().toString().padStart(2, '0') + ':' + rawDate.getMinutes().toString().padStart(2, '0');

                if (yPos > pageHeight - 30) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(140, 140, 140);
                doc.text(dateStr.toUpperCase(), 20, yPos);
                yPos += 6;

                const textContent = (note.content || note.text || '').trim();
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                doc.setTextColor(40, 40, 40);

                if (textContent) {
                    const lines = doc.splitTextToSize(textContent, 170);
                    lines.forEach((line: string) => {
                        if (yPos > pageHeight - marginBottom) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text(line, 20, yPos);
                        yPos += 6;
                    });
                }

                yPos += 8;
            });
        }

        // Section: Registros CBT
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 10;
        }

        let cbtEntries: CBTEntry[] = [];
        const localCbtStr = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries');
        if (localCbtStr) {
            try {
                cbtEntries = JSON.parse(localCbtStr);
            } catch (e) {
                console.error("Error parsing CBT records:", e);
            }
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(3, 8, 15);
        doc.text('Registros de Pensamiento (CBT)', 20, yPos);
        yPos += 12;

        if (!Array.isArray(cbtEntries) || cbtEntries.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(11);
            doc.setTextColor(120, 120, 120);
            doc.text('No hay registros de pensamiento guardados.', 20, yPos);
        } else {
            cbtEntries.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());

            cbtEntries.forEach(entry => {
                const dateVal = entry.created_at || entry.date || new Date().toISOString();
                const d = new Date(dateVal);
                const dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

                if (yPos > pageHeight - 50) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(3, 8, 15);
                doc.text(dateStr, 20, yPos);
                yPos += 7;

                doc.setFontSize(10);

                const drawField = (label: string, value?: string | null) => {
                    if (!value) return;
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(80, 80, 80);
                    doc.text(`${label}: `, 20, yPos);
                    const labelWidth = doc.getTextWidth(`${label}: `);

                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(40, 40, 40);

                    const lines = doc.splitTextToSize(value, 170 - labelWidth);

                    lines.forEach((line: string, index: number) => {
                        if (yPos > pageHeight - marginBottom) {
                            doc.addPage();
                            yPos = 20;
                        }
                        if (index === 0) {
                            doc.text(line, 20 + labelWidth, yPos);
                        } else {
                            doc.text(line, 20, yPos);
                        }
                        yPos += 6;
                    });
                };

                const thoughtText = entry.thought || entry.negative_thought || entry.trigger || '';
                const distortionText = entry.distortion || entry.cognitive_distortion || '';
                const evidenceText = entry.evidence || entry.emotions || '';
                const alternativeText = entry.alternative || entry.alternative_thought || '';

                drawField('Pensamiento', thoughtText);
                drawField('Patrón', distortionText);
                drawField('Evidencia', evidenceText);
                drawField('Alternativa amable', alternativeText);

                yPos += 4;
                doc.setDrawColor(230, 230, 230);
                doc.line(20, yPos, 190, yPos);
                yPos += 10;
            });
        }

        // Save PDF with fallback for mobile/Capacitor/Safari
        const fileName = 'Ansioff_Diario_Clinico.pdf';

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

