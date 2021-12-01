
import { TPropertyChangedDetail, TPropertyChange, IBoot } from './interfaces';
import {
    settings,
    attributes,
    components,
    middleware,
    bootstraps,
    templaters,
    decorators,
    mixins,
    mutators,
    cleaners,
    nodes,
    tree,
} from './core';
import { attach, execute, bootstrap } from './core';
import { MixinBus } from './mixins';
import { NodeDecorator } from './decorators';
import { mountElement, mountAttribute, mountText, mountComment } from './middleware';
import {
    templateRepeatCloseTag,
    templateRepeatSelfClosing,
    templateIfCloseTag,
    templateIfSelfClosing,
} from './templaters';
import {
    mutateHTMLEntities
} from './mutators';
import {
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
} from './bootstraps';
import { cleanElement, cleanAttribute, cleanText, cleanComment } from './cleaners';
import { LIFECYCLE_EVENTS, subscribe } from './events';
import { slot, title } from './sdk';
import { ROUTER_EVENTS, Route } from './route';

const setup = true;

function handlePropertyChanged(e: CustomEvent<TPropertyChangedDetail>) {
    var { detail } = e;
    var { boot, key, value, previous } = detail;
    var { selector, instance, straps } = boot;
    var { ['v:settings']: config, ['v:node']: node } = instance;
    var noautorender = config.get('noautorender');
    var render = straps.get('v:render');
    var details: TPropertyChange = { selector, key: <string>key, value, previous };  // todo: type this structure.
    
    if (noautorender) return;
    render(instance);
    attach(node.firstChild, execute);
    setTimeout( () => {  // push to js event-loop. otherwise, components' trigger of handlePropertyChanged and broadcasting through publish occurs too close together.
        if (LIFECYCLE_EVENTS.onpropertychanged in instance) instance[LIFECYCLE_EVENTS.onpropertychanged](details);
        instance.fire(LIFECYCLE_EVENTS.onpropertychanged, details);
    }, (1000 * 0) );
}

function handleComponentRouted(e: CustomEvent<Route>) {
    var { Sandbox } = Route;
    var { type, detail: route } = e;
    var { component, name } = route;
    var routelet = document.querySelector(`routelet[name="${name}"]`)  // query for routelet dynamically
      , routelet = routelet || document.querySelector('routelet:not([name])')
      , routelet = routelet || document.createElement('routelet')
      ;
    var boot: IBoot<Element> = { selector: `routelet[name="${name}"]`, node: routelet, component, instance: {}, straps: new Map() }
      , boot: IBoot<Element> = <IBoot<Element>>bootstrap(boot)
      ;
    var $ = new Sandbox(route);
    
    if (ROUTER_EVENTS.onactivated in boot.instance) boot.instance[ROUTER_EVENTS.onactivated]($);
    // routelet.innerHTML = component['v:template'];
    // attach(routelet.firstChild, execute);
}

settings
    .set('components', true)
    .set('attributes', true)
    .set('texts', true)
    .set('comments', true)
    ;
nodes
    .set(document, tree)  // initialize for root/parent
    ;
mixins
    .add(MixinBus)
    ;
decorators
    .add(NodeDecorator)
    ;
middleware
    .add(mountElement)
    .add(mountAttribute)
    .add(mountText)
    .add(mountComment)
    ;
templaters
    .add(templateRepeatCloseTag)
    .add(templateRepeatSelfClosing)
    .add(templateIfCloseTag)
    .add(templateIfSelfClosing)
    ;
mutators
    .add(mutateHTMLEntities)
    ;
bootstraps
    .add(bootstrapInstance)
    .add(bootstrapComponentSettings)
    .add(bootstrapSetter)
    .add(bootstrapSandbox)
    .add(bootstrapExistingScope)
    .add(bootstrapElementSlotContent)
    .add(bootstrapElementTreeNode)
    .add(bootstrapAttributeTreeNode)
    .add(bootstrapElementTree)
    .add(bootstrapAttributeOwner)
    .add(bootstrapAttributeValue)
    .add(expressions)
    .add(bootstrapTarget)
    .add(bootstrapProxy)
    .add(bootstrapMethodProxies)
    .add(bootstrapMixins)
    .add(bootstrapSignalInit)
    .add(bootstrapEventManager)
    .add(bootstrapElementRender)
    .add(bootstrapElementSlots)
    .add(bootstrapSignalMount)
    .add(verifyBootstrap)
    ;
components
    .set('slot', slot)  // provide tracking mechanism for native elements.
    .set('title[browserless]', title)
    ;
attributes
    .set(expressions.BINDING_ONEWAY, { })  // one-way-binding.
    .set(expressions.BINDING_TWOWAY, { })  // two-way-binding.
    ;
cleaners
    .set(Node.ELEMENT_NODE, cleanElement)
    .set(Node.ATTRIBUTE_NODE, cleanAttribute)
    .set(Node.TEXT_NODE, cleanText)
    .set(Node.COMMENT_NODE, cleanComment)
    ;
subscribe(LIFECYCLE_EVENTS.onpropertychanged, handlePropertyChanged);
Route.subscribe(ROUTER_EVENTS.onroutebootstrap, handleComponentRouted);

export { setup };
