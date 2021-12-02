
const parser = document.createElement('div');
    
function legalize(template: string, attr: string): HTMLDivElement {
    var name = attr.replace('*', '_');
    var selectable = template.replace(attr, name);  // legalize name for selection. only replace first instance of "*for".
    
    parser.innerHTML = selectable;
    
    return parser;
}
    
function templateRepeat(template: string, data: any): string {
    if ( !/\*for/.test(template) ) return template;
    var fragment = legalize(template, '*for');
    var target = fragment.querySelector('[_for]');
    var html = target.outerHTML;
    var [ property, value, vars, indexName, datumName, list ] = /_for="(let\s(\[(\w+),\s*(\w+)\])\sof\s([^"]+))"/.exec(html) || [];
    var items = (new Function(`with (this) return ${list}`)).call(data);
    var elements = items.reduce(reduce, '');
    
    function reduce(copies: string, subject: string, i: number): string {
        var groomed = html
          , groomed = groomed.replace(property, `[${datumName}]="${list}[${i}]" [${indexName}]="${i}"`)
          , groomed = groomed.replaceAll(`{${datumName}}`, `${list}[${i}]`)
          , groomed = groomed.replaceAll(`{${indexName}}`, `${i}`)
          ;
        return `${copies}${groomed}`;
    }
    
    target.outerHTML = elements;  // replace single element with multiple.
    
    return templateRepeat(fragment.innerHTML, data);  // try again with new outerHTML (after resetting target).
}

function templateIf(template: string, data: any): string {  // TODO: model after templateRepeat.
    if( !/\*if/.test(template) ) return template;
    var fragment = legalize(template, '*if');
    var target = fragment.querySelector('[_if]');
    var html = target.outerHTML;
    var [ property, expression = 'false' ] = /_if="([^"]+)"/.exec(html) || [];  // default expression to false.
    var evaluation = (new Function(`with (this) return !!(${expression})`)).call(data);
    
    if (!evaluation) target.remove();
    
    return templateIf(fragment.outerHTML, data);  // try again after [potentially] removing target from fragment.
}

function templateCleanParser(template: string, data: any): string {
    parser.innerHTML = '';
    return template;
}

export {
    templateRepeat,
    templateIf,
    templateCleanParser,
};
