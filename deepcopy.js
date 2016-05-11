/**
 * Created by wyq on 2015/8/21.
 */
var deepcopy = require('deepcopy');

var testMap = {
    "a": {
        "txt": "a",
        "b": {
            "txt": "b",
            "c": {
                "txt": "c",
                'd': {
                    "txt": "d",
                    e: {
                        "txt": "e"
                    }
                }
            }
        }
    }
};

console.log("%j", testMap);
var copyMap = deepcopy(testMap);
copyMap['b'] = "copyMap";
console.log("%j", testMap);
console.log("%j", copyMap);





