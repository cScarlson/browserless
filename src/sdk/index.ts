
import { LIFECYCLE_EVENTS, subscribe } from '../events';

const slot = { };

const title = {
    ['v:template']: '${title}',
    title: 'Browserless',
    [LIFECYCLE_EVENTS.onmount]() {
        console.log('@title-component', this.title);
        subscribe(LIFECYCLE_EVENTS.onpagetitlechanged, this.handleTitleChanged);
    },
    handleTitleChanged(e: CustomEvent<string>) {
        var { detail: title } = e;
        this.title = title;
        console.log('HANDLING TITLE-CHANGE...', title);
    }
};

export {
    slot,
    title,
};
