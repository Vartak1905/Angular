import { Roles } from './roles';

export class User {
    public _name: string;
    public _roles: Roles[];

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get roles(): Roles[] {
        return this._roles;
    }
    public set roles(value: Roles[]) {
        this._roles = value;
    }

    constructor() {}

}
