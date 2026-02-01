try {
    const hanjaTable = require('hanja/lib/data/hanjaeum.json');
    console.log("Loaded table keys count:", Object.keys(hanjaTable).length);
    console.log("Sample:", Object.keys(hanjaTable).slice(0, 5));

    // Test reversing
    const hangulToHanja = {};
    for (const [hanja, hangul] of Object.entries(hanjaTable)) {
        if (!hangulToHanja[hangul]) hangulToHanja[hangul] = [];
        hangulToHanja[hangul].push(hanja);
    }

    console.log("'홍' candidates:", hangulToHanja['홍']);
} catch (e) {
    console.error("Failed to load JSON:", e);
}
