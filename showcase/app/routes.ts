
import { ROUTER_EVENTS, Route } from '@browserless/route';
import { app } from './app.component';
import { welcome } from './subsystem/welcome/welcome.component';
import { playground } from './subsystem/playground/playground.component';

const routes = [
    {
        pathname: '', name: 'HOME', title: "Home", component: welcome, data: {}, children: [
            {
                pathname: 'dev/playground', name: 'PLAYGROUND', title: "Playground", component: playground, data: {}, children: [
                    { pathname: 'test', name: 'PLAYGROUND:TEST', title: "PG Test", component: { ['v:template']: `<h1>PG-TEST</h1>` }, data: {}, children: [ ] },
                    // { pathname: '404', name: 'USER:SETTINGS:ERROR:404', component: NotFound, data: {}, children: [ ] },  // caught because pathname has to be #/user/[undefined]
                ]
            },
            // { pathname: '404', name: 'USER:ERROR:404', component: NotFound, data: {}, children: [ ] },  // [not] caught [here] because pathname has to be #/user/[undefined] and "USER:SETTINGS:ERROR:404" catches it
        ]
    },
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
const root = new Route(routes);

export { routes, root };
