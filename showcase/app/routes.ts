
import { ROUTER_EVENTS, Route } from '@browserless/route';
// local
import { welcome } from './subsystem/welcome/welcome.component';
import { playground } from './subsystem/playground/playground.component';
import { docs } from './subsystem/docs/docs.component';
import { Core } from './subsystem/docs/core/core.component';
import { Title } from './subsystem/docs/sdk/title/title.component';
import { TodosComponent } from './subsystem/todo/collection/todos.component';

const routes = [
    { pathname: '', name: 'HOME', title: "Home", component: welcome, data: {}, children: [] },
    {
        pathname: 'dev/docs', name: 'DEV:DOCUMENTATION', title: "Documentation", component: docs, data: {}, children: [
            { pathname: 'core', name: 'PLAYGROUND:CORE', title: "Core", component: Core, data: {}, children: [ ] },
            {
                pathname: 'sdk', name: 'PLAYGROUND:SDK', title: "SDK", component: { ['v:template']: `<h1>SDK</h1>` }, data: {}, children: [
                    { pathname: 'title', name: 'PLAYGROUND:SDK:TITLE', title: "title[browserless]", component: Title, data: {}, children: [ ] },
                ]
            },
        ]
    },
    { pathname: 'dev/todos', name: 'DEV:TODOS', title: "Todos", component: TodosComponent, data: {}, children: [] },
    { pathname: 'dev/playground', name: 'PLAYGROUND', title: "Playground", component: playground, data: {}, children: [] },
    // {
    //     pathname: 'projects', name: 'PROJECTS', component: Projects, data: {}, children: [
    //         {
    //             pathname: '{id}', name: 'PROJECT', component: Project, data: {}, children: [
    //                 {
    //                     pathname: 'history', name: 'PROJECT:HISTORY', component: ProjectHistory, data: {}, children: [
    //                         { pathname: 'details', name: 'PROJECT:HISTORY:DETAILS', component: ProjectHistoryDetails, data: {}, children: [ ] },
    //                         { pathname: '404', name: 'ERROR:404', component: NotFound, data: {}, children: [ ] },
    //                     ]
    //                 },
    //                 { pathname: '404', name: 'PROJECT:HISTORY:ERROR:404', component: NotFound, data: {}, children: [ ] },
    //             ]
    //         },
    //         { pathname: '404', name: 'PROJECT:ERROR:404', component: NotFound, data: {}, children: [ ] },
    //     ]
    // },
    // {
    //     pathname: 'projects/{pId}/history/details/{id}', name: 'PROJECT:HISTORY:DETAILS:ITEM', component: ProjectHistoryDetailsItem, data: {}, children: [
    //         { pathname: '404', name: 'PROJECT:HISTORY:DETAILS:ITEM:ERROR:404', component: NotFound, data: {}, children: [ ] },
    //     ]
    // },
    // { pathname: '404', name: 'ERROR:404', component: NotFound, data: {}, children: [ ] },
];

export { routes };
