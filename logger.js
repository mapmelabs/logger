import lodash from 'lodash';
import debug from 'debug';

const colors = {
    red: {
        terminal: 1,
        rgb: '#ff0000',
    },
    green: {
        terminal: 2,
        rgb: '#00a000',
    },
    yellow: {
        terminal: 3,
        rgb: '#fcae05'
    },
    magenta: {
        terminal: 4,
        rgb: '#ad9aaf',
    },
    blue: {
        terminal: 5,
        rgb: '#004fd8',
    },
    gray: {
        terminal: 7,
        rgb: '#777777',
    },
};

const levels = {
    cfg: {
        color: colors.blue,
        suffix: 'CFG'
    },
    dbg: {
        color: colors.magenta,
        suffix: 'DBG'
    },
    log: {
        color: colors.gray,
        suffix: 'LOG'
    },
    info: {
        color: colors.green,
        suffix: 'INF'
    },
    warn: {
        color: colors.yellow,
        suffix: 'WRN'
    },
    error: {
        color: colors.red,
        suffix: 'ERR'
    },
};

const timeStrGet = date => {
    const msStr = date.getMilliseconds().toString().padStart(3, '0');
    return `${date.toLocaleTimeString('it-US')}.${msStr}`;
};
const timestamp = function () {
};
timestamp.toString = () => timeStrGet(new Date());

export const loggerCreate = nameSpace => {
    const nsl =  {
        handlers: {},
    };
    lodash.each(levels, (levelInfo, levelName) => {
        const {handlers} = nsl;
        Object.defineProperty(nsl, levelName, {
            get() {
                if (!nsl.handlers[levelName]) {
                    if (!nsl.instance) {
                        nsl.instance = debug(nameSpace);
                        // console.log(`lazyInit namespace ${nameSpace} useColors ${nsl.instance.useColors}`);
                    }
                    // console.log(`lazy init logger nameSpace ${nameSpace}:${levelInfo.suffix}`);
                    const handler = nsl.instance.extend(levelInfo.suffix);
                    // devtools timestamps can be enabled in settings
                    handler.log = global.window ?
                        console.log.bind(console) :
                        console.log.bind(console, '%s', timestamp);
                    const colorKey = global.window ? 'rgb' : 'terminal';
                    handler.color = levelInfo.color[colorKey];
                    handler.useColors = true;
                    handlers[levelName] = handler;
                }
                return handlers[levelName];
            },
        });
    });
    return nsl;
};

export const loggerInit = namespacesList => {
    const namespaces = namespacesList.join(',');
    // console.log('logged namespaces:', namespaces);
    debug.enable(namespaces);
    // {
    //     const testLogger = nslCreate('test-logger');
    //     ['cfg', 'dbg', 'log', 'info', 'warn', 'error',]
    //         .forEach(level => testLogger[level](`test level ${level} message`));
    // }
};
