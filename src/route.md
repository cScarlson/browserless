
Route
====


## Design
Leverages a Race Condition on the routing system ("router"). That is, each next sibling in the route declaration -- and each deeper-nested child -- subscribes to the "hashchange" event of the router (not to be confused with that of the browser) before the previous sibling or its parent. That way, the deepest child in the tree will have its EventListener invoked first, giving it 'first dibs' to call `stopPropagation` on the event (and therefore denying any other nodes the opportunity to match).

This is by design. Alongside, the router implements its own [static] handler in case no matches occur (and therefore call `stopPropagation`). This allows the router to assume and catch any `404` / Not Found cases. When it does, it simply changes the last namespace in the hash's pathname and sets the Window's `location.hash` value. If the cycle recurs, it varifies if its already located at a 404 route and, if so, walks back the 404 namespace further and further up in the current route's namespacing. This allows the implementer to provide 404-handlers for discrete levels of nesting withing the routing tree.

## What Happens Before `hashchange`
First, one must declare routes...

```typescript
const root = new Route([
    {
        pathname: '', name: 'HOME', component: Dashboard, data: {}, children: [
            {
                pathname: 'user', name: 'USER', component: User, data: {}, children: [
                    { pathname: 'settings', name: 'USER:SETTINGS', component: UserSettings, data: {}, children: [ ] },
                    { pathname: '404', name: 'USER:SETTINGS:ERROR:404', component: NotFound, data: {}, children: [ ] },  // caught because pathname has to be #/user/[undefined]
                ]
            },
            { pathname: '404', name: 'USER:ERROR:404', component: NotFound, data: {}, children: [ ] },  // [not] caught [here] because pathname has to be #/user/[undefined] and "USER:SETTINGS:ERROR:404" catches it
        ]
    },
    {
        pathname: 'projects', name: 'PROJECTS', component: Projects, data: {}, children: [
            {
                pathname: '{id}', name: 'PROJECT', component: Project, data: {}, children: [
                    {
                        pathname: 'history', name: 'PROJECT:HISTORY', component: ProjectHistory, data: {}, children: [
                            { pathname: 'details', name: 'PROJECT:HISTORY:DETAILS', component: ProjectHistoryDetails, data: {}, children: [ ] },
                            { pathname: '404', name: 'ERROR:404', component: NotFound, data: {}, children: [ ] },
                        ]
                    },
                    { pathname: '404', name: 'PROJECT:HISTORY:ERROR:404', component: NotFound, data: {}, children: [ ] },
                ]
            },
            { pathname: '404', name: 'PROJECT:ERROR:404', component: NotFound, data: {}, children: [ ] },
        ]
    },
    { pathname: 'projects/{pId}/history/details/{id}', name: 'PROJECT:HISTORY:DETAILS:ITEM', component: ProjectHistoryDetailsItem, data: {}, children: [ ] },
    { pathname: '404', name: 'ERROR:404', component: NotFound, data: {}, children: [ ] },
]);
```
...notice that we can declare routes using both pathnames with _multiple namespaces_ -- OR -- _nesting_. Moreover, `pathnames` can include parameterized abstractions for the namespace(s). In addition, declaring a `404` pathname in accordance with any level of namespacing (nested or not) will catch any _404_s at that level. More on 404s in the next section.

Another thing to note: `Route.init({ ... });` must be called before any `hashchange` event is dispatched in order for the route's `component` to be charged with handling it. Upon calling `Route.init({ ... });`, the router [statically] sets an EventListener for _its own `hashchange` event_ and then [its own] `match:race` event, the _browser's `hashchange` event_, and conditionally sets the hashURL to the root route (`/`) or dispatches an initial event for whatever hashURL is currently set (to trigger the current handler).

Additionally, one can pass in a `Sandbox` as a wrapper (using _The Decorator Pattern_) to encapsulate the `Route` object instance. See the next section for `Route` instances.

## What Happens On `hashchange`
Once the `hashchange` even is fired, Route [statically] handles the event and dispatches that of its own on its own `EventTarget` instance. Because every Route instance subscribes to the static Route's `hashchange` event, each can handle the event and invoke `stopPropagation` on the event, preventing any other instances from hearing it. Because the nextmost sibling of every route declaration subscribes to the event after the previous, the first declaration has precedential ability to silence the event to the next declaration. Because each next deepest child subscribes to the event before its parent, the most deep (grand)child will have precedential ability to match the route and therefore win the Race Condition for the event.


