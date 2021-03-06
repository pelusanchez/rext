export var defaultParams = {
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
    darkSat: 1
};
export var TEMP_DATA = [
    [0.6167426069865002, 0.017657981710823077],
    [0.5838624982041293, 0.06447754787874993],
    [0.5666570157784903, 0.1010769359975838],
    [0.5600215017846518, 0.13012054359808795],
    [0.5603460901328465, 0.15370282338343416],
    [0.5651414015638195, 0.1734071109259789],
    [0.5727157905223393, 0.19040417876076665],
    [0.5819305919306469, 0.20554787970182647],
    [0.5920253173976543, 0.219454396860673],
    [0.6024964973113273, 0.23256361077001078],
    [0.613014923688415, 0.2451851574423344],
    [0.6233694681448863, 0.2575325541865392],
    [0.633428991849502, 0.2697484189519574],
    [0.6431164873163056, 0.2819231700046263],
    [0.6523914777767198, 0.29410898225476145],
    [0.6612380004437802, 0.30633028466830314],
    [0.6696563786680246, 0.31859171532935343],
    [0.6776575761390952, 0.330884185957384],
    [0.6852593188363603, 0.34318952105568623],
    [0.6924834326806721, 0.3554840067292358],
    [0.6993540206164168, 0.36774109382812364],
    [0.705896221219359, 0.37993343721079975],
    [0.712135371070854, 0.3920344089104195],
    [0.7180964477199883, 0.4040191918024166],
    [0.7238037074478182, 0.41586553788423575],
    [0.7292804578150028, 0.42755425869079605],
    [0.7345489228275083, 0.43906950280216533],
    [0.7396301709912545, 0.4503988656030025],
    [0.7445440852278651, 0.4615333686006381],
    [0.7493093597375261, 0.47246733915721345],
    [0.7539435132044948, 0.4831982160881075],
    [0.7584629107855697, 0.4937263019887011],
    [0.7628827894765442, 0.5040544792219176],
    [0.7672172829757861, 0.5141879031216875],
    [0.7756812566990368, 0.5339005596070674],
    [0.7756812566990368, 0.5339005596070674],
    [0.7798336535847834, 0.5434985836882681],
    [0.7839465092903851, 0.552938802301879],
    [0.7880286368234596, 0.5622329533372938],
    [0.7920877696863722, 0.5713931712543325],
    [0.796130534601134, 0.5804317041849897],
    [0.8001624136045166, 0.5893606423074715],
    [0.8041876951180534, 0.5981916567442426],
    [0.8082094136732589, 0.6069357478075997],
    [0.8122292780585781, 0.6156030011340633],
    [0.8162475877574743, 0.624202350096731],
    [0.8202631376804659, 0.6327413428542148],
    [0.8242731113661302, 0.6412259124772712],
    [0.8282729630469863, 0.6496601487868902],
    [0.8322562892583072, 0.6580460708395705],
    [0.8362146910181553, 0.6663833994084263],
    [0.8401376280395388, 0.6746693293369075],
    [0.8440122669563406, 0.6828983022904387],
    [0.8478233261635671, 0.691061781205187],
    [0.8515529205921868, 0.6991480286361483],
    [0.8578515274860328, 0.7143328511178657],
    [0.8630349166004683, 0.7236145588845],
    [0.8630349166004683, 0.7236145588845],
    [0.8678866519883774, 0.7326305266929798],
    [0.8724265417351438, 0.7413920824039555],
    [0.8766746938112879, 0.7499106260961086],
    [0.8806514255414362, 0.7581975699581189],
    [0.8843771730729832, 0.7662642858505886],
    [0.8878724008449614, 0.7741220599147951],
    [0.8911575110568668, 0.7817820536219475],
    [0.8942527531374216, 0.7892552706795768],
    [0.8971781332133792, 0.7965525292390034],
    [0.9025975721615955, 0.8106613818669473],
    [0.9051296119968262, 0.8174934982533621],
    [0.9051296119968262, 0.8174934982533621],
    [0.9075675706910422, 0.8241906743465228],
    [0.9099288798932852, 0.8307625342003426],
    [0.912230184763394, 0.8372184337382709],
    [0.914487253441016, 0.8435674571884941],
    [0.9167148865142485, 0.8498184155292972],
    [0.9189268264883301, 0.8559798466723794],
    [0.9211356672547586, 0.862060017138353],
    [0.9233527635598611, 0.8680669250033681],
    [0.9278504028585166, 0.8798916280267886],
    [0.9301466448383797, 0.8857241176152066],
    [0.9324823592671754, 0.8915127453709542],
    [0.9348613471976668, 0.8972642431099969],
    [0.9348613471976668, 0.8972642431099969],
    [0.9372856273504615, 0.9029851088748369],
    [0.9397553455825536, 0.9086816143048344],
    [0.9422686843563701, 0.9143598121965675],
    [0.9448217722084058, 0.9200255441824128],
    [0.947408593218177, 0.925684448465339],
    [0.9500208964767429, 0.931341967556689],
    [0.9552772279767501, 0.9426736878435626],
    [0.9578927646784257, 0.9483578644262163],
    [0.9604766194871308, 0.954060621455171],
    [0.9630080085847714, 0.9597865363484674],
    [0.965463369977889, 0.9655400352277332],
    [0.965463369977889, 0.9655400352277332],
    [0.9678162729662736, 0.9713253997462401],
    [0.9700373276119754, 0.9771467737131783],
    [0.9720940942080452, 0.9830081695063213],
    [0.9739509927471266, 0.9889134742677088],
    [0.97556921239073, 0.9948664558790756],
    [0.9782396416593983, 1]
];