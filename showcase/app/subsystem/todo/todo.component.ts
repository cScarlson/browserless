
import { LIFECYCLE_EVENTS } from '@browserless/events';
import template from './todo.component.html';
import './todo.component.scss';

const TodoComponent = function TodoComponent(node: HTMLUnknownElement) {
    var thus = this;
    var data = { };
    var index = -1;
    
    function handleMount() {
        // console.log('@TodoComponent #mount', this.data);
    }
    
    // export precepts
    this['v:template'] = template;
    this.data = data;
    this.index = index;
    this[LIFECYCLE_EVENTS.oninit] = handleMount;
    
    return this;
};

export { TodoComponent };
