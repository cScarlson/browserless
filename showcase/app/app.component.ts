
import { TPropertyChange } from '@browserless/interfaces';
import { LIFECYCLE_EVENTS, publish } from '@browserless/events';
import template from './app.component.html';
import './app.component.scss';

var tags = [
    { id: 0, title: "tag-a" },
    { id: 1, title: "tag-b" },
    { id: 2, title: "tag-c" },
];
var todos = [
    { done:  true, title: "Element Components", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Attr Directives (with RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Text Directives (without RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Comment Directives (without RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Automatic Rerender", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Middleware", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Bootstrappers", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible 'Templaters'", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Mixins", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Event-Bindings", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Slots", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Template Loops (*for)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "One-Way Data-Binding", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Two-Way Data-Binding", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "CSS Injection (with CSS Module support)", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "Documentation", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Better <code>*for</code> Templater", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "XSS Protection For <code>html</code>", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Sandbox Lifecycle Event", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Memory Cleanup", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Testing", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "./core.ts#fn() -> ./core/fn.ts", description: "a^2 + b^2 = c^2", tags },
].sort( (a, b) => a.done ? 1 : -1 );

export const app = {
    ['v:settings']: new Map([ ['noautorender', false] ]),
    ['v:template']: template,
    todos,
    title: 'App Component',
    [LIFECYCLE_EVENTS.oninit]() {
        console.log('@app onInit');
        // setTimeout( () => this.title = 'the Browserless Framework', (1000 * 2) );
        // setTimeout( () => this.todos = [ ...this.todos, { title: "More Documentation", description: "a^2 + b^2 = c^2" } ], (1000 * 3) );
        // setTimeout( () => publish(LIFECYCLE_EVENTS.onpagetitlechanged, this.title), (1000 * 3) );
        this.on(LIFECYCLE_EVENTS.onmount, e => this.handleMount(e));
    },
    [LIFECYCLE_EVENTS.onpropertychanged]({ selector, key, value, previous }: TPropertyChange) {
        var handler = `handle:${key}:change`;
        if (handler in this) this[handler](value, previous);
    },
    ['handle:title:change'](value: string, old: string) {
        console.log('TITLE-CHANGED', value, old, this.title);
        // publish(LIFECYCLE_EVENTS.onpagetitlechanged, value);
    },
    handleMount() {
        this.title = 'Todos App...';
        console.log('@app onMount', arguments);
    },
    handleClick(e: Event, title: string) {
        console.log('@app #handleClick', e.type, title);
        this.title = `${title}!`;
    }
};
