
import { LIFECYCLE_EVENTS } from '@browserless/events';
// local
import { todos } from './todos';
import template from './todos.component.html';

const TodosComponent = new (class TodosComponent {
    public ['v:template']: string = template;
    public data: any[] = todos;
    
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
    
})({})

export { TodosComponent };
