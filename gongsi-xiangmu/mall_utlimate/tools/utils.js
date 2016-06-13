/**
 * Created by wyq on 2015/9/17.
 */

exports.midSend = function (data, status) {
    var finalVal = {state: "success", results: data};
    if (status) {
        finalVal.state = "failed";
    }
    return finalVal;
};
