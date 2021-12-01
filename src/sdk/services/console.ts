
const noop = new (class NoopConsole {
    
    clear() {}
    log() {}
    warn() {}
    error() {}
    
})();

export { noop };
