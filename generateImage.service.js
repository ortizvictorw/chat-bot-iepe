
const Replicate = require('replicate');


async function generateImages(mensaje) {
    const replicate = new Replicate({
        auth: 'r8_WKqEwGnvxZcB5Il0gQP9gpShzGncXEV0Hn45z',
      });
    const models = [
      {
        id: "stability-ai/stable-diffusion-3",
        input: {
          cfg: 4.5,
          prompt: mensaje,
          aspect_ratio: "1:1",
          output_format: "jpg",
          output_quality: 79,
          negative_prompt: "ugly, distorted"
        }
      },
      {
        id: "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
        input: {
          width: 1024,
          height: 1024,
          prompt: mensaje,
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 0,
          negative_prompt: "worst quality, low quality",
          num_inference_steps: 4
        }
      },
      {
        id: "lucataco/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019",
        input: {
          width: 1024,
          height: 1024,
          prompt: mensaje,
          scheduler: "KarrasDPM",
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: true,
          negative_prompt: "worst quality, low quality",
          prompt_strength: 0.8,
          num_inference_steps: 20
        }
      }
    ];
  
    const promises = models.map(model => replicate.run(model.id, { input: model.input }));
    const outputs = await Promise.all(promises);
  
    return `Aquí tienes tus imagenes: ${outputs.map(output => output[0]).join(', ')}`;
  }
  
  module.exports = {
    generateImages
  }