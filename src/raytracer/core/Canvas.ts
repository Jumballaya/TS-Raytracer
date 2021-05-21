import { Color } from "./Color";

export class Canvas {
    private pixels: Color[];

    constructor(
        private width: number,
        private height: number,
    ) {
        this.pixels = Array.from(new Array(this.height * this.width), () => new Color(255, 255, 255));
    }

    public putPixel(_x: number, _y: number, color: Color) {
        const { height, width } = this;
        const x = (width / 2) + _x;
        const y = (height / 2) - _y;
        const index = x + (y * width);
        this.pixels[index] = color;
        return;
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = Array.from(new Array(this.height * this.width), () => new Color(255, 255, 255));
    }

    public data() {
        return this.pixels;
    }
}