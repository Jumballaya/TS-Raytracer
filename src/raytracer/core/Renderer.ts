import { Canvas } from "./Canvas";
import { Color } from "./Color";

export class Renderer {

    protected cvs: Canvas;

    constructor(
        protected width: number,
        protected height: number,
    ) {
        this.cvs = new Canvas(width, height);
    }

    public draw() { }

    public toPng(): Buffer {
        return Buffer.from(new Array());
    }

    public putPixel(x: number, y: number, color: Color) {
        this.cvs.putPixel(x, y, color);
    }

    public dimensions(): [number, number] {
        return [this.width, this.height];
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cvs.setDimensions(width, height);
    }
}