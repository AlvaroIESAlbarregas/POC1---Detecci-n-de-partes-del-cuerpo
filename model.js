class AIModel {
    constructor() {
        this.model = null;
        this.videoStream = null;
    }

    async loadModel() {
        const modelPath = "https://teachablemachine.withgoogle.com/models/2iakE6Ea5/";
        this.model = await tmImage.load(modelPath + "model.json", modelPath + "metadata.json");
        console.log("Modelo IA cargado correctamente");
    }

    async activateCamera() {
        try {
            this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            return this.videoStream;
        } catch (error) {
            console.error("No se pudo acceder a la cámara:", error);
            alert("Verifica los permisos de cámara.");
        }
    }

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
}

export default new AIModel();
