import { Injectable } from '@angular/core';
import { generateObject } from 'ai'; // Asegúrate de importar la librería correcta
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  storedApiKey: string = '';
  selectedStyle: string = 'Pop'; 

  constructor() { }

  updateSelectedOption(style: string) {
    this.selectedStyle = style; // Actualiza la variable del servicio con el valor recibido
  }

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
    const model = openai('gpt-4o-mini');

    // Definir el prompt que se enviará al modelo
const prompt = `
  Eres un experto en música, fotografía y literatura:
  1. Dame el título de una canción que describa esta imagen (solo el título, SIN EL AUTOR!).
  2. Dame una poesía breve o texto breve de algún escritor que se ajuste a la imagen.
  3. Genera una paleta de colores que combine bien con la imagen.
  4. Dame el autor de la canción.
`;
    // Definir el esquema esperado de la respuesta
    const schema = z.object({
      title: z.string(),
      description: z.string(),
      colors: z.array(z.string()).length(4),
      authorSong: z.string()
    });

    // Generar el objeto basado en el prompt y el esquema
    const result = await generateObject({
      model,
      temperature: 1,
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
    console.log(this.selectedStyle)
    console.log(prompt)
    return result.object;

  } catch (error) {
    throw error;
  }
}

async analyzeTextWithImageToPlaylist(imageFile: File) {
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
    const model = openai('gpt-4o-mini');

    // Definir el prompt que se enviará al modelo
    const prompt = `
      Eres un experto en música, fotografía y literatura:
      1. Dame una lista de 15 títulos de canciones que describan esta imagen (solo los títulos, SIN LOS AUTORES!).
      2. Las canciones deben funcionar juntas para crear una playlist que represente la imagen de la mejor manera posible.
      3. Dame los autores de las canciones en la lista.
    `;

    // Definir el esquema esperado de la respuesta
    const schema = z.object({
      titles: z.array(z.string()).length(15),
      authors: z.array(z.string()).length(15)
    });

    // Generar el objeto basado en el prompt y el esquema
    const result = await generateObject({
      model,
      temperature: 1,
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
    console.log(this.selectedStyle);
    console.log(prompt);
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