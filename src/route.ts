
interface ILocationDetails {
    url?: string;
    old?: string;
    segment: string;
    id: string;
    route: Route;
    param?: any;
    params?: any;
}

class Params extends URLSearchParams {
    
    constructor(...options: any[]) {
        super(...options);
    }
    
    clear(): Params {
        var keys = Array.from( this.keys() );
        keys.forEach( key => this.delete(key) );
        return this;
    }
    
    toJSON(): any {
        var entries = Array.from( this.entries() );
        var object = entries.reduce( (o, [ k, v ]) => ({ ...o, [k]: v }), { } );
        return object;
    }
    
    valueOf(): any {
        return this.toJSON();
    }
    
    toString(): string {
        return `${this}`;
    }
    
}

class URI extends URL {
    params: Params = new Params();
    
    constructor(url: any) {
        super(url);
        var { hash } = this;
        var [ hash, search ] = hash.split('?');
        var hash = hash.replace('#', '');
        var params = new Params(search);
        
        this.pathname = hash;
        this.hash = '';
        this.search = search;
        this.params = params;
        
        return this;
    }
    
}

class ROUTER_EVENTS {
    static onroutebootstrap: string = 'v:route:bootstrap';
    static onactivated: string = 'v:route:activation';
}

class Route extends Params {  // extend Map for route-snapshot parameters.
    static Sandbox: any = Object;  // default to noop Object.
    static target: EventTarget = new EventTarget();  // use separate medium to browser/window.
    static re: RegExp = /^\{(.+?)\}$/i;
    static $registry: Map<string, Route> = new Map();
    public $children: Map<string, Route> = new Map();
    public component: any = Object;
    public pathname: string = '';
    public redirect: boolean = false;
    public title: string = '';
    public name: string = '';
    public data: any = { };
    public id: string = '';
    public expression: string = '';
    public regexp: RegExp = new RegExp(/^$/);
    public segment: string = '';
    public param: string = '';
    public parent: Route = null;
    public previousSibling: Route = null;
    public nextSibling: Route = null;
    get children() { return Array.from( this.$children.values() ) }
    get firstChild() { return this.children[0] }
    get lastChild() { return this.children[ this.children.length - 1 ] }
    get parameterized() { return Route.re.test(this.pathname) }
    get redirection() { return this.segment === '*' }
    
    constructor(public options: any = {}, parent?: Route) {
        super();
        if (options instanceof Array) return new Route({ name: 'ROOT', pathname: '', title: "Routes", component: Object, children: options }, this);  // if its an Array, create a root with options as its children.
        var options = { ...this, ...options };  // use defaults.
        var { component, pathname, redirect, title, name, data, children = [] } = options;  // ensure defaults.
        var parent = parent || this;  // if not provided, assume root.
        var $namespaces = new Set([ ...parent.id.split('/'), pathname ]);  // spread over Set to ensure no duplicates.
        var namespaces = Array.from($namespaces);  // convert back to Array
        var id = namespaces.join('/');  // create fully-qualified pathname.
        var pathnames = pathname.split('/');  // "/segment".split('/') == [ '', 'segment' ]
        var [ segment, ...more ] = pathnames;  // prepare `more` as one or more nth next grandchildren
        var [ full, param ] = Route.re.exec(segment) || [ ];  // get param in case of parameterized route.
        var expression = id.replace('/', '\/')  // prepare expression with escaped shashes
          , expression = expression.replace(/\{([.])\?*\}/img, '($0)')  // prepare expression with escaped curlybraces and group.
          ;
        var regexp = new RegExp(expression, 'ig');  // create regular expression
        var nextChild = { ...options, pathname: more.join('/') };  // rejoin succeeding pathnamespaces for immediately descending child.
        var descendents = [ nextChild ];  // use for children if !!more.length
        
        if (more.length) return new Route({ ...options, pathname: segment, component: Object, children: descendents }, parent);  // if `more`, use single next segment and children and default component to Object for noop. Do not proceed.
        // if (name === 'ROOT') id = '^';  // ensure ROOT is different from implemented empty "" pathname so that register/merge does not fail.
        this.component = component;
        this.pathname = pathname;
        this.redirect = redirect;
        this.title = title
        this.name = name;
        this.data = data;
        this.id = id;
        this.expression = expression;
        this.regexp = regexp;
        this.segment = segment;
        this.param = param;
        this.parent = parent;
        this.link(...children);  // link all children, siblings, and parent.
        Route.register(this);  // register
        Route.subscribe('hashchange', this.handleHashchange);  // subscribe after children do.
        
        return this;
    }
    
