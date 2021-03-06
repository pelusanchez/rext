import { RextEditor } from './editor'
import { paramsCallbacks } from './lib/constants';
test('Callbacks are working', () => {
  const rext = new RextEditor()
  
  expect(rext.getCallbacks(["exposure"])).toStrictEqual([]);
  expect(rext.getCallbacks(["radiance"])).toStrictEqual(paramsCallbacks["radiance"]);
  expect(rext.getCallbacks(["contrast", "temperature"])).toStrictEqual([...paramsCallbacks["contrast"], ...paramsCallbacks["temperature"] ]);
});
