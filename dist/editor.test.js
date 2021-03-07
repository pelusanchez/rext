var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { RextEditor } from './editor';
import { paramsCallbacks } from './lib/constants';
test('Callbacks are working', function () {
    var rext = new RextEditor();
    expect(rext.getCallbacks(["exposure"])).toStrictEqual([]);
    expect(rext.getCallbacks(["radiance"])).toStrictEqual(paramsCallbacks["radiance"]);
    expect(rext.getCallbacks(["contrast", "temperature"])).toStrictEqual(__spreadArray(__spreadArray([], paramsCallbacks["contrast"]), paramsCallbacks["temperature"]));
});
