import generateAA from "../src/generateAA";
import path from "path";
const SAMPLE_IMAGE_NAME = "01.png";
const tryMaxWidths = [1, 2, 4, 8, 16, 32, 64, 128, 200, 256];
tryMaxWidths.forEach((width) => {
    generateAA(path.join(__dirname, `./../sample/${SAMPLE_IMAGE_NAME}`), width).then((e) => {
        console.log("\u001b[30m" + "\u001b[47m" + e + "\u001b[0m");
        console.log("====");
    });
});
