
var tags = [
    { id: 0, title: "tag-a" },
    { id: 1, title: "tag-b" },
    { id: 2, title: "tag-c" },
];
var todos = [
    { done:  true, title: "Element Components", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Attr Directives (with RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Text Directives (without RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Comment Directives (without RegExp support)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Automatic Rerender", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Middleware", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Bootstrappers", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible 'Templaters'", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Extensible Mixins", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Event-Bindings", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Slots", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Template Loops (*for)", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "One-Way Data-Binding", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Two-Way Data-Binding", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "CSS Injection (with CSS Module support)", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "Documentation", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Better <code>*for</code> Templater", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "XSS Protection For <code>html</code>", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Sandbox Lifecycle Event", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Memory Cleanup", description: "a^2 + b^2 = c^2", tags },
    { done:  true, title: "Testing", description: "a^2 + b^2 = c^2", tags },
    { done: false, title: "./core.ts#fn() -> ./core/fn.ts", description: "a^2 + b^2 = c^2", tags },
].sort( (a, b) => a.done ? 1 : -1 );

export { todos };
