import { Image } from "image-js";
// ***default ascii Set "WM@QBGNROD&SE$Hm8Kg6ZU9%CwXAP0qpb3d52#VFaeh4koyYsTunzxJcL7>]<[?v{=}f1+j)(tIl^r|!i/~\"*;_-:',`. ";
const COLOR_SET = "WM@QBGNROD&SEHm8TunzxJ><?=f1+t^r|/~\";_-:',`. ";

const pixelToChar = (num: number) => {
    return COLOR_SET[Math.floor((num / 255) * COLOR_SET.length) - 1] ?? COLOR_SET[0];
};
type ResultType = {
    resultString: string;
    originImageWidth: number;
    originImageHeight: number;
    lineHeight: number;
    lineWidth: number;
};

const generateAA = async (
    file: string | ArrayBuffer | Uint8Array,
    maxWidth: number,
    colorSet?: string
): Promise<ResultType> => {
    if (maxWidth <= 0) {
        throw new Error("invalid maxWidth parameter.");
    }
    let resultString = "";
    const sharpStream = await Image.load(file);
    const colorset = colorSet && colorSet.length > 1 ? colorSet : COLOR_SET;
    const pixelToChar = (num: number) => {
        return colorset[Math.floor((num / 255) * colorset.length) - 1] ?? colorset[0];
    };

    const { width, height } = { width: sharpStream.width, height: sharpStream.height };
    const scale = maxWidth / width;
    const gray = sharpStream.resize({ factor: scale }).grey({ mergeAlpha: true });
    let minPixelValue = 999999999999;
    let maxPixelValue = -99999999999;
    const rawData = gray.getRGBAData();
    const pixelArray = [];
    let lineHeight = 0;
    // グレーは1チャンネルの値のみあれば十分
    for (let i = 0; i < rawData.length; i += 4) {
        maxPixelValue = Math.max(maxPixelValue, rawData[i]);
        minPixelValue = Math.min(minPixelValue, rawData[i]);
        pixelArray.push(rawData[i]);
    }
    for (let i = 0; i < gray.height / 2; i++) {
        for (let j = 0; j < gray.width; j++) {
            const a1 = pixelArray[j + 2 * i * gray.width];
            const a2 = pixelArray[j + (2 * i + 1) * gray.width];
            // コントラストストレッチ
            resultString += pixelToChar(
                ((a1 - minPixelValue) / (maxPixelValue - minPixelValue) +
                    (a2 - minPixelValue) / (maxPixelValue - minPixelValue)) *
                    127.5
            );
        }
        lineHeight += 1;
        resultString += "\n";
    }
    return { resultString, originImageWidth: width, originImageHeight: height, lineHeight, lineWidth: gray.width };
};

export default generateAA;
