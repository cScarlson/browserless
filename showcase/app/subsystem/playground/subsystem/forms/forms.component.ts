
import template from './forms.component.html';

const date = new Date();
const options = [
    { id:  0, label: "Options A" },
    { id:  1, label: "Options B" },
    { id:  2, label: "Options C" },
    { id:  3, label: "Options D" },
    { id:  4, label: "Options E" },
    { id:  5, label: "Options F" },
    { id:  6, label: "Options G" },
    { id:  7, label: "Options H" },
    { id:  8, label: "Options I" },
    { id:  9, label: "Options J" },
    { id: 10, label: "Options K" },
];

const forms = {
    ['v:template']: template,
    text: 'Start typing...',
    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    checkbox: true,
    radio: 1,
    textarea: 'Type, use line-breaks, html...',
    select: 1,
    options,
    $multiple: new Map([ [1, 1], [2, 2] ]),
    get multiple() { return Array.from( this.$multiple.values() ) },
    handleRadio(e: Event|any) {
        var { type, target } = e;
        var { value } = target;
        
        this.radio = +value;
        console.log('RADIO', value);
    },
    handleMultiple(e: Event|any) {
        var { $multiple } = this;
        var { target } = e;
        var { options } = target;
        
        $multiple.clear();
        for (let option of options) if (option.selected) $multiple.set(option.value, option.value);
        console.log('SELECT[MULTIPLE]', this.$multiple.size);
    },
    handleSubmission(e: Event|any) {
        e.preventDefault();
    }
};

export { forms };
