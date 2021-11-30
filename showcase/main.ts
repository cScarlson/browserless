
import '@browserless/browserless';
import { components, bootstraps, tree } from '@browserless/core';
import { attach, execute } from '@browserless/core';
import { verifyBootstrap } from '@browserless/bootstraps';
import { Route } from '@browserless/route';
// local
import { routes } from './app/routes';
import { app } from './app/app.component';
import { TodoComponent } from './app/subsystem/todo/todo.component';
import { TodosComponent } from './app/subsystem/todo/collection/todos.component';

console.clear();
console.log('tree', tree);
const root = new Route(routes);

components
    .set('app', app)
    .set('todos', TodosComponent)
    .set('todo', TodoComponent)
    ;
bootstraps.delete(verifyBootstrap);
attach(document.body.parentElement, execute);

Route.init({ });
