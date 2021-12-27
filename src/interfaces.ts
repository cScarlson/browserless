
type TAnalyze = (node: Node) => any;
type TBootstrap = (boot: IBoot<TNode>) => IBoot<TNode> | { call: TBootstrap };
type TTemplater = (template: string, data: any) => string;
type TMutator = (data: any) => any;
type TMixin<T> = (this: T) => T;
type TNode = Element|Attr|Text|Comment|Node;
type TSelector = string|RegExp;

type TSchema = {
    event: Event,
    operation: string,  // eg: f($event, x)
    action: string,  // eg: f
};

type TEvent = {
    event: Event,
    name: string,  // eg: '(click)'
    type: string,  // eg: click
    path: Element[],  // native event property. path of bubbling.
    target: Element,
    schema: TSchema,
    value: string,  // eg: f($event, x)
    action: string,  // eg: f
};

type TPropertyChangedDetail = {
    boot: IBoot<TNode>,
    target: any,
    key: PropertyKey,
    value: any,
    receiver: any,
    previous: any,
};

type TPropertyChange = {
    selector: string|RegExp,
    key: string,
    value: any,
    previous: any,
}

interface IBoot<T extends TNode> {
    selector: string|RegExp;
    node: T;
    component: typeof Object | Function | any;
    instance: any;
    straps: Map<any, any>;
}

interface IComponent<T> {}

export {
    TAnalyze,
    TBootstrap,
    TTemplater,
    TMutator,
    TMixin,
    TNode,
    TSelector,
    TSchema,
    TEvent,
    TPropertyChangedDetail,
    TPropertyChange,
    IBoot,
    IComponent,
};
