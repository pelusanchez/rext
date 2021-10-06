# Rext Image Editor

Rext is a web based image editor. Uses webGL for image processing. **Only client side**.
Sample: [https://rext.es](https://rext.es)

## Available effects:

### Tone
* Exposition.
* Brightness.
* Contrast.
* Glades.
* Lights.
* Shadows.
* Darks.
* Radiance: local contrast and detail level.
* HDR.

### Color
* Temperature.
* Tint.
* Saturation.
* Vibrance.
* Black and white.
* Light and shadow color.

### Details
* Level: level of details.
* Radio: radius of detail.
* Mask: quantity of detail.
* Dehaze.
* Atmospheric light: Used for dehaze.

### Transformations
* Rotation.
* Scale. 
* Translate.

## HTML Vanilla example:
	
```[html]
<!DOCTYPE html>
<html>
  <head>
    <script languaje="javascript" src="../build/index.js"></script>
    <style type="text/css">
    #playground {
      display: flex;
      min-height: 400px;
    }

    #rext-params {
      width: 100%;
      min-height: 400px;
      min-width: 300px;
    }
    </style>
    <script languaje="javascript">
      const rext = new RextEditor.RextEditor();
      const defaultParams = {
        hdr: 0,
        exposure: 0,
        temperature: 0,
        tint: 0,
        brightness: 0,
        saturation: 0,
        contrast: 0,
        sharpen: 0,
        masking: 0,
        sharpen_radius: 0,
        radiance: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        dehaze: 0,
        bAndW: 0,
        atmosferic_light: 0,
        lightFill: 0,
        lightColor: 0,
        lightSat: 1,
        darkFill: 0,
        darkColor: 0,
        darkSat: 1,
        rotation: 0.0,
        scale: {
          x: 1,
          y: 1,
        },
        translate: {
          x: 0,
          y: 0,
        }
      };

      function onFileUpload(e) {
        const imageReader = new FileReader();
        const target = e.target;
        if (target.files[0]) {
          rext.load(URL.createObjectURL(target.files[0]))
        }
      }

      function updateParams() {
        const element = document.querySelector("#rext-params");
        
        try {
          // Check if is valid:  
          const newParams = JSON.parse(element.value)
          rext.updateParams(newParams) 
        } catch (err) {
          console.error(err)
          // Ignore error...
        }
        
      }

      window.addEventListener('load', () => {
        rext.setCanvas(document.querySelector("#frame"));
        document.querySelector("#file").addEventListener("change", onFileUpload)
        document.querySelector("#rext-params").value = JSON.stringify(defaultParams, null, 2)
        document.querySelector("#rext-params").addEventListener("change", updateParams)
      })

      
    </script>
  </head>
  <body>
    <div>
      <input type="file" id="file"/>
    </div>
    <div id="playground">
      <canvas width="1200" height="800" style="width: 800px; height: auto;" id="frame"></canvas>
      <div class=>
        <textarea id="rext-params"></textarea>
        <button onClick="updateParams">Apply</button>
      </div>
    </div>
  </body>
</html>
```

## Typescript Example:

`npm install --save rext-image-editor`

```
import { RextEditor } from 'rext-image-editor'
import { Params } from 'rext-image-editor/dist/models/models';
import { defaultParams } from 'rext-image-editor/dist/lib/constants';

const rext : RextEditor = new RextEditor()
rext.setCanvas(canvasElm : HTMLCanvasElement)
rext.load(url : string)
rext.updateParams(nextParams : Params)

```

### Params:

|Parameter | Type |
|---------|--------|
| hdr | number |
| exposure | number |
| temperature | number |
| tint | number |
| brightness | number |
| saturation | number |
| contrast | number |
| sharpen | number |
| masking | number |
| sharpen_radius | number |
| radiance | number |
| highlights | number |
| shadows | number |
| whites | number |
| blacks | number |
| dehaze | number |
| bAndW | number |
| atmosferic_light | number |
| lightFill | number |
| lightColor | number |
| lightSat | number |
| darkFill | number |
| darkColor | number |
| darkSat | number |
| rotation | number (Radians) |
| scale | 2d number { x: number; y: number }|
| translate | 2d number { x: number; y: number }|
