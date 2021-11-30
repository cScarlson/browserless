
import { ROUTER_EVENTS, Route } from '@browserless/route';
import { app } from './app.component';

class DefaultHandler {
    static outlet: string = 'routelet[name="app"]';
    
    constructor(x) {
        console.log(`@DefaultHandler`, x);
    }
    
    [ROUTER_EVENTS.onactivated](route: Route) {
        console.log(ROUTER_EVENTS.onactivated, route);
    }
    
}

class NotFound {
    
    constructor(route: Route) {
        console.log('NotFound');
    }
    
}

var todos = [
    { done:  true, title: "Element Components", description: "a^2 + b^2 = c^2", tags: [] },
];
class Dashboard {
    ['v:template'] = '<h1>Yeay!</h1><todos [data]="todos"></todos>';
    todos: any[] = todos;
    constructor(x) {
        console.log('Dashboard', x);
    }
    
}
class User {
    
    constructor(route: Route) {
        console.log('User');
    }
    
}
class UserSettings {
    
    constructor(route: Route) {
        console.log('UserSettings');
    }
    
}
class Projects {
    
    constructor(route: Route) {
        console.log('Projects');
    }
    
}
class Project {
    
    constructor(route: Route) {
        console.log('Project');
        console.log('...', route.get('id'));
    }
    
}
class ProjectHistory {
    
    constructor(route: Route) {
        console.log('ProjectHistory');
    }
    
}
class ProjectHistoryDetails {
    
    constructor(route: Route) {
        console.log('ProjectHistoryDetails');
    }
    
}
class ProjectHistoryDetailsItem {
    
    constructor(route: Route) {
        console.log('ProjectHistoryDetailsItem');
        console.log('...', route.get('pId'), route.get('id'));
    }
    
}

const routes = [
    {
        pathname: '', name: 'HOME', component: app, data: {}, children: [
            // {
            //     pathname: 'user', name: 'USER', component: User, data: {}, children: [
            //         { pathname: 'settings', name: 'USER:SETTINGS', component: UserSettings, data: {}, children: [ ] },
            //         { pathname: '404', name: 'USER:SETTINGS:ERROR:404', component: NotFound, data: {}, children: [ ] },  // caught because pathname has to be #/user/[undefined]
            //     ]
            // },
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

export { routes };
