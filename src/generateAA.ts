import sharp from "sharp";
// ***default ascii Set "WM@QBGNROD&SE$Hm8Kg6ZU9%CwXAP0qpb3d52#VFaeh4koyYsTunzxJcL7>]<[?v{=}f1+j)(tIl^r|!i/~\"*;_-:',`. ";
const COLOR_SET = "WM@QBGNROD&SEHm8TunzxJ><?=f1+t^r|/~\";_-:',`. ";
const DEFAULT_WEIGHTED_MATRIX_MAP = [1, 0.25, 0.075, 0.005];
const DEFALUT_WEIGHT = 0.0005;

const pixelToChar = (num: number) => {
    return COLOR_SET[Math.floor((num / 255) * COLOR_SET.length) - 1] ?? COLOR_SET[0];
};

const generateAA = async (file: string, maxWidth: number) => {
    if (maxWidth <= 0) {
        throw new Error("invalid maxWidth parameter.");
    }
    let resultString = "";
    const sharpStream = sharp(file);
    const { data, info } = await sharpStream
        .clone()
        .grayscale()
        .linear(1, 0)
        .normalise()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const scale = Math.ceil(width / maxWidth);
    const pixelArray = new Uint8ClampedArray(data.buffer);
    for (let i = 0; i < height / (scale * 2); i++) {
        for (let j = 0; j < width / scale; j++) {
            let sum = 0;
            let count = 0;
            for (let k = 0; k < scale * 2; k++) {
                for (let l = 0; l < scale; l++) {
                    const index = Math.floor(j * scale + (2 * scale * i + k - scale) * width + l - scale / 2);
                    const weight =
                        DEFAULT_WEIGHTED_MATRIX_MAP[Math.abs(k - scale) + Math.abs(Math.round((2 * l - scale) / 2))] ??
                        DEFALUT_WEIGHT;
                    if (pixelArray[index] !== undefined) count += weight;
                    sum += pixelArray[index] ? pixelArray[index] * weight : 0;
                }
            }
            resultString += pixelToChar(sum / count);
        }
        resultString += "\n";
    }
    return resultString;
};

export default generateAA;
