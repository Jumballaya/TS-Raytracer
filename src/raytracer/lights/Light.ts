import { Vector } from "../math/Vector";
import { LightType } from "./LightType";

export class Light {

    public direction: Vector = new Vector();
    public position: Vector = new Vector();

    constructor(
        public type: LightType,
        public intensity: Vector,
        v = new Vector(),
    ) {
        if (type === LightType.Point) {
            this.position = v;
        }
        if (type === LightType.Directional) {
            this.direction === v;
        }
    }
}