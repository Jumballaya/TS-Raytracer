
export class Vector {

    protected values: [number, number, number] = [0, 0, 0];

    constructor(
        v1 = 0,
        v2 = 0,
        v3 = 0,
    ) {
        this.values = [v1, v2, v3];
    }

    public getValues(): [number, number, number] {
        return this.values;
    }

    public magnitude() {
        const [v1, v2, v3] = this.values;
        if (v1 === 0 && v2 === 0 && v3 === 0) {
            return 0;
        }
        return Math.sqrt((v1 * v1) + (v2 * v2) + (v3 * v3));
    }

    public dot(v: Vector): number {
        const [_v1, _v2, _v3] = this.values;
        const [v1, v2, v3] = v.getValues();
        return (_v1 * v1) + (_v2 * v2) + (_v3 * v3);
    }

    public multiplyScalar(scalar: number): Vector {
        const { values } = this;
        const [v1, v2, v3] = values;
        const _v1 = v1 * scalar;
        const _v2 = v2 * scalar;
        const _v3 = v3 * scalar;
        return new Vector(_v1, _v2, _v3);
    }

    public divideScalar(scalar: number): Vector {
        return this.multiplyScalar(1.0 / scalar);
    }

    public addVector(v: Vector): Vector {
        const [_v1, _v2, _v3] = this.values;
        const [v1, v2, v3] = v.getValues();
        return new Vector(
            _v1 + v1,
            _v2 + v2,
            _v3 + v3,
        );
    }

    public minusVector(v: Vector): Vector {
        const [_v1, _v2, _v3] = this.values;
        const [v1, v2, v3] = v.getValues();
        return new Vector(
            _v1 - v1,
            _v2 - v2,
            _v3 - v3,
        );
    }

    public plusEquals(v: Vector): void {
        const [_v1, _v2, _v3] = this.values;
        const [v1, v2, v3] = v.getValues();
        this.values = [_v1 + v1, _v2 + v2, _v3 + v3];
    }
}