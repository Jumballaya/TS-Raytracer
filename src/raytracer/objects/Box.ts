import { Color } from "../core/Color";
import { Vector } from "../math/Vector";
import { RenderableObject } from "./RenderableObject";
import { RenderableObjectType } from "./RenderableObjectType";

export class Box extends RenderableObject {
    public min: Vector = new Vector();
    public max: Vector = new Vector();

    constructor(
        center: Vector,
        public size: number,
        color: Color,
        specular = -1,
        reflective = 0,
    ) {
        super(center, color, specular, reflective);
        this.max = center.addVector(new Vector(size / 2, size / 2, size / 2));
        this.min = center.addVector(new Vector(-size / 2, -size / 2, -size / 2));
        this.type = RenderableObjectType.Box;
    }

    public intersect(origin: Vector, viewport: Vector): number[] {
        const [minX, minY, minZ] = this.min.getValues();
        const [maxX, maxY, maxZ] = this.max.getValues();
        const [oX, oY, oZ] = origin.getValues();
        const [vX, vY, vZ] = viewport.getValues();
        let tMin = (minX - oX) / vX;
        let tMax = (maxX - oX) / vX;

        if (tMin > tMax) {
            [tMin, tMax] = [tMax, tMin];
        }

        let tyMin = (minY - oY) / vY;
        let tyMax = (maxY - oY) / vY;

        if (tyMin > tyMax) {
            [tyMin, tyMax] = [tyMax, tyMin];
        }

        if ((tMin > tyMax) || (tyMin > tMax)) {
            return [Infinity];
        }

        if (tyMin > tMin) {
            tMin = tyMin;
        }

        if (tyMax < tMax) {
            tMax = tyMax;
        }

        let tzMin = (minZ - oZ) / vZ;
        let tzMax = (maxZ - oZ) / vZ;

        if (tzMin > tzMax) {
            [tzMin, tzMax] = [tzMax, tzMin];
        }

        if ((tMin > tzMax) || (tzMin > tMax)) {
            return [Infinity];
        }

        if (tzMin > tMin) {
            tMin = tzMin;
        }

        if (tzMax < tMax) {
            tMax = tzMax;
        }

        return [
            tMin,
            tMax,
        ];
    }
}