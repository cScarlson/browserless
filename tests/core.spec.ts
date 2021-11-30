
import {
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
} from '@browserless/core';
import {
    attach,
    execute,
    mount,
    matches,
    matchRegExp,
    bootstrap,
    create,
} from '@browserless/core';
import *  as core from '@browserless/core';
import { Tree } from '@browserless/tree';
import { IBoot } from '@browserless/interfaces';
import {
    MOCK_ELEMENT_0,
    MOCK_ELEMENT_1,
    MOCK_ELEMENT_2,
    MOCK_ATTRIBUTE_0,
    MOCK_ATTRIBUTE_1,
    MOCK_ATTRIBUTE_2,
    MOCK_TEXT_0,
    MOCK_COMMENT_0,
    MOCK_ILLEGALNODE_0,
} from './mocks';

const MOCK_ELEMENT_BOOT_0 = { selector: 'mock', node: MOCK_ELEMENT_0, component: {}, instance: {}, straps: new Map() };

describe("registrar storage media", () => {

    describe("settings", () => {
        it("should be a Map", () => {
            expect(settings).toBeInstanceOf(Map);
        });
        it("should NOT be empty", () => {
            expect(settings.size).toBe(1);
            expect( settings.get('sandbox') ).toBe(Object);
        });
    });

    describe("texts", () => {
        it("should be a Map", () => {
            expect(texts).toBeInstanceOf(Map);
        });
        it("should be empty", () => {
            expect(texts.size).toBe(0);
        });
    });

    describe("comments", () => {
        it("should be a Map", () => {
            expect(comments).toBeInstanceOf(Map);
        });
        it("should be empty", () => {
            expect(comments.size).toBe(0);
        });
    });

    describe("attributes", () => {
        it("should be a Map", () => {
            expect(attributes).toBeInstanceOf(Map);
        });
        it("should be empty", () => {
            expect(attributes.size).toBe(0);
        });
    });

    describe("components", () => {
        it("should be a Map", () => {
            expect(components).toBeInstanceOf(Map);
        });
        it("should be empty", () => {
            expect(components.size).toBe(0);
        });
    });

    describe("middleware", () => {
        it("should be a Set", () => {
            expect(middleware).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(middleware.size).toBe(0);
        });
    });

    describe("bootstraps", () => {
        it("should be a Set", () => {
            expect(bootstraps).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(bootstraps.size).toBe(0);
        });
    });

    describe("templaters", () => {
        it("should be a Set", () => {
            expect(templaters).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(templaters.size).toBe(0);
        });
    });

    describe("decorators", () => {
        it("should be a Set", () => {
            expect(decorators).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(decorators.size).toBe(0);
        });
    });

    describe("mixins", () => {
        it("should be a Set", () => {
            expect(mixins).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(mixins.size).toBe(0);
        });
    });

    describe("mutators", () => {
        it("should be a Set", () => {
            expect(mutators).toBeInstanceOf(Set);
        });
        it("should be empty", () => {
            expect(mutators.size).toBe(0);
        });
    });

    describe("networkbus", () => {
        it("should be an EventTarget", () => {
            expect(networkbus).toBeInstanceOf(EventTarget);
        });
    });

    describe("tree", () => {
        it("should be a Tree", () => {
            expect(tree).toBeInstanceOf(Tree);
        });
        it("should have a 'root' selector", () => {
            expect(tree.selector).toBe('root');
        });
    });
    
});


