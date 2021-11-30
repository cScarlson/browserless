
import { nodes } from './core';

function cleanElement(node: Element) {
    if ( !(node instanceof Element) ) return nodes;
    if (node.isConnected) return nodes;
    nodes.delete(node);
    return nodes;
}

function cleanAttribute(node: Attr) {
    if ( !(node instanceof Attr) ) return nodes;
    if (node.isConnected) return nodes;
    nodes.delete(node);
    nodes.delete(node.ownerElement);
    return nodes;
}

function cleanText(node: Text) {
    if ( !(node instanceof Text) ) return nodes;
    if (node.isConnected) return nodes;
    nodes.delete(node);
    return nodes;
}

function cleanComment(node: Comment) {
    if ( !(node instanceof Text) ) return nodes;
    if (node.isConnected) return nodes;
    nodes.delete(node);
    return nodes;
}

export {
    cleanElement,
    cleanAttribute,
    cleanText,
    cleanComment,
};
