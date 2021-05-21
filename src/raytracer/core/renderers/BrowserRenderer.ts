import { Renderer } from "../Renderer";

export class BrowserRenderer extends Renderer {
    private $canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(
        width: number,
        height: number,
    ) {
        super(width, height);
        this.$canvas = document.createElement('canvas');
        this.$canvas.setAttribute('width', width.toString());
        this.$canvas.setAttribute('height', height.toString());
        this.ctx = this.$canvas.getContext('2d') as CanvasRenderingContext2D;
        console.log('BrowserRenderer Initialized');
    }

    public setDimensions(width: number, height: number) {
        super.setDimensions(width, height);
        this.$canvas.setAttribute('width', width.toString());
        this.$canvas.setAttribute('height', height.toString());
        this.cvs.setDimensions(width, height);
    }

    public setParent(parent: HTMLElement) {
        parent.appendChild(this.$canvas);
    }

    public draw() {
        const { width, height } = this;
        const screenData = this.cvs.data();
        const imageData = this.ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const color = screenData[i / 4];
            const [red, green, blue] = color.getValues();
            imageData.data[i] = red;
            imageData.data[i + 1] = green;
            imageData.data[i + 2] = blue;
            imageData.data[i + 3] = 255;
        }
        requestAnimationFrame(() => {
            this.ctx.putImageData(imageData, -1, -1);
        });
    }

    public toPng(): Buffer {
        const str = this.$canvas.toDataURL('image/png');
        const base64Data = str.split('data:image/png;base64,')[1];
        return Buffer.from(base64Data, 'base64');
    }
}