    static init(options: any = {}) {  // caution! procedural code below
        var options = { ...this, ...options };  // use defaults
        var { Sandbox = Object } = options;  // default to noop Object.
        var currentURL = ''+window.location;  // stringify
        
        this.Sandbox = Sandbox;
        
        this.subscribe('hashchange', this.handleRouteRace);  // subscribe to handle unmatched 404s.
        this.subscribe('race:match', this.handleRaceMatch);  // 0: listen for matches.
        window.addEventListener('hashchange', this.handleHashchange, true);  // 1
        if (!window.location.hash) window.location.assign('#/');  // 2: assign if not a value.
        else setTimeout( () =>  window.dispatchEvent( new HashChangeEvent('hashchange', { newURL: currentURL, oldURL: currentURL }) ), (1000 * 0) );  // 3: dispatch for initial handler triggers.
    }
    
    static register(route: Route) {
        var { $registry } = this;
        var { id, name, segment } = route;
        
        if ( $registry.has(id) ) return this.merge( $registry.get(id), route );
        $registry.set(id, route);
        
        return route;
    }
    
    static merge(existing: Route, unregistered: Route): any|Route {  // prefer latest declaration
        var { children: more = unregistered.children } = unregistered;
        
        existing.link(...more);
        unregistered.parent.$children.delete(unregistered.id);
        
        return existing;
    }
    
    static reduce(details: any&{ params?: any }, detail: ILocationDetails) {
        var { params = {} } = details;
        var { segment, params: search, param } = detail;
        var search = search.toJSON();
        var params = { ...search, ...params, [param]: segment };  // set all params. overwrite with current.
        var details = { ...details, params };
        
        delete params['undefined'];  // ensure `param` as undefined does not persist.
        
        return details;
    }
    
    static bootstrap(route: Route, snapshot: any) {
        if (route.component === Object) return;  // early-return for any unimplemented routes (such as root).
        route.clear();  // clear old params if remaining
        for (let key in snapshot.params) route.set(key, snapshot.params[key]);  // set new params from current route snapshot.
        this.publish(ROUTER_EVENTS.onroutebootstrap, route);
    }
    
    static unbootstrap(route: Route) {  // not fully implemented
        var instance = null;
        route.clear();
        return instance;
    }
    
    static publish(channel: string, data?: any) {
        var e = new CustomEvent(channel, { detail: data });
        this.target.dispatchEvent(e);
        return this;
    }
    
    static subscribe(channel: string, handler: EventListener) {
        this.target.addEventListener(channel, handler, false);
        return this;
    }
    
    static unsubscribe(channel: string, handler: EventListener) {
        this.target.removeEventListener(channel, handler, false);
        return this;
    }
    
    static nagivate(pathname: string) {  // overwrites the current location pathname with pathname
        
    }
    
    static visit(segment: string) {  // pushes segment to current pathname to invoke child-route
        
    }
    
    static go(location: Location) {  // ?
        
    }
    
