
import { TEvent } from './interfaces';
import { networkbus } from './core';

class LIFECYCLE_EVENTS {
    static onsandbox: string = 'v:sandbox:created';
    static oninit: string = 'v:created';
    static onmount: string = 'v:mounted';
    static onpropertychanged: string = 'v:property:changed';
    static ondestroy: string = 'v:destroy';
    static onpagetitlechanged: string = 'v:page:title:changed';
}

class EventManager {
    static target: EventTarget = new EventTarget();
    static re: RegExp = /\(([^()]+)\)=/img;
    static noop: HTMLElement = document.createElement('div');
    private receiver: any = { };  // the execution-context of event-binding instructions.
    public types: string[] = EventManager.getTypes(this.template);
    
    constructor(private node: Node, private template: string) {
        this.subscribe(`event:*`, this.handleExecution);
    }
    
    static getTypes(template: string) {
        var { re } = this;
        var matches = (template.match(re) || []).map( match => match.replace(re, '$1') );
        return matches;
    }
    
    static execute(e: Event, operation: string, action: string): Function {
        return (new Function('o', `let $event = this; with (o) if (o.${action}) return o.${operation};`)).bind(e);  // binds event as this and lets keyword $event be this so that object (o) can be passed in as first argument.
    }
    
    connect(receiver: any) {
        var { node, types } = this;
        
        this.receiver = receiver;
        this.disconnect();
        types.forEach( (type) => node.addEventListener(type, this.handleEvent, true) );
        
        return this;
    }
    
    disconnect() {
        var { node, types } = this;
        types.forEach( (type) => node.removeEventListener(type, this.handleEvent, false) );
        return this;
    }
    
    publish(channel: string, data?: any) {
        var e = new CustomEvent(channel, { detail: data });
        this.node.dispatchEvent(e);
        return this;
    }
    
    subscribe(channel: string, handler: EventListenerOrEventListenerObject) {
        this.node.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel: string, handler: EventListenerOrEventListenerObject) {
        this.node.removeEventListener(channel, handler, true);
        return this;
    }
  
    private handleEvent = (e: Event&any) => {
        if ( !e.target.hasAttribute(`(${e.type})`) ) return true;  // if no attr declared on target, abort.
        var { type, target, path } = e;
        var name = `(${type})`;  // construct attribute-name from event-type.
        var { attributes } = target;  // get all attributes (NamedNodeMap)
        var attr = attributes[name];  // retrieve attribute-node (Attr).
        var { value } = attr;  // access value from attribute-node.
        var [ full, action ] = /(.+)\(.*\)/.exec(value) || [ ];
        var schema = { event: e, operation: value, action };
        var details: TEvent = { event: e, type, target, path, name, value, action, schema };  // package details for publish
        
        this.publish(`event:*`, details);
        this.publish(`event:${type}`, details);
    };
    
    public handleExecution = (e: CustomEvent<TEvent>) => {
        var { receiver } = this;
        var { detail } = e;
        var { event, type, target, path, name, value, schema } = detail;
        var { event, operation, action } = schema;
        var execute = EventManager.execute(event, operation, action);
        
        execute(receiver);
    };
    
}

function publish(channel: string, data?: any) {
    var e = new CustomEvent(channel, { detail: data });
    networkbus.dispatchEvent(e);
}

function subscribe(channel: string, handler: Function) {
    networkbus.addEventListener(channel, handler as EventListener, false);
}

function unsubscribe(channel: string, handler: Function) {
    networkbus.removeEventListener(channel, handler as EventListener, false);
}

export { LIFECYCLE_EVENTS, EventManager, publish, subscribe, unsubscribe };
