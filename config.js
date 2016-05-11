/**
 * Created by wyq on 2015/8/6.
 */

var CONFIG = {
    "log4jsconfig": {
        "appenders": [
            {
                "type": "dateFile",
                "absolute": true,
                "filename": "./opt/logs/tmall.log",
                "pattern": "-yyyy-MM-dd"
            },
            {
                "type": "dateFile",
                "absolute": true,
                "filename": "./opt/logs/access.log",
                "pattern": "-yyyy-MM-dd",
                "category": "Express"
            },
            {
                "type": "console"
            }
        ],
        "levels": {
            "logger": "trace"
        },
        replaceConsole: true
    }
};

module.exports = CONFIG;