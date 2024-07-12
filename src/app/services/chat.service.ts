import { Injectable } from '@angular/core';
import { generateText , generateObject } from 'ai';  // Asegúrate de importar la librería correcta
import { createOpenAI } from '@ai-sdk/openai';
import { environment } from '../../environments/environment';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  async analyzeTextWithImage(imageFile: File) {

    const imageToBase64 = await this.readFileAsBase64(imageFile)
    
    const openai = createOpenAI({
      apiKey: environment.openaiApiKey
    });

    const model = openai('gpt-4o');

    const prompt = 'Eres un experto en música, fotografía y literatura: dame el titulo de una cancion que describa esta imagen (solo titulo, SIN EL AUTOR!) y una poesia breve o texto breve de algún escritor que se ajuste a la imagen.'


    try {
      // Define the expected schema of the response
      const schema = z.object({
          title: z.string(),
          description: z.string(),
      
    });

      // Generate the object based on the prompt and schema
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

      // Log and return the result
      console.log(result.object);
      return result.object;
    } catch (error) {
      // Log any errors encountered during the process
      console.error('Error en el análisis de texto con imagen:', error);
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