    static handleHashchange = (e: HashChangeEvent) => {
        var { newURL: url, oldURL: old } = e, re = /[#?]/img;
        var [ origin, url ] = url.split(re);
        var [ same, old ] = old.split(re);
        var location = new URI(e.newURL);  // todo: leverage URI such as with the element <a> below
        
        Route.publish('hashchange', { location, url, old, e });  // dispatch on local, static medium.
    };
    
    static handleRaceMatch = (e: CustomEvent<ILocationDetails[]>) => {  // handles Race Condition for matches
        var { detail: details } = e;  // get match-details from qualified path nodes.
        var snapshot = details.reduce(Route.reduce, { });  // get single, new snapshot.
        var instances = details.map( details => Route.bootstrap(details.route, snapshot) );  // map to instances.
        
        // todo: unbootstrap current instance.
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    };
    
    static handleRouteRace = (e: CustomEvent) => {  // catches 404 as race-winner and searches for next-closes 404-path match
        var { detail } = e;
        var { url, old } = detail;
        var segments = url.split('/');  // get segments
        var last = segments[ segments.length - 1 ];  // get last to inspect if "404".
        var args = (last !== '404') ? [ -1, 1, '404' ] : [ -2, 2, '404' ];  // arguments for Array.prototype.splice
        var trimmed = segments.splice(...args);  // splice depending on if/where 404 is.
        var next = segments.join('/');  // rejoin segments after splice.
        
        // todo: check for wildcard routes ("/*", "/e/t/c/*").
        window.location.assign(`#${next}`);  // set/walk "404" up the url/pathnamespace segments.
    };

    private link(first?: Route, next?: Route, ...more: Route[]) {  // links all siblings and parent.
        if (!first) return first;
        var previous = new Route(first, this);
        var node = next ? new Route(next, this) : null;
        
        previous.nextSibling = node;  // set first.next, even if null.
        this.$children.set(previous.segment, previous);  // set first to maintain ordinality.
        if (node) this.$children.set(node.segment, node);  // set next to maintain ordinality.
        if (node) node.previousSibling = previous;  // previous must exist at this point.
        if (node && more.length) node.nextSibling = this.link(...more);  // set next before setting next.next.previous.
        if (node && node.nextSibling) node.nextSibling.previousSibling = node;  // set next.next.previous.
        
        return previous;  // ensure first is not skipped.
    }
    
    private matches(details: { url: string, old: string }): ILocationDetails[] {  // get qualifications
        var { url, old } = details;
        var pathnames = url.split('/').reverse();  // reverse for this.qualify
        var qualifications = this.qualify(...pathnames).reverse();  // rereverse to reset/reorder.
        
        return qualifications;
    }
    
    private qualify(segment?: string, ...more: string[]): ILocationDetails[] {  // segment must exist even if falsey ("").
        var { id, param, parent } = this;
        var match: ILocationDetails = { segment, id, param, route: this };  // create details.
        var matching = this.test(segment);  // determine if matches segment.
        
        if (!matching) return [ ];  // never return matches if any part doesn't match. especially first.
        if (parent === this) return [ match ];  // must match. has no more real parents.
        return [ match, ...parent.qualify(...more) ];  // must match. has more real parents.
    }
    
    private test(segment: string): boolean {  // determine if matches.
        var { id, regexp, parameterized, redirection } = this;
        var matching = false;
        
        // if (id === url) return true;  // global exact match.
        // if ( regexp.test(url) ) return true;  // global match with abstractions.
        if (segment === this.segment) matching = true;  // exact match
        else matching = parameterized;
        
        return matching;  // todo: handle redirects.
    }
    
    private nagivate(pathname: string) {  // overwrites the current location pathname with pathname
        
    }
    
    private visit(segment: string) {  // pushes segment to current pathname to invoke child-route
        
    }
    
    private go(location: Location) {  // ?
        
    }
    
    private handleHashchange = (e: CustomEvent) => {
        var { detail } = e;
        var { location, url, old } = detail;
        var { params } = location;
        var segments = url.split('/');  // gets segments from hashroute
        var details = this.matches(detail).map(map);  // maps each qualification to an ILocationDetails containing a route object
        var matches = (segments.length === details.length);  // assume multiple qualified & semiqualified matches can occur.
        
        function map(detail: ILocationDetails) {
            return { ...detail, location, params, url, old };
        }
        
        if (!matches) return;  // abort if not a match.
        Route.publish('race:match', details);  // publish details for match on static Route handler.
        e.preventDefault();
        e.stopPropagation();  // prevents other routes from receiving event
        e.stopImmediatePropagation();
    };
    
}

export { ROUTER_EVENTS, Route, Params };
