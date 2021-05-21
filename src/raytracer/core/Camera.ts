import { Matrix } from "../math/Matrix";
import { Vector } from "../math/Vector";

interface CameraViewport {
    dimensions: [number, number];
    distance: number;
}

export class Camera {
    public position: Vector = new Vector(0, 0, 0);
    public viewport: CameraViewport = {
        dimensions: [1, 1],
        distance: 1,
    };
    public rotation: Matrix = new Matrix([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]);

    constructor(dimensions: [number, number] = [1, 1], distance = 1) {
        this.viewport.dimensions = dimensions;
        this.viewport.distance = distance;
    }

    public rotate(r: Vector) {
        const [rX, rY, rZ] = r.getValues();
        const rotX = this.rotation.rotateX(rX)
        const rotY = this.rotation.rotateY(rY);
        const rotZ = this.rotation.rotateZ(rZ);
        this.rotation = rotX.multiplyMatrix(rotY).multiplyMatrix(rotZ);
    }
}