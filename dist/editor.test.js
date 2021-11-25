var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { RextEditor } from './editor';
import { paramsCallbacks } from './lib/constants';
test('Callbacks are working', function () {
    var mockCanvas = {
        getContext: function (ctx) {
            return null;
        }
    };
    var rext = new RextEditor(mockCanvas);
    expect(rext.getCallbacks(["exposure"])).toStrictEqual([]);
    expect(rext.getCallbacks(["radiance"])).toStrictEqual(paramsCallbacks["radiance"]);
    expect(rext.getCallbacks(["contrast", "temperature"])).toStrictEqual(__spreadArray(__spreadArray([], paramsCallbacks["contrast"]), paramsCallbacks["temperature"]));
});
