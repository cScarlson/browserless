
import {
    templateRepeatCloseTag,
    templateRepeatSelfClosing,
} from '@browserless/templaters';
import {
    MOCK_ELEMENT_REPEAT_OUTERHTML_CLOSED,
    MOCK_ELEMENT_REPEAT_OUTERHTML_SELFCLOSE,
} from './mocks';

describe("templaters", () => {
    
    describe("templateRepeatCloseTag", () => {
        
        it("may require 'symbols' (`{someSymbol}`)", () => {
            const regexp = /<(.+)\s\*for\="let\s\[.+,\s(.+)\]\sof\s.+".*\[.+\]="\{\2\}".*>.*<\/\1>/m;
            const res = regexp.test(MOCK_ELEMENT_REPEAT_OUTERHTML_CLOSED);
            expect(res).toBe(true);
        });
        
        it("replaces single, instructional outerHTML with non-infinite loop version for length of array", () => {
            const scope = {
                data: [
                    { title: "" },
                    { title: "" },
                    { title: "" },
                    { title: "" },
                ]
            };
            const expectation = [
                '<todo [todo]="data[0]" [i]="0" [data]="data[0]" [index]="0" value="${data[0].title}">${data.length}</todo>',
                '<todo [todo]="data[1]" [i]="1" [data]="data[1]" [index]="1" value="${data[1].title}">${data.length}</todo>',
                '<todo [todo]="data[2]" [i]="2" [data]="data[2]" [index]="2" value="${data[2].title}">${data.length}</todo>',
                '<todo [todo]="data[3]" [i]="3" [data]="data[3]" [index]="3" value="${data[3].title}">${data.length}</todo>',
            ].join('');
            const res = templateRepeatCloseTag(MOCK_ELEMENT_REPEAT_OUTERHTML_CLOSED, scope);
            
            expect(res).toBe(expectation);
        });
        
    });
    
    describe("templateRepeatCloseTag", () => {
        
        it("may require 'symbols' (`{someSymbol}`)", () => {
            const regexp = /<.+\s\*for\="let\s\[.+,\s(.+)\]\sof\s.+".*\[.+\]="\{\1\}.*".*\s\/>/m;
            const res = regexp.test(MOCK_ELEMENT_REPEAT_OUTERHTML_SELFCLOSE);
            expect(res).toBe(true);
        });
        
        it("replaces single, instructional outerHTML with non-infinite loop version for length of array", () => {
            const scope = {
                data: [
                    { title: "" },
                    { title: "" },
                    { title: "" },
                    { title: "" },
                ]
            };
            const expectation = [
                '<input [todo]="data[0]" [i]="0" [index]="0" value="${data[0].title}" [value]="data[0].title" />',
                '<input [todo]="data[1]" [i]="1" [index]="1" value="${data[1].title}" [value]="data[1].title" />',
                '<input [todo]="data[2]" [i]="2" [index]="2" value="${data[2].title}" [value]="data[2].title" />',
                '<input [todo]="data[3]" [i]="3" [index]="3" value="${data[3].title}" [value]="data[3].title" />',
            ].join('');
            const res = templateRepeatSelfClosing(MOCK_ELEMENT_REPEAT_OUTERHTML_SELFCLOSE, scope);
            
            expect(res).toBe(expectation);
        });
        
    });
    
});
