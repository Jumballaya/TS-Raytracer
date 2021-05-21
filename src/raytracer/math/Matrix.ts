import { Vector } from "./Vector";

type MatrixConstructor = [
    number, number, number,
    number, number, number,
    number, number, number,
];

export class Matrix {
    private rows: [Vector, Vector, Vector];

    constructor(private values: MatrixConstructor) {
        this.rows = [
            new Vector(values[0], values[1], values[2]),
            new Vector(values[3], values[4], values[5]),
            new Vector(values[6], values[7], values[8]),
        ];
    }

    public getRow(i: number): Vector {
        if (i <= 2 && i >= 0) {
            return this.rows[i];
        }
        return this.rows[2];
    }

    public getAt(x: number, y: number): number {
        const index = (y * 3) + x;
        if (index >= 0 && index <= 8) {
            return this.values[index];
        }
        return this.values[8];
    }

    public multiplyMatrix(n: Matrix): Matrix {
        const m = this;
        const values: MatrixConstructor = [
            (m.getAt(0, 0) * n.getAt(0, 0)) + (m.getAt(0, 1) * n.getAt(1, 0)) + (m.getAt(0, 2) * n.getAt(2, 0)),
            (m.getAt(0, 0) * n.getAt(0, 1)) + (m.getAt(0, 1) * n.getAt(1, 1)) + (m.getAt(0, 2) * n.getAt(2, 1)),
            (m.getAt(0, 0) * n.getAt(0, 2)) + (m.getAt(0, 1) * n.getAt(1, 2)) + (m.getAt(0, 2) * n.getAt(2, 2)),

            (m.getAt(1, 0) * n.getAt(0, 0)) + (m.getAt(1, 1) * n.getAt(1, 0)) + (m.getAt(1, 2) * n.getAt(2, 0)),
            (m.getAt(1, 0) * n.getAt(0, 1)) + (m.getAt(1, 1) * n.getAt(1, 1)) + (m.getAt(1, 2) * n.getAt(2, 1)),
            (m.getAt(1, 0) * n.getAt(0, 2)) + (m.getAt(1, 1) * n.getAt(1, 2)) + (m.getAt(1, 2) * n.getAt(2, 2)),

            (m.getAt(2, 0) * n.getAt(0, 0)) + (m.getAt(2, 1) * n.getAt(1, 0)) + (m.getAt(2, 2) * n.getAt(2, 0)),
            (m.getAt(2, 0) * n.getAt(0, 1)) + (m.getAt(2, 1) * n.getAt(1, 1)) + (m.getAt(2, 2) * n.getAt(2, 1)),
            (m.getAt(2, 0) * n.getAt(0, 2)) + (m.getAt(2, 1) * n.getAt(1, 2)) + (m.getAt(2, 2) * n.getAt(2, 2)),
        ];
        return new Matrix(values);
    }

    public multiplyVector(v: Vector): Vector {
        const m = this;
        const [x, y, z] = v.getValues();
        return new Vector(
            (m.getAt(0, 0) * x) + (m.getAt(0, 1) * y) + (m.getAt(0, 2) * z),
            (m.getAt(1, 0) * x) + (m.getAt(1, 1) * y) + (m.getAt(1, 2) * z),
            (m.getAt(2, 0) * x) + (m.getAt(2, 1) * y) + (m.getAt(2, 2) * z),
        );
    }

    public rotateX(r: number): Matrix {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const values: MatrixConstructor = [
            1, 0, 0,
            0, c, -s,
            0, s, c,
        ];
        return new Matrix(values);
    }

    public rotateY(r: number): Matrix {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const values: MatrixConstructor = [
            c, 0, s,
            0, 1, 0,
            -s, 0, c,
        ];
        return new Matrix(values);
    }

    public rotateZ(r: number): Matrix {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const values: MatrixConstructor = [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
        return new Matrix(values);
    }
}