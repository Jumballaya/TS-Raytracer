import { Color } from "../../raytracer/core/Color";
import { Scene } from "../../raytracer/core/Scene";
import { Light } from "../../raytracer/lights/Light";
import { LightType } from "../../raytracer/lights/LightType";
import { Vector } from "../../raytracer/math/Vector";
import { RenderableObject } from "../../raytracer/objects/RenderableObject";
import { Sphere } from "../../raytracer/objects/Sphere";
import { Parser } from "../parser/Parser";
import { MetaValue, ObjectValue, Tree, VectorValue } from "../parser/Types";

export class Assembler {
    private tree: Tree;

    constructor(input: string) {
        const p = new Parser(input);
        this.tree = p.parse();
    }

    public assemble(): Scene {
        // Meta
        const width = parseInt(this.getMetaValue('screen_width').value as string);
        const height = parseInt(this.getMetaValue('screen_height').value as string);

        // Scene
        const scene = new Scene([width, height]);

        // Objects
        this.tree.objects.forEach(o => {
            const obj = this.createObject(o);
            scene.addObject(obj);
        })

        // Lights
        this.tree.lights.forEach(l => {
            const light = this.createLight(l);
            scene.addLight(light);
        })

        return scene;
    }

    private getMetaValue(name: string): MetaValue {
        const width = this.tree.meta.filter(m => m.name === name);
        const meta = width.length > 0 ? width[0] : { name, value: '' };
        return meta;
    }

    private createObject(obj: ObjectValue): RenderableObject {
        let c = this.getValue(obj.values, 'center', ['0', '0', '0']);
        if (!(c instanceof Array)) c = ['0', '0', '0'];
        const center = new Vector(parseFloat(c[0]), parseFloat(c[1]), parseFloat(c[2]));

        let co = this.getValue(obj.values, 'color', ['0', '0', '0']);
        if (!(co instanceof Array)) co = ['0', '0', '0'];
        const color = new Color(parseFloat(co[0]), parseFloat(co[1]), parseFloat(co[2]));

        let spec = this.getValue(obj.values, 'specular', '-1');
        if (spec instanceof Array) spec = '0';
        const specular = parseFloat(spec);

        let ref = this.getValue(obj.values, 'reflective', '0');
        if (ref instanceof Array) ref = '0';
        const reflective = parseFloat(ref);

        let trans = this.getValue(obj.values, 'transparency', '0');
        if (trans instanceof Array) trans = '0';
        const transparency = parseFloat(trans);


        switch (obj.type) {
            case 'sphere': {
                let r = this.getValue(obj.values, 'radius', '1');
                if (r instanceof Array) r = r[0] || '1';
                const radius = parseFloat(r);
                return new Sphere(center, radius, color, specular, reflective, transparency);
            }

            default: {
                throw new Error(`Undefined Renderable: ${obj.type}`);
            }
        }
    }

    private getValue(values: MetaValue[], name: string, def: string | VectorValue): string | VectorValue {
        let v = values.filter(val => val.name === name);
        if (v.length > 0) {
            return v[0].value;
        }
        return def;
    }

    private createLight(l: ObjectValue): Light {
        let int = this.getValue(l.values, 'intensity', ['0', '0', '0']);
        if (!(int instanceof Array)) int = ['0', '0', '0'];
        const intensity = new Vector(parseFloat(int[0]), parseFloat(int[1]), parseFloat(int[2]));

        switch (l.type) {
            case 'ambient': {
                return new Light(LightType.Ambient, intensity);
            }

            case 'directional': {
                let dir = this.getValue(l.values, 'direction', ['0', '0', '0']);
                if (!(dir instanceof Array)) dir = ['0', '0', '0'];
                const direction = new Vector(parseFloat(dir[0]), parseFloat(dir[1]), parseFloat(dir[2]));
                return new Light(LightType.Directional, intensity, direction);
            }

            case 'point': {
                let pos = this.getValue(l.values, 'position', ['0', '0', '0']);
                if (!(pos instanceof Array)) pos = ['0', '0', '0'];
                const position = new Vector(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2]));
                return new Light(LightType.Point, intensity, position);
            }

            default: {
                throw new Error(`Undefined Renderable: ${l.type}`);
            }
        }
    }
}
