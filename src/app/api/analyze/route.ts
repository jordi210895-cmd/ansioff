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
        const recentNotes = notes.slice(0, 15).map((n: any) => `- [${new Date(n.created_at).toLocaleDateString()}]: ${n.content}`).join('\n');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Eres un psicólogo clínico experto y empático, especializado en Terapia Cognitivo-Conductual (TCC) y Terapia de Aceptación y Compromiso (ACT). Tu especialidad es ayudar a personas con ansiedad y depresión a identificar patrones de pensamiento y comportamiento.

El siguiente es un extracto del diario emocional del usuario (las notas más recientes primero):

${recentNotes}

Tu objetivo es realizar un análisis profundo y compasivo de estos registros para encontrar patrones invisibles, sesgos cognitivos (distorsiones), desencadenantes (triggers) recurrentes y la carga emocional subyacente.

DEBES responder ÚNICA y EXCLUSIVAMENTE con un objeto JSON válido que cumpla exactamente la siguiente estructura, sin bloques de código markdown ni texto adicional:

{
    "triggers": ["Desencadenante específico 1", "Desencadenante específico 2"],
    "emotion_summary": "Un análisis clínico detallado y empático (entre 100 y 200 palabras) que explore no solo qué siente el usuario, sino por qué podría estar sintiéndolo según sus registros, identificando posibles distorsiones cognitivas.",
    "recommendation": "Una hoja de ruta práctica y personalizada (entre 60 y 100 palabras). No des consejos genéricos; sugiere técnicas específicas (respiración, anclaje, etc.) aplicadas directamente a los problemas detectados en las notas."
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
