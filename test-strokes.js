const hanja = require('hanja');
try {
    const lib = hanja.default || hanja;
    if (lib.getStrokes) {
        console.log("Strokes for '家':", lib.getStrokes('家'));
        console.log("Strokes for '金':", lib.getStrokes('金'));
    } else {
        console.log("getStrokes missing");
    }
} catch (e) {
    console.error(e);
}
