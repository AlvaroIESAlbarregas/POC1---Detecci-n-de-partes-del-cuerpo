# Resumen

### Métodos en `controller.js`

1. **DOMContentLoaded**  
   Este evento se activa cuando el DOM está completamente cargado, iniciando la configuración de la cámara y los eventos del botón.

   ```javascript
   document.addEventListener('DOMContentLoaded', async () => {
       await AIModel.loadModel();
       const videoStream = await AIModel.activateCamera();
       document.getElementById('cameraFeed').srcObject = videoStream;
   });
   ```
   - **Explicación**: Carga el modelo de IA, inicia la cámara y muestra la transmisión en el elemento `cameraFeed` en la interfaz.

2. **handleCaptureButtonClick**  
   Este método se activa al hacer clic en el botón de captura, alternando entre iniciar la captura y reiniciar la cámara.

   ```javascript
   function handleCaptureButtonClick() {
       const buttonText = captureButton.textContent;
       if (buttonText === 'Iniciar Captura') {
           initiateCountdown();
       } else {
           restartCamera();
       }
   }
   ```
   - **Explicación**: Si el botón muestra "Iniciar Captura", comienza la cuenta regresiva; si no, reinicia la cámara.

3. **initiateCountdown**  
   Realiza una cuenta regresiva de tres segundos, actualizando un contador visible en la interfaz.

   ```javascript
   function initiateCountdown() {
       let countdown = 3;
       const displayCount = document.getElementById('countDisplay');
       displayCount.textContent = countdown;
       const intervalId = setInterval(() => {
           countdown--;
           displayCount.textContent = countdown;
           if (countdown === 0) {
               clearInterval(intervalId);
               captureImage();
           }
       }, 1000);
   }
   ```
   - **Explicación**: Muestra un contador de tres segundos y, al terminar, llama a `captureImage` para tomar una foto.

4. **captureImage**  
   Captura una imagen del video y realiza una predicción utilizando el modelo de IA cargado.

   ```javascript
   async function captureImage() {
       const videoElement = document.getElementById('cameraFeed');
       const canvas = document.createElement('canvas');
       canvas.width = videoElement.videoWidth;
       canvas.height = videoElement.videoHeight;
       const ctx = canvas.getContext('2d');
       ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

       const resultText = await AIModel.runPrediction(canvas);
       document.getElementById('resultText').textContent = resultText;
   }
   ```
   - **Explicación**: Captura una imagen del `cameraFeed`, la usa para la predicción y muestra el resultado en `resultText`.

5. **restartCamera**  
   Reinicia la cámara y restablece el texto del botón y el resultado de la predicción.

   ```javascript
   function restartCamera() {
       AIModel.activateCamera();
       document.getElementById('capturedFrame').classList.remove('show');
       document.getElementById('resultText').textContent = "Resultado: -";
   }
   ```
   - **Explicación**: Reactiva la cámara, oculta la imagen capturada y reinicia el texto del resultado y del botón.


### Métodos en `model.js`

1. **loadModel**  
   Carga el modelo de IA desde una URL de Teachable Machine para usarlo en las predicciones.

   ```javascript
   async loadModel() {
       const modelPath = "https://teachablemachine.withgoogle.com/models/2iakE6Ea5/";
       this.model = await tmImage.load(modelPath + "model.json", modelPath + "metadata.json");
   }
   ```
   - **Explicación**: Carga el archivo `model.json` y el `metadata.json` del modelo de IA, que permite realizar predicciones con Teachable Machine.

2. **activateCamera**  
   Solicita acceso a la cámara del usuario y devuelve la transmisión de video.

   ```javascript
   async activateCamera() {
       try {
           this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
           return this.videoStream;
       } catch (error) {
           alert("Verifica los permisos de cámara.");
       }
   }
   ```
   - **Explicación**: Pide permiso para usar la cámara; si se concede, devuelve el video en vivo; si falla, muestra un mensaje de advertencia.

3. **runPrediction**  
   Realiza una predicción utilizando el modelo cargado y devuelve el resultado más probable.

   ```javascript
   async runPrediction(capturedImage) {
       if (this.model) {
           const predictions = await this.model.predict(capturedImage);
           const bestMatch = predictions.reduce((highest, current) =>
               current.probability > highest.probability ? current : highest
           );
           return `Resultado: ${bestMatch.className} (${(bestMatch.probability * 100).toFixed(2)}%)`;
       }
       return "Sin resultado";
   }
   ```
   - **Explicación**: Usa la imagen capturada para generar predicciones; luego selecciona la predicción con la mayor probabilidad y la devuelve con el nombre de la clase y la confianza en porcentaje.

