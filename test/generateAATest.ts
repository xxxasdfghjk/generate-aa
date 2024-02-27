import generateAA from "../src/generateAA";
import path from "path";
const SAMPLE_IMAGE_NAME = "01.png";
const tryMaxWidths = [1, 2, 4, 8, 16, 32, 64, 128, 200, 201, 202, 203, 204];
tryMaxWidths.forEach((width) => {
    generateAA(path.join(__dirname, `./../sample/${SAMPLE_IMAGE_NAME}`), width).then(({ resultString }) => {
        console.log("\u001b[30m" + "\u001b[47m" + resultString + "\u001b[0m");
        console.log("====");
    });
});
