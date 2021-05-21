import { Color } from "../core/Color";
import { Vector } from "../math/Vector";
import { RenderableObjectType } from "./RenderableObjectType";

export class RenderableObject {

  protected type: RenderableObjectType = RenderableObjectType.Empty;

  constructor(
    public center: Vector,
    public color = new Color(),
    public specular = -1,
    public reflective = 0,
    public transparency = 0,
  ) { }

  public intersect(origin: Vector, viewport: Vector): number[] {
    return [Infinity, Infinity];
  }

  public moveTo(x: number, y: number, z: number) {
    this.center = new Vector(x, y, z);
  }

  public getNormal(v: Vector): Vector {
    const direction = v.minusVector(this.center);
    return direction.divideScalar(direction.magnitude());
  }

}