---

---

# Código HTML: Detección de Objetos

```html
<!-- index.html -->
<!DOCTYPE html>
```
Define el tipo de documento como HTML5, lo cual es esencial para interpretar correctamente el contenido del archivo.

```html
<html lang="es">
```
Inicia el elemento `<html>` y especifica el idioma del contenido como español (`lang="es"`).

```html
<head>
```
Contiene metadatos sobre el documento, incluyendo configuración de idioma, codificación de caracteres y enlaces a recursos externos.

```html
<meta charset="UTF-8">
```
Define la codificación de caracteres como UTF-8, que permite la correcta representación de caracteres especiales.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Ajusta el ancho de la vista en dispositivos móviles para mejorar la visualización y hacerla más receptiva.

```html
<title>Detección de Objetos</title>
```
Establece el título de la página, que se muestra en la pestaña del navegador.

```html
<link rel="stylesheet" href="styles.css">
```
Vincula un archivo CSS externo (`styles.css`) que contiene los estilos para la página.

```html
</head>
```
Finaliza la sección de `<head>`.

```html
<body>
```
Comienza el cuerpo del documento, donde se define el contenido visible de la página.

```html
<h1>Detección de Objetos</h1>
```
Agrega un encabezado principal con el título "Detección de Objetos".

```html
<div class="video-wrapper">
```
Inicia un contenedor para envolver el contenido relacionado con el video.

```html
<video id="cameraFeed" autoplay></video>
```
Define un elemento `<video>` para mostrar la transmisión de la cámara en tiempo real. La propiedad `autoplay` hace que el video comience automáticamente.

```html
<img id="capturedFrame" alt="Imagen capturada">
```
Inserta un elemento de imagen (`<img>`) que mostrará una imagen capturada. El `alt` describe la imagen como "Imagen capturada".

```html
</div>
```
Cierra el contenedor `video-wrapper`.

```html
<div class="control-panel">
```
Inicia un contenedor para los elementos de control de la página.

```html
<div id="countDisplay">3</div>
```
Agrega un elemento de texto que muestra el número `3`, posiblemente utilizado como contador o indicador de cuenta regresiva.

```html
<div id="resultText">Resultado: -</div>
```
Muestra un mensaje de resultado predeterminado como "Resultado: -".

```html
<button id="captureButton">Iniciar Captura</button>
```
Agrega un botón para iniciar la captura de imagen. El botón muestra el texto "Iniciar Captura".

```html
<input type="range" id="progressBar" min="0" max="100" value="0">
```
Define una barra de progreso controlable (`<input type="range">`) con un valor mínimo de `0` y máximo de `100`, inicializada en `0`.

