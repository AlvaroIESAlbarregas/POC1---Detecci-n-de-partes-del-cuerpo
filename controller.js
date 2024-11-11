import AIModel from './model.js';

document.addEventListener('DOMContentLoaded', async () => {
    await AIModel.loadModel();
    const videoStream = await AIModel.activateCamera();
    document.getElementById('cameraFeed').srcObject = videoStream;

    const captureButton = document.getElementById('captureButton');
    captureButton.addEventListener('click', handleCaptureButtonClick);

    function handleCaptureButtonClick() {
        const buttonText = captureButton.textContent;
        if (buttonText === 'Iniciar Captura') {
            initiateCountdown();
        } else {
            restartCamera();
        }
    }

    function initiateCountdown() {
        let countdown = 3;
        const displayCount = document.getElementById('countDisplay');
        const slider = document.getElementById('progressBar');
        displayCount.style.display = 'block';
        displayCount.textContent = countdown;
        slider.value = 0;

        const intervalId = setInterval(() => {
            countdown--;
            displayCount.textContent = countdown;
            slider.value = ((3 - countdown) / 3) * 100;

            if (countdown === 0) {
                clearInterval(intervalId);
                displayCount.style.display = 'none';
                captureImage();
            }
        }, 1000);
    }

    async function captureImage() {
        const videoElement = document.getElementById('cameraFeed');
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageElement = document.getElementById('capturedFrame');
        imageElement.src = canvas.toDataURL('image/png');
        imageElement.classList.add('show');
        captureButton.textContent = 'Reiniciar';

        const resultText = await AIModel.runPrediction(canvas);
        document.getElementById('resultText').textContent = resultText;
    }

    function restartCamera() {
        AIModel.activateCamera();
        document.getElementById('capturedFrame').classList.remove('show');
        document.getElementById('countDisplay').style.display = 'none';
        captureButton.textContent = 'Iniciar Captura';
        document.getElementById('resultText').textContent = "Resultado: -";
    }
});
