import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'placeholder_key') {
            return NextResponse.json(
                { error: 'Falta configurar la API Key de Gemini en las variables de entorno.' },
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
        const recentNotes = notes.slice(0, 15).map((n: any) => `- [${new Date(n.created_at).toLocaleDateString()}]: ${n.text}`).join('\n');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Eres un psicólogo clínico experto y empático especializado en terapia cognitivo-conductual.
El siguiente es un extracto del diario emocional del usuario:

${recentNotes}

Tu objetivo es analizar estos registros para encontrar patrones invisibles, desencadenantes (triggers) y la carga emocional subyacente. 

DEBES responder ÚNICA y EXCLUSIVAMENTE con un objeto JSON válido que cumpla exactamente la siguiente estructura, sin bloques de código markdown ni texto adicional:

{
    "triggers": ["Desencadenante 1", "Desencadenante 2"],
    "emotion_summary": "Un breve párrafo compasivo (máximo 40 palabras) resumiendo la carga emocional detectada.",
    "recommendation": "Una sugerencia práctica y muy breve (máximo 20 palabras) sobre qué hacer ahora (ej: hacer un anclaje, respiración diafragmática, o cuestionar un pensamiento oscuro)."
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown block if Gemini ignores instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);

        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.error('Error in analyze API:', error);
        return NextResponse.json(
            { error: 'Error al contactar con el motor de Inteligencia Artificial.' },
            { status: 500 }
        );
    }
}