```html
</div>
```
Cierra el contenedor `control-panel`.

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
```
Incluye la biblioteca TensorFlow.js desde un CDN, necesaria para procesamiento y detección de imágenes.

```html
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
```
Incorpora la biblioteca Teachable Machine de Google, para reconocimiento de imágenes basado en aprendizaje automático.

```html
<script type="module" src="model.js"></script>
```
Agrega un archivo JavaScript llamado `model.js` como un módulo, responsable de manejar el modelo de detección de objetos.

```html
<script type="module" src="controller.js"></script>
```
Incluye otro módulo JavaScript `controller.js`, que controlara la interacción entre el usuario y el modelo de detección.

```html
</body>
```
Cierra el cuerpo del documento.

```html
</html>
```
Finaliza el documento HTML.

--- 

---

# Código JavaScript: Interacción y Control de la Cámara y el Modelo de IA

```javascript
import AIModel from './model.js';
```
Importa el módulo `AIModel` desde `model.js`, que  contiene funciones para cargar el modelo de IA, activar la cámara y realizar predicciones.

```javascript
document.addEventListener('DOMContentLoaded', async () => {
```
Establece un evento que espera a que el documento HTML esté completamente cargado antes de ejecutar el código dentro de esta función asíncrona.

```javascript
await AIModel.loadModel();
```
Carga el modelo de IA, permitiendo que el modelo esté listo para realizar predicciones.

```javascript
const videoStream = await AIModel.activateCamera();
```
Activa la cámara y guarda la transmisión de video en `videoStream`.

```javascript
document.getElementById('cameraFeed').srcObject = videoStream;
```
Asigna la transmisión de video al elemento `<video>` con el ID `cameraFeed` para mostrar el video en la página.

```javascript
const captureButton = document.getElementById('captureButton');
```
Selecciona el botón de captura y lo almacena en la variable `captureButton`.

```javascript
captureButton.addEventListener('click', handleCaptureButtonClick);
```
Añade un evento al botón de captura que ejecuta la función `handleCaptureButtonClick` cada vez que se hace clic en el botón.

```javascript
function handleCaptureButtonClick() {
```
Define la función `handleCaptureButtonClick`, que maneja el comportamiento del botón de captura según su estado actual.

```javascript
const buttonText = captureButton.textContent;
```
Obtiene el texto actual del botón de captura (`Iniciar Captura` o `Reiniciar`).

```javascript
if (buttonText === 'Iniciar Captura') {
    initiateCountdown();
} else {
    restartCamera();
}
```
Verifica si el texto del botón es "Iniciar Captura". Si es así, inicia la cuenta regresiva con `initiateCountdown`; si no, llama a `restartCamera` para reiniciar la cámara.

```javascript
function initiateCountdown() {
```
Define `initiateCountdown`, que muestra una cuenta regresiva antes de capturar la imagen.

```javascript
let countdown = 3;
```
Establece el contador en `3`, que es el tiempo de espera antes de la captura.

```javascript
const displayCount = document.getElementById('countDisplay');
const slider = document.getElementById('progressBar');
```
Selecciona los elementos para mostrar la cuenta (`countDisplay`) y la barra de progreso (`progressBar`).

```javascript
displayCount.style.display = 'block';
displayCount.textContent = countdown;
slider.value = 0;
```
Muestra el contador, establece el valor inicial del contador y de la barra de progreso.

```javascript
const intervalId = setInterval(() => {
```
Inicia un intervalo que ejecuta el bloque de código cada segundo.

```javascript
countdown--;
displayCount.textContent = countdown;
slider.value = ((3 - countdown) / 3) * 100;
```
Reduce el contador en uno, actualiza el valor mostrado y ajusta la barra de progreso.

```javascript
if (countdown === 0) {
    clearInterval(intervalId);
    displayCount.style.display = 'none';
    captureImage();
}
```
Cuando el contador llega a `0`, detiene el intervalo, oculta el contador y llama a `captureImage` para capturar la imagen.

```javascript
async function captureImage() {
```
Define la función `captureImage` para capturar la imagen de la transmisión de video y hacer una predicción.

```javascript
const videoElement = document.getElementById('cameraFeed');
const canvas = document.createElement('canvas');
canvas.width = videoElement.videoWidth;
canvas.height = videoElement.videoHeight;
```
Crea un elemento `<canvas>` con las mismas dimensiones que el video.

```javascript
const ctx = canvas.getContext('2d');
ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
```
Dibuja el cuadro del video en el canvas para capturar la imagen actual de la transmisión.

```javascript
const imageElement = document.getElementById('capturedFrame');
imageElement.src = canvas.toDataURL('image/png');
imageElement.classList.add('show');
captureButton.textContent = 'Reiniciar';
```
Convierte la imagen en el canvas a un formato de datos URL y la muestra en el elemento `capturedFrame`. Luego cambia el texto del botón a "Reiniciar".

```javascript
const resultText = await AIModel.runPrediction(canvas);
document.getElementById('resultText').textContent = resultText;
```
Ejecuta el modelo de predicción en la imagen capturada y muestra el resultado en `resultText`.

```javascript
function restartCamera() {
```
Define la función `restartCamera` para restablecer el estado inicial de la cámara y la interfaz.

```javascript
AIModel.activateCamera();
document.getElementById('capturedFrame').classList.remove('show');
document.getElementById('countDisplay').style.display = 'none';
captureButton.textContent = 'Iniciar Captura';
document.getElementById('resultText').textContent = "Resultado: -";
```
Reactiva la cámara, oculta la imagen capturada, reinicia el contador y el resultado, y cambia el texto del botón a "Iniciar Captura".

```javascript
});
```
Finaliza la función principal que espera a que el documento esté cargado.

--- 

---

# Código JavaScript: Clase `AIModel` para Manejo de IA y Cámara

```javascript
class AIModel {
```
Define la clase `AIModel`, que encapsula la lógica de carga del modelo de IA, activación de la cámara y predicción.

```javascript
constructor() {
    this.model = null;
    this.videoStream = null;
}
```
Define el constructor de la clase, inicializando las propiedades `model` y `videoStream` como `null`. `model` almacenará el modelo de IA, y `videoStream` gestionará la transmisión de video de la cámara.

```javascript
async loadModel() {
```
Define el método asíncrono `loadModel` para cargar el modelo de IA desde una URL externa.

```javascript
const modelPath = "https://teachablemachine.withgoogle.com/models/2iakE6Ea5/";
```
Establece la URL base donde se encuentran los archivos del modelo de Teachable Machine de Google.

```javascript
this.model = await tmImage.load(modelPath + "model.json", modelPath + "metadata.json");
```
Carga el modelo de IA usando `tmImage.load`, especificando la ruta de los archivos `model.json` y `metadata.json`, y lo asigna a `this.model`.

```javascript
console.log("Modelo IA cargado correctamente");
```
Muestra en la consola un mensaje de confirmación indicando que el modelo se ha cargado con éxito.

```javascript
async activateCamera() {
```
Define el método asíncrono `activateCamera` para activar la cámara y obtener la transmisión de video.

```javascript
try {
    this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    return this.videoStream;
} catch (error) {
```
Intenta acceder a la cámara usando `getUserMedia`, y asigna la transmisión de video a `this.videoStream`. Si la cámara se activa correctamente, se devuelve `this.videoStream`. Si ocurre un error, el bloque `catch` lo manejará.

```javascript
console.error("No se pudo acceder a la cámara:", error);
```
Muestra un mensaje de error en la consola si no se puede acceder a la cámara.

```javascript
alert("Verifica los permisos de cámara.");
```
Muestra una alerta para notificar al usuario sobre posibles problemas de permisos con la cámara.

```javascript
async runPrediction(capturedImage) {
```
Define el método asíncrono `runPrediction`, que toma una imagen capturada y realiza una predicción utilizando el modelo de IA cargado.

```javascript
if (this.model) {
```
Verifica si el modelo ha sido cargado. Si es así, continúa con el proceso de predicción.

```javascript
const predictions = await this.model.predict(capturedImage);
```
Realiza una predicción en la imagen capturada y guarda el resultado en `predictions`, un arreglo con posibles clases y sus probabilidades.

```javascript
const bestMatch = predictions.reduce((highest, current) =>
    current.probability > highest.probability ? current : highest
);
```
Encuentra la predicción con la probabilidad más alta usando `reduce`, y la asigna a `bestMatch`.

```javascript
return `Resultado: ${bestMatch.className} (${(bestMatch.probability * 100).toFixed(2)}%)`;
```
Devuelve el nombre de la clase con mayor probabilidad y su probabilidad en porcentaje, formateado como un resultado de texto.

```javascript
return "Sin resultado";
```
Si no hay un modelo cargado, devuelve el mensaje "Sin resultado".

```javascript
export default new AIModel();
```
Exporta una instancia de `AIModel` como predeterminado, para que otros módulos puedan usarla directamente sin crear una nueva instancia.

---


---

# Estilos CSS: Diseño y Estética de la Página

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}
```
- **`font-family`**: Define la fuente del texto como Arial o una fuente sans-serif.
- **`background-color`**: Asigna un color de fondo gris claro para toda la página (`#f4f4f9`).
- **`color`**: Establece el color del texto principal a gris oscuro (`#333`).
- **`margin`**: Elimina el margen externo del cuerpo (`0`).
- **`display`, `flex-direction`, `align-items`**: Utiliza el modelo flexbox en una columna centrada.
- **`padding`**: Agrega un espacio de `20px` alrededor del contenido.

```css
h1 {
    color: #4a4e69;
    font-size: 2.5rem;
    margin-bottom: 30px;
}
```
- **`color`**: Define el color del encabezado `h1` como un tono violeta (`#4a4e69`).
- **`font-size`**: Configura el tamaño de fuente en `2.5rem`.
- **`margin-bottom`**: Añade un espacio de `30px` debajo del título.

```css
.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 720px;
    display: flex;
    justify-content: center;
    margin: 20px 0;
}
```
- **`position`**: Establece la posición relativa para que el elemento pueda contener elementos posicionados absolutamente.
- **`width`, `max-width`**: La anchura es `100%` pero no excede los `720px`.
- **`display`, `justify-content`**: Centra el contenido horizontalmente dentro de este contenedor.
- **`margin`**: Agrega un margen vertical de `20px`.

```css
#cameraFeed, #capturedFrame {
    width: 100%;
    border: 2px solid #9a8c98;
    border-radius: 12px;
    transition: opacity 0.5s ease;
}
```
- **`width`**: Define la anchura de los elementos de video e imagen al `100%` del contenedor.
- **`border`, `border-radius`**: Asigna un borde de `2px` color gris claro (`#9a8c98`) y bordes redondeados de `12px`.
- **`transition`**: Crea una transición suave de opacidad de `0.5` segundos.

```css
#capturedFrame {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}
```
- **`position`, `top`, `left`**: Posiciona `capturedFrame` en la esquina superior izquierda de `video-wrapper`.
- **`opacity`**: Establece la opacidad inicial en `0` para ocultar la imagen capturada.

```css
#capturedFrame.show {
    opacity: 1;
}
```
- **`.show`**: Clase que hace visible `capturedFrame` cuando se aplica, estableciendo la opacidad en `1`.

```css
.control-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
}
```
- **`display`, `flex-direction`, `align-items`**: Utiliza flexbox en una columna centrada.
- **`margin-top`**: Añade un margen superior de `20px`.
- **`gap`**: Espacio entre elementos de `15px`.

```css
#countDisplay {
    font-size: 3rem;
    font-weight: 700;
    color: #22223b;
    display: none;
}
```
- **`font-size`, `font-weight`**: Ajusta el tamaño y el grosor de la fuente para el contador.
- **`color`**: Asigna un color oscuro (`#22223b`).
- **`display`**: Oculta el contador inicialmente (`none`).

```css
#resultText {
    font-size: 1.2rem;
    color: #4a4e69;
}
```
- **`font-size`**: Establece el tamaño de la fuente en `1.2rem`.
- **`color`**: Asigna un tono violeta claro (`#4a4e69`) al texto de resultados.

```css
#captureButton {
    background-color: #22223b;
    color: #f2e9e4;
    border: none;
    padding: 12px 28px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
```
- **`background-color`, `color`**: Establece un fondo oscuro para el botón y texto claro (`#f2e9e4`).
- **`border`**: Elimina el borde predeterminado.
- **`padding`, `font-size`, `border-radius`**: Ajusta el espacio interno, tamaño de fuente y bordes redondeados.
- **`cursor`**: Cambia el cursor a un puntero cuando el botón se pasa sobre él.
- **`transition`**: Añade una transición suave de `0.3s` al cambiar el color de fondo.

```css
#captureButton:hover {
    background-color: #4a4e69;
}
```
- **`background-color`**: Cambia el color de fondo del botón al pasar el ratón sobre él (`#4a4e69`).

```css
#progressBar {
    -webkit-appearance: none;
    width: 100%;
    max-width: 360px;
    height: 8px;
    border-radius: 4px;
    background: #c9ada7;
    outline: none;
    overflow: hidden;
    margin-top: 10px;
}
```
- **`-webkit-appearance`**: Elimina el estilo predeterminado en navegadores WebKit.
- **`width`, `max-width`, `height`, `border-radius`**: Define dimensiones y bordes redondeados de la barra de progreso.
- **`background`**: Establece el fondo de la barra de progreso en un tono gris claro (`#c9ada7`).
- **`outline`, `overflow`**: Elimina el borde de enfoque y oculta el contenido desbordado.
- **`margin-top`**: Añade un margen superior de `10px`.

```css
#progressBar::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4a4e69;
    cursor: pointer;
}
```
- **`-webkit-appearance`**: Elimina el estilo predeterminado para el "thumb" de WebKit.
- **`width`, `height`, `border-radius`**: Define el tamaño y forma redonda del "thumb" (selector).
- **`background`**: Establece el fondo en violeta (`#4a4e69`).
- **`cursor`**: Cambia el cursor a puntero.

```css
#progressBar::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4a4e69;
    cursor: pointer;
}
```
- **Mozilla-only CSS**: Aplica los mismos estilos al "thumb" en navegadores Mozilla.

---
