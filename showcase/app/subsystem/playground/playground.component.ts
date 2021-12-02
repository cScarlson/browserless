
import { LIFECYCLE_EVENTS } from '@browserless/events';
import template from './playground.component.html';
import './playground.component.scss';

const playground = {
    ['v:template']: template,
    test: 'asdf',
    [LIFECYCLE_EVENTS.onmount]() {
        location.assign(location.hash);  // strange bug. css :target styles don't apply until clicking hashlink 2nd time.
    }
};

export { playground };
