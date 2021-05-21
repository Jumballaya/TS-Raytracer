

export interface Tree {
    meta: MetaValue[];
    objects: ObjectValue<'object'>[];
    lights: ObjectValue<'light'>[];
}

export type VectorValue = [string, string, string];

export interface MetaValue {
    name: string;
    value: string | VectorValue;
}

export type ObjectTypes = 'sphere';
export type LightTypes = 'point' | 'ambient' | 'directional';
export type ObjectClassTypes = 'object' | 'light';

export interface ObjectValue<C = ObjectClassTypes> {
    class: C;
    type: ObjectTypes | LightTypes;
    name: string;
    values: MetaValue[];
};