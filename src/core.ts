
import { TSelector, TAnalyze, TBootstrap, TTemplater, TMutator, TNode, IBoot } from './interfaces';
import { Tree } from './tree';

const settings: Map<string, any> = new Map();
const texts: Map<string, any> = new Map();
const comments: Map<string, any> = new Map();
const attributes: Map<TSelector, any> = new Map();
const components: Map<string, any> = new Map();
const middleware: Set<TAnalyze> = new Set();
const bootstraps: Set<TBootstrap> = new Set();
const templaters: Set<TTemplater> = new Set();
const networkbus: EventTarget = new EventTarget();
const decorators: Set<any> = new Set();
const mixins: Set<Function> = new Set();
const mutators: Set<TMutator> = new Set();
const tree = new Tree({ boot: { selector: 'root' } });
const nodes: Map<Node, Tree<TNode>> = new Map([ [document, tree] ]);
const scopes: Map<Node, any> = new Map();

function attach(node: Node, next: TAnalyze): Node {
    if (!node) return node;
    var { nodeType, attributes = [] } = <Element>node;
    var attrs: Attr[] = Array.prototype.slice.call(attributes);
    
    for (let attr of attrs) next(attr);  // @procedure 0: analyze attributes before elements as Element.prototype.matches will also match on attribute selectors. ATTENTION! one-way data-binding depends on order of ops here.
    next(node);  // @procedure 1: (see @procedure 0)
    if (node.nextSibling) attach(node.nextSibling, next);
    if (node.firstChild) attach(node.firstChild, next);
    
    return node;
}

function execute(node: Node) {
    var result = [ ...middleware ].reduce( (node: Node, fn: TAnalyze) => fn(node), node);
    return result;
}

function mount(node: Node, selector?: TSelector, ...more: TSelector[]): Node {
    if (!selector) return node;
    var eligible = matches(node, selector);
    var component = {
        [Node.ELEMENT_NODE]: components,
        [Node.ATTRIBUTE_NODE]: attributes,
        [Node.TEXT_NODE]: texts,
        [Node.COMMENT_NODE]: comments,
    }[ node.nodeType ].get(selector);
    
    if (eligible) bootstrap({ selector, node, component, instance: {}, straps: new Map() });
    if (more.length) return mount(node, ...more);
    return node;
}

function matches(node: Node, selector: string|RegExp) {
    if (selector instanceof RegExp) return matchRegExp(node, selector);
    return ({
        [Node.ELEMENT_NODE]: () => (node as Element).matches(selector),  // matches on attributes as well.
        [Node.ATTRIBUTE_NODE]: () => (node as Attr).name === selector,
        [Node.TEXT_NODE]: () => (node as Text).data === selector,
        [Node.COMMENT_NODE]: () => (node as Comment).data === selector,
    }[ node.nodeType ])();
}

function matchRegExp(node: Node, selector: RegExp) {
    return ({
        [Node.ELEMENT_NODE]: () => selector.test((node as Element).outerHTML),  // matches on attributes as well.
        [Node.ATTRIBUTE_NODE]: () => selector.test((node as Attr).name),
        [Node.TEXT_NODE]: () => selector.test((node as Text).data),
        [Node.COMMENT_NODE]: () => selector.test((node as Comment).data),
    }[ node.nodeType ])();
}

function bootstrap(boot: IBoot<Node>) {
    var result: IBoot<Node> = [ ...bootstraps ].reduce( (boot: IBoot<Node>, fn: TBootstrap) => fn.call(boot, boot), boot);
    return result;
}

function create(component: any, node: Node) {
    var Component = component;
    
    return {
        'object': () => ({ ...component }),  // [effectively] create new instance.
        'function': () => new Component(node)
    }[ typeof component ]();
}

export {
    settings,
    texts,
    comments,
    attributes,
    components,
    middleware,
    bootstraps,
    templaters,
    networkbus,
    decorators,
    mixins,
    mutators,
    tree,
    nodes,
    scopes,
};
export {
    attach,
    execute,
    mount,
    matches,
    matchRegExp,
    bootstrap,
    create,
};
