
function templateRepeat(exp: RegExp, template: string, data: any): string {
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
    (new Function('cb', `
        with (this) for (${value}.entries()) cb( ...[].concat(${vars}) );
    `)).call(data, callback);
    template = template.replace( element, [...elements].join('') );
    
    return templateRepeat(exp, template, data);  // repeat for possible remaining repeats.
}

function templateRepeatCloseTag(template: string, data: any): string {
    var exp = /<(\w+)\s+.*(\*for="(let\s(\[\w+,\s\w+\])\sof\s([^"]+))")(\s*.*=".*")*>\s*.*\s*<\/\1>/m;
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
    replacement = (new Function('cb', ` with (this) return cb(!!${expression}); `)).call(data, callback);
    
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
