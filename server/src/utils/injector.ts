export class Injector {
  private static instance: Injector;
  private _di: any = {};

  private constructor() {}

  public static getInstance() {
    if (!Injector.instance) {
      Injector.instance = new Injector();
    }
    return Injector.instance;
  }

  public addService(dependency, args) {
    if (this.serviceExists(dependency.name)) {
      return;
    }
    const construction = new dependency.prototype.constructor(args);
    this._di[dependency.name] = construction;
  }

  public getInjector() {
    return this._di;
  }

  public getService<T>(dependency): T {
    if (!this.serviceExists(dependency.name)) {
      return {} as T;
    }
    const di: any = this._di as T;
    return this._di[dependency.name];
  }

  private serviceExists(name: string) {
    return this._di[name] ? true : false;
  }
}
