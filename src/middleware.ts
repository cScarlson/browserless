
import { settings, components, attributes, texts, comments } from './core';
import { mount } from './core';

function mountElement(node: Node): Node {
    if (!{ [Node.ELEMENT_NODE]: true }[ node.nodeType ]) return node;
    if ( !settings.get('components') ) return node;
    return mount(node, ...components.keys());
}

function mountAttribute(node: Node): Node {
    if (!{ [Node.ATTRIBUTE_NODE]: true }[ node.nodeType ]) return node;
    if ( !settings.get('attributes') ) return node;
    return mount(node, ...attributes.keys());
}

function mountText(node: Node): Node {
    if (!{ [Node.TEXT_NODE]: true }[ node.nodeType ]) return node;
    if ( !settings.get('texts') ) return node;
    return mount(node, ...texts.keys());
}

function mountComment(node: Node): Node {
    if (!{ [Node.COMMENT_NODE]: true }[ node.nodeType ]) return node;
    if ( !settings.get('comments') ) return node;
    return mount(node, ...comments.keys());
}

export {
    mountElement,
    mountAttribute,
    mountText,
    mountComment,
};
