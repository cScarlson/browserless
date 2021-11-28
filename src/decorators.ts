
import { IBoot, TNode, TPropertyChangedDetail } from './interfaces';
import { LIFECYCLE_EVENTS, publish } from './events';

class MethodProxyHandler {
    
    constructor(protected proxy: ComponentProxyHandler) {}
    
    apply(target: Function, thus: any, splat: ArrayLike<any>): any {
        var { proxy } = this;
        return Reflect.apply(target, proxy, splat);
    }
    
}

class ComponentProxyHandler {
    
    constructor(protected boot: IBoot<TNode>, protected node: TNode) {}
    
    get(target: any, key: PropertyKey, receiver?: any): any {
        var { node } = this;
        var fallback = Reflect.get(target, key, receiver);
        var preferred = node[key];
        var has = node[key] !== undefined && node[key] !== null && node[key] !== ''; // if even empty string, prefer fallback anyway.
        
        if (has) return preferred;
        return fallback;
    }
    
    set(target: NodeDecorator, key: PropertyKey, value: any, receiver?: any): boolean {
        var { boot, node } = this;
        var previous = target[key];
        var details: TPropertyChangedDetail = { boot, target, key, value, receiver, previous };
        var result = Reflect.set(target, key, value);  // run reflection before publishments.
        
        target.fire(LIFECYCLE_EVENTS.onpropertychanged, details);
        publish(LIFECYCLE_EVENTS.onpropertychanged, details);
        
        return result;
    }
    
}

class NodeDecorator {
    
    constructor(protected node: Node) {}
    
    fire(type: string, data?: any) {
        var { node } = this;
        var e = new CustomEvent(type, { detail: data });
        
        node.dispatchEvent(e);
        return this;
    }
    
    on(type: string, handler: Function, options: any = false) {
        var { node } = this;
        node.addEventListener(type, handler as EventListener, options);
        return this;
    }
    
    off(type: string, handler: Function, options: any = false) {
        var { node } = this;
        node.removeEventListener(type, handler as EventListener, options);
        return this;
    }
    
}

export { MethodProxyHandler, ComponentProxyHandler };
export {
    NodeDecorator,
};
