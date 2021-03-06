"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for rpc log.
 * Reject rpc request when toobusy
 */
const pinus_logger_1 = require("pinus-logger");
var rpcLogger = pinus_logger_1.getLogger('rpc-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;
function default_1(maxLag) {
    return new RpcToobusyFilter(maxLag || DEFAULT_MAXLAG);
}
exports.default = default_1;
;
class RpcToobusyFilter {
    constructor(maxLag) {
        this.name = 'toobusy';
        try {
            toobusy = require('toobusy');
        }
        catch (e) {
        }
        if (!!toobusy) {
            toobusy.maxLag(maxLag);
        }
    }
    ;
    /**
     * Before filter for rpc
     */
    before(serverId, msg, opts, next) {
        opts = opts || {};
        if (!!toobusy && toobusy()) {
            rpcLogger.warn('Server too busy for rpc request, serverId:' + serverId + ' msg: ' + msg);
            var err = new Error('Backend server ' + serverId + ' is too busy now!');
            err.code = 500;
            next(err);
        }
        else {
            next();
        }
    }
    ;
}
exports.RpcToobusyFilter = RpcToobusyFilter;
//# sourceMappingURL=toobusy.js.map