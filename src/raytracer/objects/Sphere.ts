import { Color } from "../core/Color";
import { Vector } from "../math/Vector";
import { RenderableObject } from "./RenderableObject";
import { RenderableObjectType } from "./RenderableObjectType";

export class Sphere extends RenderableObject {
    constructor(
        center: Vector,
        public radius: number,
        color: Color,
        specular = -1,
        reflective = 0,
        transparency = 0,
    ) {
        super(center, color, specular, reflective, transparency);
        this.type = RenderableObjectType.Sphere;
    }

    public intersect(origin: Vector, viewport: Vector): number[] {
        const { radius } = this;

        const cO = origin.minusVector(this.center);
        const a = viewport.dot(viewport);
        const b = 2 * cO.dot(viewport);
        const c = cO.dot(cO) - (radius * radius);

        const discriminant = (b * b) - (4 * a * c);
        if (discriminant < 0) {
            return [Infinity, Infinity];
        }

        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [t1, t2];
    }

}