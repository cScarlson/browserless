
import { LIFECYCLE_EVENTS } from '@browserless/events';
// local
import template from './menu.component.html';
import './menu.component.scss';

export const menu = {
    ['v:template']: template,
    parent: '',
    items: [ ],
    [LIFECYCLE_EVENTS.oninit]() {
        console.log('@menu', this.items);
    }
};
