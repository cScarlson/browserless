
function templateRepeatX(exp: RegExp, template: string, data: any): string {
    var matching = exp.test(template);
    var [ element = '', tagName = '', property = '', value = '', vars = '', datum = '' ] = template.match(exp) || [ ];
    var [ full, indexName, itemName ] = /^\[(\w+),\s*(\w+)\]/.exec(vars) || [ ];
    var elements = new Set();
    
    function callback(index: number, item: any) {
        var tpl = element  // item references
          , tpl = tpl.replace(property, `[${itemName}]="${`${datum}[${index}]`}" [${indexName}]="${index}"`)  // replace entire property to eliminate infinite loop. replace with automatic binding(s).
          , tpl = tpl.replace(new RegExp(`{${itemName}}`, 'mg'), `${datum}[${index}]`)  // replace ${ '' + {itemName}.x.y.z } interpolations with that of datum/index.
          ;
        var tpl = tpl  // index references
          , tpl = tpl.replace(new RegExp(`{${indexName}}`, 'mg'), `${index}`)  // replace ${ '' + {itemName}.x.y.z } interpolations with that of datum/index.
          ;
        elements.add(tpl);
    }
    
    if (!matching) return template;  // eventually stops here.
    console.log('WTF?...', template);
    (new Function('cb', `
        with (this) for (${value}.entries()) cb( ...[].concat(${vars}) );
    `)).call(data, callback);
    template = template.replace( element, [...elements].join('') );
    
    return templateRepeat(exp, template, data);  // repeat for possible remaining repeats.
    // return template;
}

function templateRepeat(exp: RegExp, template: string, data: any): string {
    if ( !/\*for/.test(template) ) return template;
    var container = prepare(template);
    var repeater = container.querySelector('[_for]') || document.createElement('div');
    var repeaterHTML = repeater.outerHTML;
    var [ property, value, vars, indexName, datumName, list ] = /_for="(let\s(\[(\w+),\s*(\w+)\])\sof\s([^"]+))"/.exec(repeaterHTML) || [];
    var items = (new Function(`with (this) return ${list}`)).call(data);
    var elements = items.reduce(reduce, '');
    
    function prepare(template: string): HTMLDivElement {
        templateRepeat.container.innerHTML = template.replace('*for', '_for');  // legalize name for selection. only replace first instance of "*for".
        return templateRepeat.container;
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
    template = templateRepeat.container.outerHTML;
    
    return templateRepeat(exp, template, data);
}
templateRepeat.container = document.createElement('div');

function templateRepeatCloseTag(template: string, data: any): string {
    var exp = /<(\w+)\s+.*(\*for="(let\s(\[\w+,\s\w+\])\sof\s([^"]+))")(\s*.*=".*")*>(\s*.*\s*)*?<\/\1>/m;
    return templateRepeat(exp, template, data);
}

function templateRepeatSelfClosing(template: string, data: any): string {
    var exp = /<(\w+)\s+.*(\*for="(let\s(\[\w+,\s\w+\])\sof\s([^"]+))")(\s*.*=".*")*\s*\/{1}>(?!\s*[-])/m;
    return templateRepeat(exp, template, data);
}

function templateIf(exp: RegExp, template: string, data: any): string {
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
    templateRepeatCloseTag,
    templateRepeatSelfClosing,
    templateIf,
    templateIfCloseTag,
    templateIfSelfClosing,
};
