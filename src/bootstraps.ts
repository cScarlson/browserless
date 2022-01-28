
import { IBoot, TMutator, TTemplater } from './interfaces';
import {
    settings, 
    templaters,
    decorators,
    mixins,
    mutators,
    tree,
    nodes,
    scopes,
} from './core';
import { create, attach, execute } from './core';
import { set, findParentTreeNode, interpolate } from './utilities';
import { Tree } from './tree';
import { ComponentProxyHandler, MethodProxyHandler } from './decorators';
import { LIFECYCLE_EVENTS, EventManager, publish } from './events';

function bootstrapInstance(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var instance = create(component, node);
    var boot = { ...boot, instance };
    
    return boot;
}

function bootstrapComponentSettings(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var { ['v:settings']: config = new Map() } = instance;
    
    instance['v:settings'] = config;
    
    return boot;
}

function bootstrapSetter(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    instance['v:set'] = set;
    return boot;
}

function bootstrapSandbox(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var Sandbox = settings.get('sandbox');
    var $ = new Sandbox(node);
    var has = (LIFECYCLE_EVENTS.onsandbox in instance);
    
    if (has) instance[LIFECYCLE_EVENTS.onsandbox]($);
    
    return boot;
}

function bootstrapExistingScope(boot: IBoot<Node>): IBoot<Node> {
    if ( !scopes.has(boot.node) ) return boot;
    var { selector, node, component, instance, straps } = boot;
    var instance = { ...instance, ...scopes.get(node) };
    var boot = { ...boot, instance };
    
    return boot;
}

