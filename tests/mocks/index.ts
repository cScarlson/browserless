
const MOCK_ELEMENT_0 = document.createElement('mock');
const MOCK_ELEMENT_1 = document.createElement('mock');
const MOCK_ELEMENT_2 = document.createElement('mock');
const MOCK_ATTRIBUTE_0 = document.createAttribute('mock');
const MOCK_ATTRIBUTE_1 = document.createAttribute('mock');
const MOCK_ATTRIBUTE_2 = document.createAttribute('mock');
const MOCK_TEXT_0 = document.createTextNode('mock');
const MOCK_COMMENT_0 = document.createComment('mock');
const MOCK_ILLEGALNODE_0 = document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');

const MOCK_ELEMENT_REPEAT_OUTERHTML_CLOSED = '<todo *for="let [i, todo] of data" [data]="{todo}" [index]="{i}" value="${{todo}.title}">${data.length}</todo>';
const MOCK_ELEMENT_REPEAT_OUTERHTML_SELFCLOSE = '<input *for="let [i, todo] of data" [index]="{i}" value="${{todo}.title}" [value]="{todo}.title" />';

export {
    MOCK_ELEMENT_0,
    MOCK_ELEMENT_1,
    MOCK_ELEMENT_2,
    MOCK_ATTRIBUTE_0,
    MOCK_ATTRIBUTE_1,
    MOCK_ATTRIBUTE_2,
    MOCK_TEXT_0,
    MOCK_COMMENT_0,
    MOCK_ILLEGALNODE_0,
    MOCK_ELEMENT_REPEAT_OUTERHTML_CLOSED,
    MOCK_ELEMENT_REPEAT_OUTERHTML_SELFCLOSE,
};
