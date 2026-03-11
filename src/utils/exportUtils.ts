import { jsPDF } from 'jspdf';
import { getStats } from './stats';

interface Note {
    id: number;
    text: string;
    created_at: string;
}

interface CBTEntry {
    id: number;
    date: string;
    trigger: string;
    negative_thought: string;
    emotions: string;
    cognitive_distortion: string;
    alternative_thought: string;
    belief_before: number;
    belief_after: number;
}

export const exportClinicalDiaryPDF = () => {
    try {
        const doc = new jsPDF();
        let yPos = 20;
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginBottom = 20;

        // Cover Page
        doc.setFontSize(24);
        doc.setTextColor(3, 8, 15); // Dark blue / black
        doc.text('ANSIOFF - Diario Clínico', 105, 40, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 105, 55, { align: 'center' });

        const stats = getStats();
        doc.setFontSize(12);
        doc.text(`Resumen de actividad:`, 105, 80, { align: 'center' });
        doc.text(`- Registros CBT: ${stats.cbtEntries}`, 105, 90, { align: 'center' });
        doc.text(`- Minutos de respiración: ${stats.breathMins}`, 105, 100, { align: 'center' });
        doc.text(`- Usos de SOS: ${stats.sosUses}`, 105, 110, { align: 'center' });

        doc.addPage();
        yPos = 20;

        // Section: Notas Libres
        const notesStr = localStorage.getItem('ansioff_notes');
        const notes: Note[] = notesStr ? JSON.parse(notesStr) : [];

        doc.setFontSize(18);
        doc.setTextColor(3, 8, 15);
        doc.text('Diario de Notas Libres', 20, yPos);
        yPos += 15;

        if (notes.length === 0) {
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('No hay notas registradas.', 20, yPos);
            yPos += 15;
        } else {
            // Sort notes by date descending
            notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            notes.forEach(note => {
                const d = new Date(note.created_at);
                const dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');

                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text(dateStr, 20, yPos);
                yPos += 7;

                doc.setFontSize(12);
                doc.setTextColor(50, 50, 50);
                const lines = doc.splitTextToSize(note.text, 170); // 210 (A4 width) - 40 (margins)

                lines.forEach((line: string) => {
                    if (yPos > pageHeight - marginBottom) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(line, 20, yPos);
                    yPos += 7;
                });

                yPos += 10; // Space between notes
                if (yPos > pageHeight - marginBottom) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        }

        doc.addPage();
        yPos = 20;

        // Section: Registros CBT
        const cbtStr = localStorage.getItem('ansioff_cbt_entries');
        const cbtEntries: CBTEntry[] = cbtStr ? JSON.parse(cbtStr) : [];

        doc.setFontSize(18);
        doc.setTextColor(3, 8, 15);
        doc.text('Registros Cognitivo-Conductuales (CBT)', 20, yPos);
        yPos += 15;

        if (cbtEntries.length === 0) {
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('No hay registros CBT registrados.', 20, yPos);
        } else {
            cbtEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            cbtEntries.forEach(entry => {
                const d = new Date(entry.date);
                const dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

                if (yPos > pageHeight - 60) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(3, 8, 15);
                doc.text(dateStr, 20, yPos);
                yPos += 8;

                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);

                const drawField = (label: string, value: string) => {
                    doc.setFont(undefined, 'bold');
                    doc.text(`${label}: `, 20, yPos);
                    const labelWidth = doc.getTextWidth(`${label}: `);
                    doc.setFont(undefined, 'normal');

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

                drawField('Desencadenante', entry.trigger);
                drawField('Pensamiento Automático', entry.negative_thought);
                drawField('Emociones', entry.emotions);
                drawField('Distorsión Cognitiva', entry.cognitive_distortion || 'No especificada');
                drawField('Pensamiento Alternativo', entry.alternative_thought);

                yPos += 2;
                doc.text(`Creencia inicial: ${entry.belief_before}/10   |   Creencia final: ${entry.belief_after}/10`, 20, yPos);
                yPos += 15;

                doc.setDrawColor(200, 200, 200);
                doc.line(20, yPos - 10, 190, yPos - 10);
            });
        }

        // Save PDF
        doc.save('Ansioff_Diario_Clinico.pdf');
        return true;
    } catch (error) {
        console.error('Error generating PDF', error);
        return false;
    }
};
