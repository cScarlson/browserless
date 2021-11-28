
import { MixinBus } from '@browserless/mixins';

describe("MixinBus", () => {
    
    it("decorates an object with `fire`, `on` and `off` methods", () => {
        const object = {};
        const res = MixinBus.call(object);
        
        expect(res).toBe(object);
        expect(res.fire).toBeInstanceOf(Function);
        expect(res.on).toBeInstanceOf(Function);
        expect(res.off).toBeInstanceOf(Function);
    });
    
    it("expects decoratee to bear a `v:node` property that is a Node", () => {
        const object = { 'v:node': document.createElement('mock') }, faulty = {};
        const res1 = MixinBus.call(object);
        const res2 = MixinBus.call(faulty);
        
        expect(res1.fire).not.toThrowError();
        expect(res2.fire).toThrowError();
    });
    
    it("`fire` invokes dispatchEvent on Node (see events.spec.ts#publish)", () => {
        const node = document.createElement('mock');
        const spy = jest.spyOn(node, 'dispatchEvent');
        const object = { 'v:node': node }, faulty = {};
        const res1 = MixinBus.call(object);
        const res2 = MixinBus.call(faulty);
        
        expect(res1.fire).not.toThrowError();
        expect(res2.fire).toThrowError();
    });
    
    it("`on` invokes addEventListener on Node (see events.spec.ts#publish)", () => {
        const node = document.createElement('mock');
        const spy = jest.spyOn(node, 'addEventListener');
        const object = { 'v:node': node }, faulty = {};
        const res1 = MixinBus.call(object);
        const res2 = MixinBus.call(faulty);
        
        expect(res1.on).not.toThrowError();
        expect(res2.on).toThrowError();
    });
    
    it("`off` invokes removeEventListener on Node (see events.spec.ts#publish)", () => {
        const node = document.createElement('mock');
        const spy = jest.spyOn(node, 'removeEventListener');
        const object = { 'v:node': node }, faulty = {};
        const res1 = MixinBus.call(object);
        const res2 = MixinBus.call(faulty);
        
        expect(res1.off).not.toThrowError();
        expect(res2.off).toThrowError();
    });

});
