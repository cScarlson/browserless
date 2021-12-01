
import { LIFECYCLE_EVENTS } from '@browserless/events';
// local
import { routes, root } from '@app/routes';
import template from './menu.component.html';

export const menu = {
    ['v:template']: template,
    items: routes,
    [LIFECYCLE_EVENTS.oninit]() {
        console.log('@menu');
    }
};
