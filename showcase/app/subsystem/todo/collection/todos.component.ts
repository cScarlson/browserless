
import { LIFECYCLE_EVENTS } from '@browserless/events';
import template from './todos.component.html';

const todo = { done:  true, title: "Element Components", description: "a^2 + b^2 = c^2", tags: [] };

class TodosComponent {
    public ['v:template']: string = template;
    public data: any[] = [ ];
    
    constructor($: any) {
        this[LIFECYCLE_EVENTS.oninit] = this.handleInit;
        this[LIFECYCLE_EVENTS.onmount] = this.handleMount;
        return this;
    }
    
    handleInit() {
        // console.log('TodosComponent.init', this.data);
    }
    
    handleMount() {
        // console.log('TodosComponent.mount', this.data);
    }
    
}

// const TodosComponent = {
//     ['v:template']: template,
//     todo,
//     data: [ ],
// };

export { TodosComponent };
