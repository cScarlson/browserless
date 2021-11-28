
import { escape } from './utilities';

type TDatum = [ string, any ]|any;  // @hack #any

function escapeEntry(data: any, entry?: TDatum, ...more: TDatum[]): any {
    if (!entry) return data;
    if (!entry[0]) return data;
    if (entry[1] instanceof Function) return data;
    if (typeof entry[1] === 'string' && entry[1].substr(0, 2) === 'v:') return data;
    var [ key, value ] = entry;
    
    if (value instanceof Array) data[key] = escapeEntry(value, ...value.map( (v: any, i: number) => [`${i}`, v] ));
    else if (value instanceof Object) data[key] = escapeEntry(value, ...Object['entries'](value));
    else if (typeof value === 'string') data[key] = escape(value);
    else data[key] = escape(value);
    
    if (more.length) return escapeEntry(data, ...more);
    return data;
}

function mutateHTMLEntities(data: any): any {
    var entries = Object['entries'](data);
    var data = escapeEntry({ ...data }, ...entries);
    return data;
}

export {
    mutateHTMLEntities,
};
