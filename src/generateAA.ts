import { Image } from "image-js";
// ***default ascii Set "WM@QBGNROD&SE$Hm8Kg6ZU9%CwXAP0qpb3d52#VFaeh4koyYsTunzxJcL7>]<[?v{=}f1+j)(tIl^r|!i/~\"*;_-:',`. ";
const COLOR_SET = "WM@QBGNROD&SEHm8TunzxJ><?=f1+t^r|/~\";_-:',`. ";
const DEFAULT_WEIGHTED_MATRIX_MAP = [1, 0.25, 0.075, 0.005];
const DEFALUT_WEIGHT = 0.0005;

const pixelToChar = (num: number) => {
    return COLOR_SET[Math.floor((num / 255) * COLOR_SET.length) - 1] ?? COLOR_SET[0];
};

const generateAA = async (file: string | ArrayBuffer | Uint8Array, maxWidth: number) => {
    if (maxWidth <= 0) {
        throw new Error("invalid maxWidth parameter.");
    }
    let resultString = "";
    const sharpStream = await Image.load(file);
    const { width, height } = { width: sharpStream.width, height: sharpStream.height };

    const pixels = sharpStream.grey().getRGBAData();
    //@ts-ignore
    const minPixelValue = pixels.reduce((prev, cur) => Math.min(prev, cur), 100000000);
    //@ts-ignore
    const maxPixelValue = pixels.reduce((prev: number, cur: number) => Math.max(prev, cur), 0);

    const pixelArray = sharpStream
        .grey()
        .getRGBAData()
        .filter((_, i) => i % 4 === 0)
        .map((pixel) => ((pixel - minPixelValue) / (maxPixelValue - minPixelValue)) * 255);

    const scale = Math.ceil(width / maxWidth);
    for (let i = 0; i < Math.floor(height / (scale * 2)); i++) {
        for (let j = 0; j < Math.floor(width / scale); j++) {
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
