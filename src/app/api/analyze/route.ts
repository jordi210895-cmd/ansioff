import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'placeholder_key' || apiKey.includes('tu_clave')) {
            return NextResponse.json(
                { error: 'Falta configurar una API Key de Gemini válida en Vercel o .env.local' },
                { status: 500 }
            );
        }

        const { notes } = await req.json();

        if (!notes || !Array.isArray(notes) || notes.length === 0) {
            return NextResponse.json(
                { error: 'No hay suficientes notas para analizar.' },
                { status: 400 }
            );
        }

        // Limit the notes logic to the last 15 to keep context size manageable
        const recentNotes = notes.slice(0, 15).map((n: any) => `- [${new Date(n.created_at).toLocaleDateString()}]: ${n.content}`).join('\n');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Eres un asistente de diario personal. Ayudas al usuario a resumir sus propias notas y a detectar temas repetidos de escritura, hábitos y rutinas cotidianas.

El siguiente es un extracto del diario emocional del usuario (las notas más recientes primero):

${recentNotes}

Tu objetivo es realizar un resumen claro y amable de estos registros para encontrar temas repetidos, situaciones asociadas y posibles próximos pasos de organización personal.

DEBES responder ÚNICA y EXCLUSIVAMENTE con un objeto JSON válido que cumpla exactamente la siguiente estructura, sin bloques de código markdown ni texto adicional:

{
    "triggers": ["Tema o situación frecuente 1", "Tema o situación frecuente 2"],
    "emotion_summary": "Un resumen amable (entre 80 y 140 palabras) de los temas que aparecen en las notas. Evita afirmaciones absolutas o causas no verificadas.",
    "recommendation": "Una idea sencilla de organización personal (entre 40 y 80 palabras), por ejemplo escribir una lista breve, crear una pausa, ordenar una prioridad o preparar el cierre del día."
}
`;


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown block if Gemini ignores instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error('Error in analyze API:', error);
        return NextResponse.json(
            { error: error.message || 'Error al contactar con el motor de Inteligencia Artificial.' },
            { status: 500 }
        );
    }
}