function bootstrapElementSlotContent(boot: IBoot<Element>): IBoot<Element> {
    if (!{ [Node.ELEMENT_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { innerHTML } = node;
    var container: HTMLElement = document.createElement('div');
    var $children: Map<string, Node[]> = new Map();
    
    function reduce($: Map<string, Node[]>, node: Node): Map<string, Node[]> {
        var { nodeType, slot = '' } = <any>node;
        var has = $.has(slot);
        
        if (!has) $.set(slot, [ ]);
        $.get(slot).push(node);
        
        return $;
    }
    
    container.innerHTML = innerHTML;
    instance['v:slot:content'] = Array.from(container.childNodes).reduce(reduce, $children);  // use childNodes to also include type Node.TEXT_NODE.
    
    return boot;
}

function bootstrapElementTreeNode(boot: IBoot<Element>): IBoot<Element> {
    if (!{ [Node.ELEMENT_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { parentNode } = node;
    var parent = findParentTreeNode(parentNode);
    var has = !!parent;
    var leaf = new Tree({ boot, parent });
    
    nodes.set(node, leaf);
    if (has) parent.$children.set(selector, leaf);
    else tree.$children.set(selector, leaf);
    
    return boot;
}

function bootstrapAttributeTreeNode(boot: IBoot<Attr>): IBoot<Attr> {
    if (!{ [Node.ATTRIBUTE_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { name, ownerElement } = node;
    var { tagName, parentElement } = ownerElement;
    var parent = findParentTreeNode(parentElement);
    var hasParent = !!parent;
    var owner = nodes.get(ownerElement);
    var hasOwner = nodes.has(ownerElement);
    var options = { selector: `${ tagName.toLowerCase() }`, node: ownerElement, component: null, instance: null, parent };
    var owner = owner || new Tree({ boot: options, parent });
    var leaf = new Tree<Attr>({ boot, parent: owner });
    
    nodes.set(node, leaf);
    owner.set(name, leaf);
    if (!hasOwner) nodes.set(ownerElement, owner);
    if (hasParent) parent.$children.set(options.selector, owner);
    else tree.$children.set(options.selector, owner);
    
    return boot;
}

function bootstrapElementTree(boot: IBoot<Element>): IBoot<Element> {
    if (!{ [Node.ELEMENT_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var tree = nodes.get(node);
    
    instance['v:tree'] = tree;  // creates cyclical reference
    
    return boot;
}

function bootstrapAttributeOwner(boot: IBoot<Attr>): IBoot<Attr> {
    if (!{ [Node.ATTRIBUTE_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { ownerElement } = <Attr>node;
    var tree = nodes.get(ownerElement);
    
    instance['v:element'] = ownerElement;
    instance['v:owner'] = tree.boot.instance;
    instance['v:tree'] = tree;  // creates cyclical reference
    
    return boot;
}

function bootstrapAttributeValue(boot: IBoot<Attr>): IBoot<Attr> {
    if (!{ [Node.ATTRIBUTE_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { value } = <Attr>node;
    
    instance['v:value'] = value;
    
    return boot;
}

var expressions: any = {
    BINDING_ONEWAY: /\[(.+)\]/,
    BINDING_TWOWAY: /\[\((.+)\)\]/,
},  expressions = {  // redeclared
    ...expressions,
    handlers: new Set(),
    
    call(boot: IBoot<Node>): IBoot<Node> {
        if ( !(boot.selector instanceof RegExp) ) return boot;
        var { selector, node, component, instance, straps } = boot;
        var key = `${selector}`;
        var has = (key in this);
        
        if (has) return this[key](boot);
        return boot;
    },
    
    [`${expressions.BINDING_ONEWAY}`](boot: IBoot<Attr>): IBoot<Attr> {
        if (!{ [Node.ATTRIBUTE_NODE]: true }[ boot.node.nodeType ]) return boot;
        if ( !(boot.selector instanceof RegExp) ) return boot;
        if ( !boot.selector.test(boot.node.name) ) return boot;
        var { selector, node, component, instance, straps } = boot;
        var { ownerElement } = node;
        var { ['v:tree']: tree } = instance;
        var { parent } = tree;
        var { component: source } = parent;  // get parent component as source.
        var { ['v:proxy']: source } = source;  // overwrite source as vproxy.
        var { name, value } = node;
        var [ name, key = '' ] = boot.selector.exec(name) || [ ];
        
        (new Function('exe', `with (this) exe(${value})`)).call(source, exe);
        
        function exe(value: any) {
            ownerElement[key] = value;  // set on ownerElement so that registered-elements' proxy-handler getter can return it (see rendering bootstrap and attach).
        }
        
        return boot;
    },
    
    [`${expressions.BINDING_TWOWAY}`](boot: IBoot<Attr>): IBoot<Attr> {
        if (!{ [Node.ATTRIBUTE_NODE]: true }[ boot.node.nodeType ]) return boot;
        if ( !(boot.selector instanceof RegExp) ) return boot;
        if ( !boot.selector.test(boot.node.name) ) return boot;
        var { selector, node, component, instance, straps } = boot;
        var { ownerElement } = node;
        var { ['v:tree']: tree } = instance;
        var { parent } = tree;
        var { component: source } = parent;
        var { ['v:settings']: config } = source;
        var { name, value: property } = node;
        var [ name, key = '' ] = boot.selector.exec(name) || [ ];
        var noautorender = config.get('noautorender');
        
        if (!source) return boot;
        (new Function('exe', `with (this) exe(${property})`)).call(source, exe);
        
        function exe(value: any) {
            ownerElement[key] = value;
            ownerElement.setAttribute(key, value);  // set on ownerElement so that registered-elements' proxy-handler getter can return it (see rendering bootstrap and attach). use setAttribute so that a selector can be used to refocus the input.
            ownerElement.addEventListener('input', handleChange as EventListener, false);
        }
        
        function handleChange(e: InputEvent) {
            var { target } = e;
            var { [key]: data } = <any>target;
            
            if (noautorender) return;
            source['v:set'](property, data);  // trigger rerender.
            expressions['handle:ELEMENT:type']({ target, source, key });  // readapt after rerender.
        }
        
        return boot;
    },
    
    ['handle:ELEMENT:type']({ target, source, key }) {
        var { [key]: data, type, tagName } = <any>target;
        var { selectionStart: start, selectionEnd: end, style } = <any>target;
        var { width, height } = style;
        var selector = `[${key}="${data}"]`;
        var handler = `handle:${tagName}:${type}`;
        var element = source['v:node'].querySelector(selector);
        var selection = { start, end };
        var options = { selection, width, height };
        
        element.focus();
        if (handler in expressions) expressions[handler](element, options);
    },
    
    [`handle:INPUT:text`](node: HTMLInputElement, options: any) {
        var { selection } = options;
        var { start, end } = selection;
        
        node.selectionStart = start;
        node.selectionEnd = end;
    },
    
    [`handle:TEXTAREA:textarea`](node: HTMLTextAreaElement, options: any) {
        var { selection, width, height } = options;
        var { start, end } = selection;
        
        node.selectionStart = start;
        node.selectionEnd = end;
        node.style.width = width;
        node.style.height = height;
    },
    
    [`handle:INPUT:date`](node: HTMLInputElement, position: number) {},
    
    [`handle:INPUT:checkbox`](node: HTMLInputElement, position: number) {},
    
    [`handle:INPUT:radio`](node: HTMLInputElement, position: number) {},
    
    [`handle:SELECT:select-one`](node: HTMLInputElement, position: number) {},
    
    [`handle:SELECT:select-multiple`](node: HTMLInputElement, position: number) {},
    
};

function bootstrapTarget(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var collection = [ ...decorators ];
    var decorated: any = collection.reduce( (d, Decorator) => new Decorator(d), decorated );
    
    instance['v:node'] = node;
    instance['v:host'] = decorated;
    
    return boot;
}

function bootstrapProxy(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var handler = new ComponentProxyHandler(boot, node);
    var proxy = new Proxy(instance, handler);
    
    instance['v:proxy'] = proxy;
    
    return boot;
}

function bootstrapMethodProxies(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var { ['v:proxy']: proxy } = instance;
    var entries = <[ string, any ]>Object.entries(instance).filter( ([k, v]) => v instanceof Function );
    
    for (let [ name, method ] of entries) instance[name] = new Proxy( method, new MethodProxyHandler(proxy) );
    
    return boot;
}

function bootstrapMixins(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var collection = [ ...mixins ];
    var mixed = collection.reduce( (instance, Mixin) => Mixin.call(instance), instance );
    var boot = { ...boot, instance: mixed };  // recommendation: mixin === instance.
    
    return boot;
}

function bootstrapSignalInit(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    
    if (LIFECYCLE_EVENTS.oninit in instance) instance[LIFECYCLE_EVENTS.oninit]({ });
    instance.fire(LIFECYCLE_EVENTS.oninit, { });  // function and class (not object-literal) components could still listen for this through the node, itself.
    
    return boot;
}

function bootstrapEventManager(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    var { ['v:template']: template = '' } = instance;
    var events = new EventManager(node, template);
    
    instance['v:events'] = events;
    events.connect(instance);
    
    return boot;
}

function bootstrapElementRender(boot: IBoot<Element>): IBoot<Element> {
    if (!{ [Node.ELEMENT_NODE]: true }[ boot.node.nodeType ]) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { ['v:settings']: config, ['v:template']: original = '', ['v:events']: events } = instance;
    var noautorender = config.get('noautorender');
    var _templaters = [ ...templaters ];
    var _mutators = [ ...mutators ];
    
    straps.set('v:hydrate', hydrate);
    straps.set('v:render', render);
    if (!noautorender) render();
    
    function hydrate(data: any) {
        var data = _mutators.reduce( (data: any, fn: TMutator) => fn(data), data );
        var template = _templaters.reduce( (t: string, fn: TTemplater) => fn(t, data), original );
        return interpolate(template)(data);
    }
    
    function render() {
        var { ['v:proxy']: proxy } = instance;
        
        events.disconnect();
        node.innerHTML = hydrate({ ...instance, ...proxy });
        attach(node.firstChild, execute);
    }
    
    return boot;
}

function bootstrapElementSlots(boot: IBoot<Element>): IBoot<Element> {
    if (!{ [Node.ELEMENT_NODE]: true }[ boot.node.nodeType ]) return boot;
    if ( !(boot.node instanceof HTMLSlotElement) ) return boot;
    var { selector, node, component, instance, straps } = boot;
    var { name = '' } = <HTMLSlotElement>node;
    var { ['v:tree']: tree } = instance;
    var { parent } = tree;
    var { component: data } = parent;
    var { ['v:slot:content']: $projections } = data;
    var has = $projections.has(name);
    var projections: Element[] = $projections.get(name);
    var slot: HTMLSlotElement = <HTMLSlotElement>node;
    
    if (!has) return boot;
    for (let element of projections) slot.appendChild(element);
    
    return boot;
}

function bootstrapSignalMount(boot: IBoot<Node>): IBoot<Node> {
    var { selector, node, component, instance, straps } = boot;
    
    if (LIFECYCLE_EVENTS.onmount in instance) instance[LIFECYCLE_EVENTS.onmount]({ });  // call method if exists.
    instance.fire(LIFECYCLE_EVENTS.onmount, { });  // dispatch on host node.
    
    return boot;
}

function verifyBootstrap(boot: IBoot<Node>): IBoot<Node> {
    console.log('%c Bootstrap verification complete!', 'color: green');
    if (false) console.log('%c Bootstrap verification completed with errors', 'color: red');
    if (boot.instance === Object) console.warn('WFT?...', boot);
    return boot;
}

export {
    bootstrapInstance,
    bootstrapComponentSettings,
    bootstrapSetter,
    bootstrapSandbox,
    bootstrapExistingScope,
    bootstrapElementSlotContent,
    bootstrapElementTreeNode,
    bootstrapAttributeTreeNode,
    bootstrapElementTree,
    bootstrapAttributeOwner,
    bootstrapAttributeValue,
    expressions,
    bootstrapTarget,
    bootstrapProxy,
    bootstrapMethodProxies,
    bootstrapMixins,
    bootstrapSignalInit,
    bootstrapEventManager,
    bootstrapElementRender,
    bootstrapElementSlots,
    bootstrapSignalMount,
    verifyBootstrap,
};
