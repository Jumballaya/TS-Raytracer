import { Camera } from "./Camera";
import { Color } from "./Color";
import { Light } from "../lights/Light";
import { LightType } from "../lights/LightType";
import { RenderableObject } from "../objects/RenderableObject";
import { Vector } from "../math/Vector";
import { Renderer } from "./Renderer";
import { BrowserRenderer } from "./renderers/BrowserRenderer";
import { NodeRenderer } from "./renderers/NodeRenderer";
import { Ray } from "../math/Ray";

const WHITE = new Color(255, 255, 255);
const BLACK = new Color(0, 0, 0);

export class Scene {

  private objects: RenderableObject[] = [];
  private lights: Light[] = [];
  private camera: Camera;
  private renderer: Renderer;

  constructor(private resolution: [number, number]) {
    this.renderer = typeof window === 'undefined'
      ? new NodeRenderer(resolution[0], resolution[1])
      : new BrowserRenderer(resolution[0], resolution[1]);
    const ratio = this.getRatio(resolution);
    this.camera = new Camera(ratio, 1);
  }

  public render(reduceBy = 1) {
    const [w, h] = this.resolution;
    this.renderer.setDimensions(Math.floor(w / reduceBy), Math.floor(h / reduceBy));
    const [cWidth, cHeight] = this.renderer.dimensions();
    const [vWidth, vHeight] = this.camera.viewport.dimensions;
    for (let cY = -(cHeight / 2); cY < (cHeight / 2); cY++) {
      for (let cX = -(cWidth / 2); cX < (cWidth / 2); cX++) {
        const vX = cX * (vWidth / cWidth);
        const vY = cY * (vHeight / cHeight);
        const { distance } = this.camera.viewport;
        const origin = this.camera.position;
        const viewport = this.camera.rotation.multiplyVector((new Vector(vX, vY, distance)));
        const renderedColor = this.traceRay(origin, viewport, distance, Infinity, 100);
        this.renderer.putPixel(cX, cY, renderedColor);
      }
    }
  }

  public rotateCamera(v: Vector) {
    this.camera.rotate(v);
  }

  public moveCamera(v: Vector) {
    this.camera.position = v;
  }

  public getSize() {
    return this.renderer.dimensions();
  }

  public draw() {
    this.renderer.draw();
  }

  public toPng() {
    return this.renderer.toPng();
  }

  public setParent(parent: HTMLElement) {
    if (this.renderer instanceof BrowserRenderer) {
      this.renderer.setParent(parent);
    }
  }

  public addObject(obj: RenderableObject): void {
    this.objects.push(obj);
  }

  public addLight(light: Light): void {
    this.lights.push(light);
  }

  private traceRay(origin: Vector, viewport: Vector, min: number, max: number, rDepth: number): Color {
    const [hit, object] = this.getClosestHit(origin, viewport, min, max);
    const inverseViewport = viewport.multiplyScalar(-1);

    // No object hit, return background color
    if (object == null) {
      return BLACK;
    }

    // Lighting
    const intersection = origin.addVector(viewport.multiplyScalar(hit));
    const normal = object.getNormal(intersection);
    const lighting = this.computeLighting(intersection, normal, inverseViewport, object.specular);
    let color = object.color.multiplyVector(lighting);

    // Reflection
    const reflective = object.reflective;
    if (rDepth > 0 && reflective > 0) {
      const ray = new Ray(inverseViewport, normal);
      const reflectedRay = ray.reflect();
      const reflectedColor = this.traceRay(intersection, reflectedRay, 0.001, Infinity, rDepth - 1);
      color = color.multiplyScalar(1 - reflective).addVector(reflectedColor.multiplyScalar(reflective));
    }

    // Transparency
    const transparency = object.transparency;
    if (rDepth > 0 && transparency > 0) {
      const transparentColor = this.traceRay(origin, viewport, hit + 0.001, Infinity, rDepth - 1);
      color = color.multiplyScalar(1 - transparency).addVector(transparentColor.multiplyScalar(transparency));
    }

    return color;
  }

  private getClosestHit(origin: Vector, viewport: Vector, min: number, max: number): [number, RenderableObject | null] {
    let closestT = Infinity;
    let closestObj: RenderableObject | null = null;
    for (let obj of this.objects) {
      const tangents = obj.intersect(origin, viewport);
      for (let t of tangents) {
        if (t >= min && t <= max && t < closestT) {
          closestT = t;
          closestObj = obj;
        }
      }
    }
    return [closestT, closestObj];
  }

  private computeLighting(intersection: Vector, normal: Vector, distance: Vector, specular: number): Vector {
    const i = new Vector();
    for (let light of this.lights) {

      // Ambient Light
      if (light.type === LightType.Ambient) {
        i.plusEquals(light.intensity);
        continue;
      }

      // Light direction
      const lDirection = this.getLightDirection(intersection, light);

      // Shadows
      const tmax = light.type === LightType.Point ? 1 : Infinity;
      const [_, shadowObj] = this.getClosestHit(intersection, lDirection, 0.001, tmax);
      if (shadowObj !== null) {
        continue;
      }

      // Diffuse Lighting
      const diffuseLighting = this.calculateDiffuseLighting(lDirection, normal, light);
      i.plusEquals(diffuseLighting)

      // Specular Lighting
      const specularLighting = this.calculateSpecularLighting(lDirection, normal, light, distance, specular);
      i.plusEquals(specularLighting);
    }
    return i;
  }

  private getLightDirection(intersection: Vector, light: Light) {
    let direction = new Vector();
    // Point Light
    if (light.type === LightType.Point) {
      direction = light.position.minusVector(intersection);
    }

    // Directional Light
    if (light.type === LightType.Directional) {
      direction = light.direction;
    }
    return direction;
  }

  private calculateDiffuseLighting(direction: Vector, normal: Vector, light: Light) {
    const nDotL = normal.dot(direction);
    if (nDotL > 0) {
      const lightMod = nDotL / (normal.magnitude() * direction.magnitude());
      const lightLevel = light.intensity.multiplyScalar(lightMod);
      return lightLevel;
    }
    return new Vector();
  }

  private calculateSpecularLighting(direction: Vector, normal: Vector, light: Light, distance: Vector, specular: number) {
    if (specular !== -1) {
      const reflected = normal.multiplyScalar(2).multiplyScalar(normal.dot(direction)).minusVector(direction);
      const rDotDist = reflected.dot(distance);
      if (rDotDist > 0) {
        const lightMod = Math.pow(rDotDist / (reflected.magnitude() * distance.magnitude()), specular);
        const lightLevel = light.intensity.multiplyScalar(lightMod);
        return lightLevel;
      }
    }
    return new Vector();
  }

  private getRatio(resolution: [number, number]): [number, number] {
    const [width, height] = resolution;
    return [width / height, 1];
  }

}