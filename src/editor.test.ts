import { RextEditor } from './editor'
import { paramsCallbacks } from './lib/constants';
test('sumar 1 + 2 es igual a 3', () => {
  const rext = new RextEditor()
  
  expect(rext.getCallbacks(["exposure"])).toStrictEqual([]);
  expect(rext.getCallbacks(["radiance"])).toStrictEqual(paramsCallbacks["radiance"]);
  expect(rext.getCallbacks(["contrast", "temperature"])).toStrictEqual([...paramsCallbacks["contrast"], ...paramsCallbacks["temperature"] ]);
});
