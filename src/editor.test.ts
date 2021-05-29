import { RextEditor } from './editor'
import { paramsCallbacks } from './lib/constants';
test('Callbacks are working', () => {
  const mockCanvas = {
    getContext(ctx: string) : any { 
      return null;
    }
  } as HTMLCanvasElement;

  const rext = new RextEditor(mockCanvas);
  
  expect(rext.getCallbacks(["exposure"])).toStrictEqual([]);
  expect(rext.getCallbacks(["radiance"])).toStrictEqual(paramsCallbacks["radiance"]);
  expect(rext.getCallbacks(["contrast", "temperature"])).toStrictEqual([...paramsCallbacks["contrast"], ...paramsCallbacks["temperature"] ]);
});
