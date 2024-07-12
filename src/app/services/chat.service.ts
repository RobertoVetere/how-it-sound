import { Injectable } from '@angular/core';
import { generateObject } from 'ai'; // Asegúrate de importar la librería correcta
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  storedApiKey: string = '';

  constructor() { }

  async analyzeTextWithImage(imageFile: File) {
  try {
    const imageToBase64 = await this.readFileAsBase64(imageFile);

    // Obtener la API Key desde localStorage
    const storedApiKey = localStorage.getItem('apiKey');

    // Verificar si storedApiKey es null o undefined
    if (!storedApiKey) {
      throw new Error('API Key no encontrada en localStorage');
    }

    // Crear instancia de OpenAI con la API Key obtenida
    const openai = createOpenAI({
      apiKey: storedApiKey
    });

    // Seleccionar el modelo adecuado
    const model = openai('gpt-4o');

    // Definir el prompt que se enviará al modelo
const prompt = `
  Eres un experto en música, fotografía y literatura:
  dame el título de una canción que describa esta imagen (solo el título, SIN EL AUTOR!)
  y una poesía breve o texto breve de algún escritor que se ajuste a la imagen.

  Además, por favor genera una paleta de colores que combine bien con la imagen.
`;
    // Definir el esquema esperado de la respuesta
    const schema = z.object({
      title: z.string(),
      description: z.string(),
      colors: z.array(z.string()).length(4)
    });

    // Generar el objeto basado en el prompt y el esquema
    const result = await generateObject({
      model,
      temperature: 0.7,
      mode: 'json',
      schema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: imageToBase64 }
          ]
        }
      ]
    });

    // Log y retornar el resultado
    console.log(result.object);
    return result.object;

  } catch (error) {
    throw error;
  }
}


  private async readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        resolve(base64String || '');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}