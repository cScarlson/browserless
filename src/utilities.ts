
import { TNode } from './interfaces';
import { Tree } from './tree';
import { nodes } from './core';

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function replace(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function interpolate(template: string): (o: any) => string {
    return (object: object) => (new Function(`with (this) return \`${template}\`;`) ).call(object);
}

function findParentTreeNode(node: Node): Tree<TNode> {
    if (!node) return undefined;
    var { parentNode } = node;
    var has = nodes.has(parentNode);
    var parent = nodes.get(parentNode);
    
    if (!has) return findParentTreeNode(parentNode);
    return parent;
}

function set(key: string, value: any) {  // added onto component before method-proxy so that it can be used to trigger setter.
    this[key] = value;
}

function escape(string: string): string {
    if (!string) return string;
    if (typeof string !== 'string') return string;
    var textarea = document.createElement('textarea');
    
    textarea.innerHTML = string;
    
    return textarea.innerHTML;
}

export {
    uuid,
    interpolate,
    findParentTreeNode,
    set,
    escape,
};
