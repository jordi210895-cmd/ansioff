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
Eres un asistente de journaling empático. Ayudas al usuario a resumir sus propias notas y a detectar temas repetidos desde una perspectiva de bienestar general. No das diagnósticos, no etiquetas trastornos, no recomiendas tratamientos y no sustituyes el consejo de profesionales de salud.

El siguiente es un extracto del diario emocional del usuario (las notas más recientes primero):

${recentNotes}

Tu objetivo es realizar un resumen prudente y compasivo de estos registros para encontrar temas repetidos, situaciones asociadas y posibles próximos pasos de autocuidado no médico.

DEBES responder ÚNICA y EXCLUSIVAMENTE con un objeto JSON válido que cumpla exactamente la siguiente estructura, sin bloques de código markdown ni texto adicional:

{
    "triggers": ["Tema o situación frecuente 1", "Tema o situación frecuente 2"],
    "emotion_summary": "Un resumen empático y no clínico (entre 80 y 140 palabras) de los temas que aparecen en las notas. Evita diagnósticos, etiquetas médicas o afirmaciones de causa.",
    "recommendation": "Una idea de autocuidado no médico (entre 40 y 80 palabras), por ejemplo respirar, escribir, descansar o contactar con apoyo si el usuario lo necesita. Recuerda consultar con un profesional ante dudas de salud."
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
