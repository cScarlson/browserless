
import { networkbus } from '@browserless/core';
import { LIFECYCLE_EVENTS, publish, subscribe, unsubscribe } from '@browserless/events';

describe("publish", () => {
    
    it("invokes dispatchEvent on networkbus with a CustomEvent whose type is first argument and detail is second", () => {
        const spy = jest.spyOn(networkbus, 'dispatchEvent');
        const channel = 'testchannel', detail = { };
        const res = publish(channel, detail);
        
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
        expect(spy.mock.calls[0][0].type).toBe(channel);
        expect((spy.mock.calls[0][0] as any).detail).toBe(detail);
    });
    
});

describe("subscribe", () => {
    
    it("invokes addEventListener on networkbus with type as first argument, callback as second and `false` as third", () => {
        const spy = jest.spyOn(networkbus, 'addEventListener');
        const channel = 'testchannel', callback = jest.fn();
        const res = subscribe(channel, callback);
        
        expect(spy).toHaveBeenCalledWith(channel, callback, false);
    });
    
});

describe("unsubscribe", () => {
    
    it("invokes removeEventListener on networkbus with type as first argument, callback as second and `false` as third", () => {
        const spy = jest.spyOn(networkbus, 'removeEventListener');
        const channel = 'testchannel', callback = jest.fn();
        const res = unsubscribe(channel, callback);
        
        expect(spy).toHaveBeenCalledWith(channel, callback, false);
    });
    
});
