var LogFacade = /** @class */ (function () {
    function LogFacade() {
    }
    LogFacade.prototype.log = function (msg) {
        console.log(msg);
    };
    LogFacade.prototype.warn = function (msg) {
        console.warn(msg);
    };
    LogFacade.prototype.error = function (msg) {
        console.error(msg);
    };
    return LogFacade;
}());
export { LogFacade };