describe("core function", () => {
    
    describe("attach", () => {
        it("takes in a DOM node, a callback, and returns the node.", () => {
            const fn = jest.fn();
            const node = { };
            const res = attach(<Element>node, fn);
            
            expect(res).toBe(node);
        });
        it("invokes the callback and passes in each attribute", () => {
            const fn = jest.fn();
            const node = { attributes: [ MOCK_ATTRIBUTE_0, MOCK_ATTRIBUTE_1, MOCK_ATTRIBUTE_2 ] };
            const res = attach(<any>node, fn);
            
            expect(fn).toHaveBeenCalledTimes(4);  // account for node itself
            expect(fn).toHaveBeenNthCalledWith(1, MOCK_ATTRIBUTE_0);
            expect(fn).toHaveBeenNthCalledWith(2, MOCK_ATTRIBUTE_1);
            expect(fn).toHaveBeenNthCalledWith(3, MOCK_ATTRIBUTE_2);
            expect(fn).toHaveBeenNthCalledWith(4, node);
        });
        it("invokes the callback and passes in the nextSibling of the current node", () => {
            const fn = jest.fn();
            const node = { nextSibling: MOCK_ELEMENT_0 };
            const res = attach(<any>node, fn);
            
            expect(fn).toHaveBeenCalledTimes(2);
            expect(fn).toHaveBeenNthCalledWith(1, node);
            expect(fn).toHaveBeenNthCalledWith(2, MOCK_ELEMENT_0);
        });
        it("invokes the callback and passes in the firstChild of the current node", () => {
            const fn = jest.fn();
            const node = { firstChild: MOCK_ELEMENT_0 };
            const res = attach(<any>node, fn);
            
            expect(fn).toHaveBeenCalledTimes(2);
            expect(fn).toHaveBeenNthCalledWith(1, node);
            expect(fn).toHaveBeenNthCalledWith(2, MOCK_ELEMENT_0);
        });
        it("should invoke the callback with the nextSibling before the firstChild", () => {
            const fn = jest.fn();
            const node = { nextSibling: MOCK_ELEMENT_0, firstChild: MOCK_ELEMENT_1 };
            const res = attach(<any>node, fn);
            
            expect(fn).toHaveBeenCalledTimes(3);
            expect(fn).toHaveBeenNthCalledWith(2, MOCK_ELEMENT_0);
            expect(fn).toHaveBeenNthCalledWith(3, MOCK_ELEMENT_1);
        });
    });
    
    describe("execute", () => {
        it("returns the same DOM-node as its sole argument", () => {
            const node = { };
            const res = execute(<Node>node);
            expect(res).toBe(node);
        });
    });
    
    describe("mount", () => {
        xit("receives a node and 1 or more 'selector' arguments", () => {});
        it("only operates on elements, attributes, comments, and texts", () => {
            expect(() => {
                mount(MOCK_ELEMENT_0, 'mock');
            }).not.toThrowError();
            expect(() => {
                mount(MOCK_ATTRIBUTE_0, 'mock');
            }).not.toThrowError();
            expect(() => {
                mount(MOCK_TEXT_0, 'mock');
            }).not.toThrowError();
            expect(() => {
                mount(MOCK_COMMENT_0, 'mock');
            }).not.toThrowError();
            expect(() => {
                mount(MOCK_ILLEGALNODE_0, 'mock');
            }).toThrowError();
        });
        xit("invokes 'matches' and 'bootstrap'", () => {});
        xit("invokes itself if more than 1 selector", () => {});
        xit("does not invoke itself if only 1 selector provided", () => {});
    });
    
    describe("matches", () => {
        it("takes a node and a selector", () => {
            expect(() => {
                matches(MOCK_ELEMENT_0, 'mock');
            }).not.toThrowError();
        });
        it("can receive a string or a RegExp as its selector", () => {
            expect(() => {
                mount(MOCK_ELEMENT_0, /^$/);
            }).not.toThrowError();
        });
        xit("invokes 'matchRegExp' if selector is a RegExp", () => {});
        it("invokes the node's 'matches' method with selector, if node is an Element", () => {
            const selector = 'mock';
            const spy = jest.spyOn(MOCK_ELEMENT_0, 'matches');
            const res = matches(MOCK_ELEMENT_0, selector);
            
            expect(spy).toHaveBeenCalledWith(selector);
        });
        it("returns a boolean", () => {
            const res = matches(MOCK_ELEMENT_0, 'mock');
            expect(res).toBe(true);
        });
    });
    
    describe("matchRegExp", () => {
        it("tests an Attr's 'name'", () => {
            const exp = /^$/;
            const spy = jest.spyOn(exp, 'test');
            const res = matchRegExp(MOCK_ATTRIBUTE_0, exp);
            
            expect(spy).toHaveBeenCalledWith(MOCK_ATTRIBUTE_0.name);
        });
    });
    
    describe("bootstrap", () => {
        it("receives an IBoot<Node> and returns an IBoot<Node>", () => {
            const boot: IBoot<Element> = MOCK_ELEMENT_BOOT_0;
            const res = bootstrap(boot);
            expect(res).toBe(boot);
        });
    });
    
    describe("create", () => {
        it("receives a component and an IBoot and returns an instance", () => {
            const component = { random: 'text' };
            const res = create(component, MOCK_ELEMENT_0);
            
            expect(res).toMatchObject({ random: 'text' });
            expect(res).not.toBe(component);
        });
        it("handles function-constructor components", () => {
            const res = create(function Component() { this.random = 'text' }, MOCK_ELEMENT_0);
            expect(res).toMatchObject({ random: 'text' });
        });
        it("handles class-constructor components", () => {
            const res = create(class Component { random: string = 'text' }, MOCK_ELEMENT_0);
            expect(res).toMatchObject({ random: 'text' });
        });
    });
    
});
