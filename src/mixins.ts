
const MixinBus = function MixinBus(settings: Map<string, any>) {
    var thus = this;
    var { ['v:node']: node } = this;
    
    function fire(type: string, data?: any) {
        var e = new CustomEvent(type, { detail: data });
        
        node.dispatchEvent(e);
        return this;
    }
    
    function on(type: string, handler: Function, options: any = false) {
        node.addEventListener(type, handler as EventListener, options);
        return this;
    }
    
    function off(type: string, handler: Function, options: any = false) {
        node.removeEventListener(type, handler as EventListener, options);
        return this;
    }
    
    // export precepts
    this.fire = fire;
    this.on = on;
    this.off = off;
    
    return this;
};

export {
    MixinBus,
};
