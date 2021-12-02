
const templateRepeat = (function getTemplateRepeat() {
    var parser = document.createElement('div');
    
    return function templateRepeat(template: string, data: any): string {
        if ( !/\*for/.test(template) ) return template;
        var container = prepare(template);
        var repeater = container.querySelector('[_for]') || document.createElement('div');
        var repeaterHTML = repeater.outerHTML;
        var [ property, value, vars, indexName, datumName, list ] = /_for="(let\s(\[(\w+),\s*(\w+)\])\sof\s([^"]+))"/.exec(repeaterHTML) || [];
        var items = (new Function(`with (this) return ${list}`)).call(data);
        var elements = items.reduce(reduce, '');
        
        function prepare(template: string): HTMLDivElement {
            parser.innerHTML = template.replace('*for', '_for');  // legalize name for selection. only replace first instance of "*for".
            return parser;
        }
        
        function reduce(copies: string, subject: string, i: number): string {
            var groomed = repeaterHTML
            , groomed = groomed.replace(property, `[${datumName}]="${list}[${i}]" [${indexName}]="${i}"`)
            , groomed = groomed.replaceAll(`{${datumName}}`, `${list}[${i}]`)
            , groomed = groomed.replaceAll(`{${indexName}}`, `${i}`)
            ;
            return `${copies}\n${groomed}`;
        }
        
        repeater.outerHTML = elements;  // replace single element with multiple.
        template = container.outerHTML;
        
        return templateRepeat(template, data);
    };
})();

function templateIf(exp: RegExp, template: string, data: any): string {  // TODO: model after templateRepeat.
    var matching = exp.test(template);
    var [ element = '', tagName = '', property = '', expression = '' ] = template.match(exp) || [ ];
    let replacement;
    
    function callback(evaluation: boolean) {
        if (!evaluation) return template.replace(exp, '');
        return template;
    }
    
    if (!matching) return template;  // eventually stops here.
    replacement = (new Function('cb', ` with (this) return cb(!!(${expression})); `)).call(data, callback);
    
    if (replacement !== template) return templateIf(exp, replacement, data);
    return template;
}

function templateIfCloseTag(template: string, data: any): string {
    var exp = /<(\w+)\s+.*(\*if="(.+)")(\s*.*=".*")*>\s*.*\s*<\/\1>/m;
    return templateIf(exp, template, data);
}

function templateIfSelfClosing(template: string, data: any): string {
    var exp = /<(\w+)\s+.*(\*if="(.*)")(\s*.*=".*")*\s*\/{1}>(?!\s*[-])/m;
    return templateIf(exp, template, data);
}

export {
    templateRepeat,
    templateIf,
    templateIfCloseTag,
    templateIfSelfClosing,
};
