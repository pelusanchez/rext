var RextEditor;(()=>{"use strict";var t={d:(e,i)=>{for(var r in i)t.o(i,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:i[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};(()=>{t.r(e),t.d(e,{RextEditor:()=>h});var i=function(t,e,i){return t<e?e:t>i?i:t},r=function(t,e,i,r,n,o,a,s){void 0===n&&(n=0),void 0===o&&(o=.33),void 0===a&&(a=.66),void 0===s&&(s=1);var l,u,h,g,_,p,m,c,x,f,d,v,b,k,T,y,E,L=Math.pow(n,2),A=Math.pow(o,2),R=Math.pow(a,2),D=Math.pow(s,2),z=(p=(h=[n,o,a,s])[2]-h[3],_=(l=[L*n,A*o,R*a,D*s])[0]*((u=[L,A,R,D])[1]*p-h[1]*(c=u[2]-u[3])+(f=u[2]*h[3]-h[2]*u[3]))-u[0]*(l[1]*p-h[1]*(m=l[2]-l[3])+(d=l[2]*h[3]-h[2]*l[3]))+h[0]*(l[1]*c-u[1]*m+(v=l[2]*u[3]-u[2]*l[3]))-(l[1]*f-u[1]*d+h[1]*v),[((g=[t,e,i,r])[0]*(u[1]*p-h[1]*c+f)-u[0]*(g[1]*p-h[1]*(x=g[2]-g[3])+(b=g[2]*h[3]-h[2]*g[3]))+h[0]*(g[1]*c-u[1]*x+(k=g[2]*u[3]-u[2]*g[3]))-(g[1]*f-u[1]*b+h[1]*k))/_,(l[0]*(g[1]*p-h[1]*x+b)-g[0]*(l[1]*p-h[1]*m+d)+h[0]*(l[1]*x-g[1]*m+(T=l[2]*g[3]-g[2]*l[3]))-(l[1]*b-g[1]*d+h[1]*T))/_,(l[0]*(u[1]*x-g[1]*c+(y=u[2]*g[3]-g[2]*u[3]))-u[0]*(l[1]*x-g[1]*m+T)+g[0]*(l[1]*c-u[1]*m+v)-(l[1]*y-u[1]*T+g[1]*v))/_,(l[0]*(u[1]*(E=h[2]*g[3]-g[2]*h[3])-h[1]*y+g[1]*f)-u[0]*(l[1]*E-h[1]*T+g[1]*d)+h[0]*(l[1]*y-u[1]*T+g[1]*v)-g[0]*(l[1]*f-u[1]*d+h[1]*v))/_].map((function(t){return Math.round(1e3*t)/1e3})));return function(t){var e=z[3],i=t;return e+=z[2]*i,i*=t,e+=z[1]*i,i*=t,e+z[0]*i}},n=function(t){var e,r,n,o,a,s;return r=(e=t.z*t.y)*(1-Math.abs(t.x/60%2-1)),n=t.z-e,t.x<180?t.x<60?(o=t.z,a=r+n,s=n):t.x<120?(o=r+n,a=t.z,s=n):(o=n,a=t.z,s=r+n):t.x<240?(o=n,a=r+n,s=t.z):t.x<300?(o=r+n,a=n,s=e+n):(o=e+n,a=n,s=r+n),{x:o=i(o,0,1),y:a=i(a,0,1),z:s=i(s,0,1)}},o=function(t){return[t.x,t.y,t.z]},a={hdr:0,exposure:0,temperature:0,tint:0,brightness:0,saturation:0,contrast:0,sharpen:0,masking:0,sharpen_radius:0,radiance:0,highlights:0,shadows:0,whites:0,blacks:0,dehaze:0,bAndW:0,atmosferic_light:0,lightFill:0,lightColor:0,lightSat:1,darkFill:0,darkColor:0,darkSat:1,rotation:0,scale:{x:1,y:1},translate:{x:0,y:0}},s={contrast:["generateLightning"],whites:["generateLightning"],highlights:["generateLightning"],shadows:["generateLightning"],blacks:["generateLightning"],radiance:["generateLightning","kernel_update"],hdr:["kernel_update"],temperature:["updateTemptint"],tint:["updateTemptint"],sharpen:["kernel_update"],sharpen_radius:["kernel_update"]},l=[[.6167426069865002,.017657981710823077],[.5838624982041293,.06447754787874993],[.5666570157784903,.1010769359975838],[.5600215017846518,.13012054359808795],[.5603460901328465,.15370282338343416],[.5651414015638195,.1734071109259789],[.5727157905223393,.19040417876076665],[.5819305919306469,.20554787970182647],[.5920253173976543,.219454396860673],[.6024964973113273,.23256361077001078],[.613014923688415,.2451851574423344],[.6233694681448863,.2575325541865392],[.633428991849502,.2697484189519574],[.6431164873163056,.2819231700046263],[.6523914777767198,.29410898225476145],[.6612380004437802,.30633028466830314],[.6696563786680246,.31859171532935343],[.6776575761390952,.330884185957384],[.6852593188363603,.34318952105568623],[.6924834326806721,.3554840067292358],[.6993540206164168,.36774109382812364],[.705896221219359,.37993343721079975],[.712135371070854,.3920344089104195],[.7180964477199883,.4040191918024166],[.7238037074478182,.41586553788423575],[.7292804578150028,.42755425869079605],[.7345489228275083,.43906950280216533],[.7396301709912545,.4503988656030025],[.7445440852278651,.4615333686006381],[.7493093597375261,.47246733915721345],[.7539435132044948,.4831982160881075],[.7584629107855697,.4937263019887011],[.7628827894765442,.5040544792219176],[.7672172829757861,.5141879031216875],[.7756812566990368,.5339005596070674],[.7756812566990368,.5339005596070674],[.7798336535847834,.5434985836882681],[.7839465092903851,.552938802301879],[.7880286368234596,.5622329533372938],[.7920877696863722,.5713931712543325],[.796130534601134,.5804317041849897],[.8001624136045166,.5893606423074715],[.8041876951180534,.5981916567442426],[.8082094136732589,.6069357478075997],[.8122292780585781,.6156030011340633],[.8162475877574743,.624202350096731],[.8202631376804659,.6327413428542148],[.8242731113661302,.6412259124772712],[.8282729630469863,.6496601487868902],[.8322562892583072,.6580460708395705],[.8362146910181553,.6663833994084263],[.8401376280395388,.6746693293369075],[.8440122669563406,.6828983022904387],[.8478233261635671,.691061781205187],[.8515529205921868,.6991480286361483],[.8578515274860328,.7143328511178657],[.8630349166004683,.7236145588845],[.8630349166004683,.7236145588845],[.8678866519883774,.7326305266929798],[.8724265417351438,.7413920824039555],[.8766746938112879,.7499106260961086],[.8806514255414362,.7581975699581189],[.8843771730729832,.7662642858505886],[.8878724008449614,.7741220599147951],[.8911575110568668,.7817820536219475],[.8942527531374216,.7892552706795768],[.8971781332133792,.7965525292390034],[.9025975721615955,.8106613818669473],[.9051296119968262,.8174934982533621],[.9051296119968262,.8174934982533621],[.9075675706910422,.8241906743465228],[.9099288798932852,.8307625342003426],[.912230184763394,.8372184337382709],[.914487253441016,.8435674571884941],[.9167148865142485,.8498184155292972],[.9189268264883301,.8559798466723794],[.9211356672547586,.862060017138353],[.9233527635598611,.8680669250033681],[.9278504028585166,.8798916280267886],[.9301466448383797,.8857241176152066],[.9324823592671754,.8915127453709542],[.9348613471976668,.8972642431099969],[.9348613471976668,.8972642431099969],[.9372856273504615,.9029851088748369],[.9397553455825536,.9086816143048344],[.9422686843563701,.9143598121965675],[.9448217722084058,.9200255441824128],[.947408593218177,.925684448465339],[.9500208964767429,.931341967556689],[.9552772279767501,.9426736878435626],[.9578927646784257,.9483578644262163],[.9604766194871308,.954060621455171],[.9630080085847714,.9597865363484674],[.965463369977889,.9655400352277332],[.965463369977889,.9655400352277332],[.9678162729662736,.9713253997462401],[.9700373276119754,.9771467737131783],[.9720940942080452,.9830081695063213],[.9739509927471266,.9889134742677088],[.97556921239073,.9948664558790756],[.9782396416593983,1]],u=function(){function t(){}return t.prototype.log=function(t){console.log(t)},t.prototype.warn=function(t){console.warn(t)},t.prototype.error=function(t){console.error(t)},t}(),h=function(){function t(t,e){var i;this.params=(i=a,JSON.parse(JSON.stringify(i))),this.program=null,this.realImage=null,this.currentImage=null,this.pointers={positionLocation:null,positionBuffer:null,texcoordLocation:null,texcoordBuffer:null,resolutionLocation:null,textureSizeLocation:null,kernelLocation:null,kernelWeightLocation:null,u_exposure:null,u_brightness:null,u_contrast:null,u_saturation:null,u_masking:null,u_dehaze:null,u_atmosferic_light:null,u_temptint:null,u_bAndW:null,u_hdr:null,u_lut:null,u_image:null,u_rotation:null,u_scale:null,u_translate:null},this.WIDTH=0,this.HEIGHT=0,this.log=new u,this.config={resolutionLimit:1e6,editionResolutionLimit:1e6},this.uniforms={kernel:[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],temptint:[1,1,1]},this.LIGHT_MATCH=function(){for(var t=[],e=0;e<256;e++)t[e]=e;return t}(),t&&this.setCanvas(t),e&&(this.config=e)}return t.prototype.setCanvas=function(t){this.canvas=t,this.gl=t.getContext("webgl")||t.getContext("experimental-webgl")},t.prototype.runCallback=function(t){switch(t){case"generateLightning":this.generateLightning();case"kernel_update":this.updateKernel();case"updateTemptint":this.updateTemptint()}this.log.warn("No callback "+t+" exists")},t.prototype.updateParams=function(t){var e=this,i=Object.keys(this.params).filter((function(i){return e.params[i]!==t[i]}));i.forEach((function(i){e.updateParam(i,t[i])})),this.getCallbacks(i).forEach((function(t){e.runCallback(t)})),this.update()},t.prototype.getCallbacks=function(t){var e=new Set(t.filter((function(t){return null!=s[t]})).map((function(t){return s[t]})).reduce((function(t,e){return t.concat(e)}),[]));return Array.from(e)},t.prototype.updateParam=function(t,e){Object.keys(this.params).includes(t)?this.params[t]=e:this.log.error("Param "+t+" does not exists")},t.prototype.resize=function(t,e){if(null!=this.realImage){var i=new Image;i.width=t,i.height=e,this.loadImage(i),i.src=this.realImage.src}else this.log.warn("Resize called without image")},t.prototype.getWidth=function(){return this.WIDTH},t.prototype.getHeight=function(){return this.HEIGHT},t.prototype.get2dRotation=function(){return{x:Math.sin(this.params.rotation),y:Math.cos(this.params.rotation)}},t.prototype.loadImage=function(t){var e=this;t.onload=function(){null!=e.currentImage?e.render(e.currentImage):e.log.warn("Load Image called without image")},t.onerror=function(){e.log.error("Error al cargar la imagen.")},this.currentImage=t},t.prototype.load=function(t){this.log.log("Version 1.2.2"),this.realImage=new Image,this.loadImage(this.realImage),this.realImage.src=t},t.prototype.setLog=function(t){this.log=t},t.prototype.updateKernel=function(){var t=-this.params.sharpen,e=this.params.sharpen_radius,i=this.params.radiance,r=this.params.hdr;0!=i&&(t-=.5*i,e+=.5*i),0!=r&&(t-=.5*r,e+=.5*r);var n=t*Math.exp(-Math.pow(1/e,2)),o=t*Math.exp(-Math.pow(1.41/e,2)),a=t*Math.exp(-Math.pow(2/e,2)),s=t*Math.exp(-Math.pow(2.24/e,2)),l=t*Math.exp(-Math.pow(2.83/e,2)),u=1;t<0&&(u+=4*Math.abs(l)+8*Math.abs(s)+4*Math.abs(a)+4*Math.abs(o)+4*Math.abs(n)),this.uniforms.kernel=[l,s,a,s,l,s,o,n,o,s,a,n,u,n,a,s,o,n,o,s,l,s,a,s,l]},t.prototype.updateTemptint=function(){var t,e,i,r=this.params.temperature,n=this.params.tint;if(r<0){t=1;var o=l[Math.floor(100*(r+1))];e=o[0],i=o[1]}else t=.0438785/Math.pow(r+.150127,1.23675)+.543991,e=.0305003/Math.pow(r+.163976,1.23965)+.69136,i=1;-1==n&&(n=-.99);var a,s=1/(.2126*(a={x:t,y:e+=n,z:i}).x+.7152*a.y+.0722*a.z);this.uniforms.temptint=[t*s,e*s,i*s]},t.prototype.generateLightning=function(){for(var t=this.params.blacks,e=this.params.shadows,i=this.params.highlights,n=this.params.whites,o=this.params.radiance,a=r(t,e+.33,i+.66,n+1,0,.33,.66,1),s=0;s<256;s++){var l=s/256;l>1&&(l=1),l<0&&(l=0),l>1&&(l=1),l<0&&(l=0),0!=o&&(l=r(0,.33-.11*o,.66+.11*o,1,0,.33,.66,1)(l)),(l=a(l))>1&&(l=1),l<0&&(l=0),this.LIGHT_MATCH[s]=255*l}},t.prototype.kernelNormalization=function(t){return t.reduce((function(t,e){return t+e}))},t.prototype.blob=function(t,e){var i=this;return new Promise((function(r,n){if(null===i.realImage)return i.log.warn("Called to blob without loaded image"),n();i.render(i.realImage),i.canvas.toBlob((function(t){if(null===t)return i.log.error("Unable to generate the blob file"),n();r(t)}),t||"image/jpeg",e||.95)}))},t.prototype.render=function(t,e){var i=g(this.gl,this.gl.VERTEX_SHADER,"attribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec2 u_resolution;\nvarying vec2 v_texCoord;\nuniform vec2 u_rotation;\nuniform vec2 u_scale;\nuniform vec2 u_translate;\n\nvoid main() {\n\n  vec2 scaled = a_position * u_scale;\n  vec2 center = u_resolution / 2.0;\n  vec2 pos_rotated = vec2(\n    (scaled.x - center.x) * u_rotation.y + (scaled.y - center.x) * u_rotation.x,\n    (scaled.y - center.y) * u_rotation.y - (scaled.x - center.y) * u_rotation.x);\n  \n  vec2 dist = (pos_rotated + center) / u_resolution;\n  dist.x = dist.x + u_translate.x;\n  dist.y = dist.y + u_translate.y;\n\n  vec4 pos = vec4((dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);\n\n  gl_Position = pos;\n  v_texCoord = a_texCoord;\n}\n"),r=g(this.gl,this.gl.FRAGMENT_SHADER,"/** * David Iglesias. All rights reserved */\nprecision mediump float;\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[25];\nuniform float u_kernelWeight;\nuniform sampler2D u_lut;\nuniform float u_saturation;\nuniform float u_brightness;\nuniform float u_exposure;\nuniform float u_contrast;\nuniform float u_dehaze;\nuniform float u_atmosferic_light;\nuniform float u_masking;\nuniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill\nuniform float u_bAndW;\nuniform float u_hdr;\nvarying vec2 v_texCoord;\nvoid main() {\n  \n\tvec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n  \n\tvec3 center = texture2D(u_image, v_texCoord).rgb;\n\n  /* 5x5 kernel filter */\n  vec4 colorSum = texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -2)) * u_kernel[0]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -2)) * u_kernel[1]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -2)) * u_kernel[2]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -2)) * u_kernel[3]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -2)) * u_kernel[4]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -1)) * u_kernel[5]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -1)) * u_kernel[6]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -1)) * u_kernel[7]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -1)) * u_kernel[8]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -1)) * u_kernel[9]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 0)) * u_kernel[10]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 0)) * u_kernel[11]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 0)) * u_kernel[12]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 0)) * u_kernel[13]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 0)) * u_kernel[14]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 1)) * u_kernel[15]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 1)) * u_kernel[16]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 1)) * u_kernel[17]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 1)) * u_kernel[18]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 1)) * u_kernel[19]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 2)) * u_kernel[20]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 2)) * u_kernel[21]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 2)) * u_kernel[22]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 2)) * u_kernel[23]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 2)) * u_kernel[24];\n\n\t/* Kernel filter mask */\n  vec3 rgb_pix = mix(center, (colorSum.rgb / u_kernelWeight), u_masking);\n\t\n\t/**\n\t * RGB to saturation/value conversion, in order to maintains hue constant \n\t * sv_pixel = (saturation, value)\n\t */\n  float _max = max(rgb_pix.r, max(rgb_pix.g, rgb_pix.b));\n  float _min = min(rgb_pix.r, min(rgb_pix.g, rgb_pix.b));\n  vec2 sv_pixel = vec2(1.0 - _min / _max, _max);\n\n  sv_pixel.y = clamp(texture2D(u_lut, vec2(sv_pixel.y, 0.0)).a, 0.0, 1.0);\n\n\t/* Add saturation */\n  if (u_saturation != 0.0) {\n    sv_pixel.x *= (1.0 + u_saturation);\n  }\n\n  sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);\n\n\t/* Brightness */\n  if (u_brightness != 0.0) {\n    sv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);\n  }\n\n\t/* HDR 'like' filter */\n  if (u_hdr != 0.0) {\n    sv_pixel.y = mix(sv_pixel.y, clamp(1.0 - pow(1.0 - pow(sv_pixel.y, 0.3), 0.42), 0.0, 1.0), u_hdr);\n  }\n\n  sv_pixel = clamp(sv_pixel, 0.0, 1.0);\n\t/* Return to RGB */\n  if (sv_pixel.x > 0.0) {\n    float k = -sv_pixel.x / (1.0 - _min / _max);\n    rgb_pix = (_max - rgb_pix) * k + _max;\n    rgb_pix *= sv_pixel.y / _max;\n  } else {\n    rgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.y;\n  }\n\n\t/* Dehaze */\n  if (u_dehaze != 0.0) {\n    float t = 1.0 / 25.0;\n    vec4 center = texture2D(u_image, v_texCoord);\n    vec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n    float dark = 1.0;\n    const int radius = 1;\n    for (int ii = -radius; ii <= radius; ii++) {\n      for (int jj = -radius; jj <= radius; jj++) {\n        vec4 pix = texture2D(u_image, v_texCoord + pixel_size * vec2(ii, jj));\n        float _min = min(pix.r, min(pix.g, pix.b));\n        if (dark > _min) {\n          dark = _min;\n        }\n      }\n    }\n    float darkPix = min(center.r, min(center.g, center.b));\n    float diff = abs(darkPix - dark);\n    float mask = pow(diff, 3.0);\n    dark = mix(darkPix, dark, mask);\n    float mm = max(1.0 - dark, 0.2);\n    rgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze);\n  }\n\n\t/* Exposure */\n  rgb_pix += u_exposure;\n  rgb_pix = clamp(rgb_pix, 0.0, 1.0);\n\n\t/* Contrast */\n  float contrast = u_contrast + 1.0;\n  rgb_pix = contrast * (rgb_pix - 0.5) + 0.5;\n\t\n\t/* Apply tint filter */\n  rgb_pix *= u_temptint[0];\n  float mono = dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));\n  rgb_pix += mix(u_temptint[2], u_temptint[1], mono);\n\n\t/* Black&White filter */\n  if (u_bAndW != 0.0) {\n    rgb_pix = mix(rgb_pix, vec3(mono, mono, mono), u_bAndW);\n  }\n\n  gl_FragColor = vec4(rgb_pix, 1.0);\n\n}\n");try{this.program=function(t,e,i){var r=t.createProgram();if(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS))return r;t.deleteProgram(r)}(this.gl,i,r)}catch(t){return this.log.error(t)}this.pointers.positionLocation=this.gl.getAttribLocation(this.program,"a_position"),this.pointers.texcoordLocation=this.gl.getAttribLocation(this.program,"a_texCoord"),this.pointers.positionBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.pointers.positionBuffer),this.WIDTH=t.width,this.HEIGHT=t.height,this.gl.canvas.width=this.WIDTH,this.gl.canvas.height=this.HEIGHT,this.log.log("[IMAGE] width = "+this.WIDTH+", height = "+this.HEIGHT),this.setRectangle(0,0,this.WIDTH,this.HEIGHT),this.pointers.texcoordBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.pointers.texcoordBuffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),this.gl.STATIC_DRAW),this.gl.activeTexture(this.gl.TEXTURE0),_(this.gl);try{this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,t)}catch(t){return this.log.error(t)}this.pointers.u_image=this.gl.getUniformLocation(this.program,"u_image"),this.pointers.resolutionLocation=this.gl.getUniformLocation(this.program,"u_resolution"),this.pointers.textureSizeLocation=this.gl.getUniformLocation(this.program,"u_textureSize"),this.pointers.kernelLocation=this.gl.getUniformLocation(this.program,"u_kernel[0]"),this.pointers.kernelWeightLocation=this.gl.getUniformLocation(this.program,"u_kernelWeight"),this.pointers.u_exposure=this.gl.getUniformLocation(this.program,"u_exposure"),this.pointers.u_brightness=this.gl.getUniformLocation(this.program,"u_brightness"),this.pointers.u_contrast=this.gl.getUniformLocation(this.program,"u_contrast"),this.pointers.u_saturation=this.gl.getUniformLocation(this.program,"u_saturation"),this.pointers.u_masking=this.gl.getUniformLocation(this.program,"u_masking"),this.pointers.u_dehaze=this.gl.getUniformLocation(this.program,"u_dehaze"),this.pointers.u_atmosferic_light=this.gl.getUniformLocation(this.program,"u_atmosferic_light"),this.pointers.u_temptint=this.gl.getUniformLocation(this.program,"u_temptint[0]"),this.pointers.u_bAndW=this.gl.getUniformLocation(this.program,"u_bAndW"),this.pointers.u_hdr=this.gl.getUniformLocation(this.program,"u_hdr"),this.pointers.u_rotation=this.gl.getUniformLocation(this.program,"u_rotation"),this.pointers.u_scale=this.gl.getUniformLocation(this.program,"u_scale"),this.pointers.u_translate=this.gl.getUniformLocation(this.program,"u_translate"),this.pointers.u_lut=this.gl.getUniformLocation(this.program,"u_lut"),this.gl.activeTexture(this.gl.TEXTURE1),_(this.gl),this.gl.viewport(0,0,this.WIDTH,this.HEIGHT),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT),e||this.update()},t.prototype.update=function(){this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.ALPHA,256,1,0,this.gl.ALPHA,this.gl.UNSIGNED_BYTE,new Uint8Array(this.LIGHT_MATCH)),this.gl.useProgram(this.program),this.gl.enableVertexAttribArray(this.pointers.positionLocation),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.pointers.positionBuffer),this.gl.vertexAttribPointer(this.pointers.positionLocation,2,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(this.pointers.texcoordLocation),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.pointers.texcoordBuffer),this.gl.vertexAttribPointer(this.pointers.texcoordLocation,2,this.gl.FLOAT,!1,0,0),this.gl.uniform2f(this.pointers.resolutionLocation,this.WIDTH,this.HEIGHT),this.gl.uniform2f(this.pointers.textureSizeLocation,this.WIDTH,this.HEIGHT),this.gl.uniform1f(this.pointers.u_brightness,this.params.brightness),this.gl.uniform1f(this.pointers.u_contrast,this.params.contrast),this.gl.uniform1f(this.pointers.u_exposure,this.params.exposure),this.gl.uniform1f(this.pointers.u_contrast,this.params.contrast),this.gl.uniform1f(this.pointers.u_saturation,this.params.saturation),this.gl.uniform1f(this.pointers.u_masking,this.params.masking),this.gl.uniform1f(this.pointers.u_dehaze,this.params.dehaze),this.gl.uniform1f(this.pointers.u_atmosferic_light,this.params.atmosferic_light),this.gl.uniform3fv(this.pointers.u_temptint,this.uniforms.temptint.concat(o(n({x:360*this.params.lightColor,y:this.params.lightSat,z:this.params.lightFill}))).concat(o(n({x:360*this.params.darkColor,y:this.params.darkSat,z:this.params.darkFill})))),this.gl.uniform1f(this.pointers.u_bAndW,this.params.bAndW),this.gl.uniform1f(this.pointers.u_hdr,this.params.hdr);var t=this.get2dRotation();this.gl.uniform2f(this.pointers.u_rotation,t.x,t.y),this.gl.uniform2f(this.pointers.u_scale,this.params.scale.x,this.params.scale.y),this.gl.uniform2f(this.pointers.u_translate,this.params.translate.x,this.params.translate.y),this.gl.uniform1i(this.pointers.u_image,0),this.gl.uniform1i(this.pointers.u_lut,1),this.gl.uniform1fv(this.pointers.kernelLocation,this.uniforms.kernel),this.gl.uniform1f(this.pointers.kernelWeightLocation,this.kernelNormalization(this.uniforms.kernel)),this.gl.drawArrays(this.gl.TRIANGLES,0,6)},t.prototype.setRectangle=function(t,e,i,r){var n=t,o=t+i,a=e,s=e+r;this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([n,a,o,a,n,s,n,s,o,a,o,s]),this.gl.STATIC_DRAW)},t}();function g(t,e,i){var r=t.createShader(e);if(t.shaderSource(r,i),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))return r;t.deleteShader(r)}function _(t){var e=t.createTexture();return t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),e}})(),RextEditor=e})();