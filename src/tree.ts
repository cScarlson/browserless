
import { TNode, TSelector, IBoot } from './interfaces';

class Tree<T extends TNode> extends Map<TSelector, Tree<Attr>> {
    boot: IBoot<T> = { selector: '', node: null, component: null, instance: null, straps: new Map() };
    parent: Tree<T>;
    $children: Map<TSelector, Tree<T>> = new Map();
    get selector(): any { return this.boot.selector }
    get component(): any { return this.boot.instance }
    get children(): Tree<T>[] { return Array.from( this.$children.values() ) }
    get attributes(): Tree<Attr>[] { return Array.from( this.values() ) }
    
    constructor(options: any = {}) {
        super();
        var options = { ...this, ...options };
        var { boot, parent = this, children = [] } = options;
        
        this.boot = boot;
        this.parent = parent;
        
        return this;
    }
    
}

export { Tree };
