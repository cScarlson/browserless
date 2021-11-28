/**
 * This file is only used for aid of running tests (11/22/2021).
 */
module.exports = api => {
    const isTest = api.env('test');  // You can use isTest to determine what presets and plugins to use.

    return {
        presets: [
            [ '@babel/preset-env', { targets: { node: 'current' } } ],
            '@babel/preset-typescript',
        ],
        plugins: [
            [
                'babel-plugin-module-resolver',
                {
                    root: [ './' ],
                    alias: {
                        '@browserless': './src',
                    }
                }
            ],
            'introscope/babel-plugin',
        ]
    };
};
