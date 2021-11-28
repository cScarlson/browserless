
import '@browserless/browserless';
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
import { mountElement, mountAttribute, mountText, mountComment } from '@browserless/middleware';
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
} from '@browserless/bootstraps';
import {
    templateRepeatCloseTag,
    templateRepeatSelfClosing
} from '@browserless/templaters';
import {  } from '@browserless/events';
import { NodeDecorator } from '@browserless/decorators';
import { MixinBus } from '@browserless/mixins';
import { mutateHTMLEntities } from '@browserless/mutators';
import {
    MOCK_ATTRIBUTE_0,
    MOCK_COMMENT_0,
    MOCK_ELEMENT_0,
    MOCK_TEXT_0,
} from './mocks';

describe("importing browserless.ts to load core precepts", () => {
    
    
    describe("settings", () => {
        
        it("has components, attributes, texts, comments, and sandbox", () => {
            expect( settings.has('components') ).toBe(true);
            expect( settings.has('attributes') ).toBe(true);
            expect( settings.has('texts') ).toBe(true);
            expect( settings.has('comments') ).toBe(true);
            expect( settings.has('sandbox') ).toBe(true);
        });
        
    });

    describe("texts", () => {
        
        xit("xxxxxxxx", () => {
            
        });
        
    });

    describe("comments", () => {
        
        xit("xxxxxxxx", () => {
            
        });
        
    });

    describe("attributes", () => {
        
        xit("xxxxxxxx", () => {
            
        });
        
    });

    describe("components", () => {
        
        it("has 'slot' element", () => {
            expect( components.has('slot') ).toBe(true);
        });
        
        it("has 'title[browserless]' element", () => {
            expect( components.has('title[browserless]') ).toBe(true);
        });
        
    });

    describe("middleware", () => {
        
        it("has mountElement which returns an Element Node", () => {
            expect( middleware.has(mountElement) ).toBe(true);
            expect( mountElement(MOCK_ELEMENT_0) ).toBeInstanceOf(Element);
        });
        
        it("has mountAttribute which returns an Attr Node", () => {
            expect( middleware.has(mountAttribute) ).toBe(true);
            expect( mountAttribute(MOCK_ATTRIBUTE_0) ).toBeInstanceOf(Attr);
        });
        
        it("has mountText which returns an Text Node", () => {
            expect( middleware.has(mountText) ).toBe(true);
            expect( mountText(MOCK_TEXT_0) ).toBeInstanceOf(Text);
        });
        
        it("has mountComment which returns an Comment Node", () => {
            expect( middleware.has(mountComment) ).toBe(true);
            expect( mountComment(MOCK_COMMENT_0) ).toBeInstanceOf(Comment);
        });
        
    });

    describe("bootstraps", () => {
        
        xit("xxxxxxxx", () => {
            
        });
        
    });

    describe("templaters", () => {
        
        it("has templateRepeatCloseTag templater", () => {
            expect( templaters.has(templateRepeatCloseTag) ).toBe(true);
        });
        
        it("has templateRepeatSelfClosing templater", () => {
            expect( templaters.has(templateRepeatSelfClosing) ).toBe(true);
        });
        
    });

    describe("decorators", () => {
        
        it("to have NodeDecorator", () => {
            expect( decorators.has(NodeDecorator) ).toBe(true);
        });
        
    });

    describe("mixins", () => {
        
        it("to have MixinBus", () => {
            expect( mixins.has(MixinBus) ).toBe(true);
        });
        
    });

    describe("mutators", () => {
        
        it("has mutateHTMLEntities", () => {
            expect( mutators.has(mutateHTMLEntities) ).toBe(true);
        });
        
    });

    describe("xxxxxxxx", () => {
        
        xit("xxxxxxxx", () => {
            
        });
        
    });
   

});
