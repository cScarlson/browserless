
import { TPropertyChange } from '@browserless/interfaces';
import { LIFECYCLE_EVENTS, publish } from '@browserless/events';
// local
import { routes } from './routes';
import template from './app.component.html';
import './app.component.scss';
import { todos } from './subsystem/todo/collection/todos';

export const app = {
    ['v:settings']: new Map([ ['noautorender', false] ]),
    ['v:template']: template,
    todos,
    routes,
    title: 'Browserless',
    [LIFECYCLE_EVENTS.oninit]() {
        console.log('@app onInit', routes);
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
        console.log('@app onMount', arguments);
    },
    handleClick(e: Event, title: string) {
        console.log('@app #handleClick', e.type, title);
    }
};
