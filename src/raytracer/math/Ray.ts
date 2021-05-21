import { Vector } from "./Vector";

export class Ray {

    public direction: Vector;

    constructor(
        public start: Vector,
        private end: Vector,
    ) {
        this.direction = this.end.minusVector(start);
    }

    public pointAt(d: number): Vector {
        return this.start.addVector(this.direction.multiplyScalar(d));
    }

    public reflect(): Vector {
        const { start, end } = this;
        return end.multiplyScalar(2).multiplyScalar(end.dot(start)).minusVector(start);
    }

}