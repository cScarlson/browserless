
import template from './forms.component.html';

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
    text: 'Start typing',
    date: '2022-03-16',
    checkbox: false,
    radio: { },
    textarea: 'Type, use line-breaks, html...',
    select: { },
    options,
    handleSubmission(e: Event|any) {
        e.preventDefault();
    }
};

export { forms };
