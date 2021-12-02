
import '@browserless/browserless';
import { components, bootstraps, tree } from '@browserless/core';
import { attach, execute } from '@browserless/core';
import { verifyBootstrap } from '@browserless/bootstraps';
import { Route } from '@browserless/route';
import './main.scss';
// local
import { routes } from './app/routes';
import { app } from './app/app.component';
import { menu } from './app/subsystem/menu/menu.component';
import { TodoComponent } from './app/subsystem/todo/todo.component';
import { forms } from './app/subsystem/playground/subsystem/forms/forms.component';

console.clear();
console.log('tree', tree);

const root = new Route(routes);
components
    .set('app', app)
    .set('menu', menu)
    .set('todo', TodoComponent)
    .set('forms[playground]', forms)
    ;
bootstraps.delete(verifyBootstrap);
attach(document.body.parentElement, execute);

Route.init({ });
