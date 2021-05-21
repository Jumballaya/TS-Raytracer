import { Vector } from "../math/Vector";

export class Color extends Vector {
    public value: number;

    constructor(
        red = 0,
        green = 0,
        blue = 0,
    ) {
        super(red, green, blue);
        this.value = (red << 16) | (green << 8) | (blue);
    }

    public fromValue(value: number) {
        const [r, g, b] = this.converValue(value);
        return new Color(this.clamp(r), this.clamp(g), this.clamp(b));
    }

    public fromVector(v: Vector) {
        const [r, g, b] = v.getValues();
        return new Color(this.clamp(r), this.clamp(g), this.clamp(b));
    }

    public multiplyScalar(scalar: number) {
        const v = super.multiplyScalar(scalar);
        return new Color().fromVector(v);
    }

    public multiplyVector(v: Vector) {
        const [r, g, b] = v.getValues();
        const [_r, _g, _b] = this.values;
        const blend = new Vector(
            r * _r,
            g * _g,
            b * _b,
        );
        return new Color().fromVector(blend);
    }

    public addVector(_v: Vector) {
        const v = super.addVector(_v);
        return new Color().fromVector(v);
    }

    public addColor(color: Color) {
        return this.addVector(color);
    }

    public minusVector(_v: Vector) {
        const v = super.minusVector(_v);
        return new Color().fromVector(v);
    }

    public minusColor(color: Color) {
        return this.minusVector(color);
    }

    private converValue(value: number): [number, number, number] {
        const r = (value >> 16) & 0xff;
        const g = (value >> 8) & 0xff;
        const b = value & 0xff;
        return [r, g, b];
    }

    private clamp(color: number) {
        if (color <= 0) return 0;
        if (color >= 255) return 255;
        return color;
    }

}