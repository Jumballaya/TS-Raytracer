import { Renderer } from "../Renderer";

export class NodeRenderer extends Renderer {

    public imageData: Buffer = Buffer.alloc(0);

    constructor(width: number, height: number) {
        super(width, height);
        console.log('NodeRenderer Initialized');
    }

    public draw() {
        const { width, height } = this;
        const screenData = this.cvs.data();
        this.imageData = Buffer.alloc(width * height * 4);
        for (let i = 0; i < this.imageData.length; i += 4) {
            const color = screenData[i / 4];
            const [red, green, blue] = color.getValues();
            this.imageData[i] = red;
            this.imageData[i + 1] = green;
            this.imageData[i + 2] = blue;
            this.imageData[i + 3] = 255;
        }
    }

    public toPng() {
        return this.imageData;
    }
}