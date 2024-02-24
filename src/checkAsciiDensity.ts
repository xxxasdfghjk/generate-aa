// import sharp from "sharp";
// /** asciiの密度でsort */
// const f = async () => {
//     const imageSize = 50;
//     const ASCIIS = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";
//     const map = {};
//     for (const text of ASCIIS.split("")) {
//         const escape = (() => {
//             switch (text) {
//                 case "&":
//                     return "&amp;";
//                 case "'":
//                     return "&apos;";
//                 case '"':
//                     return "&quot;";
//                 case ">":
//                     return "&gt;";
//                 case "<":
//                     return "&lt;";
//                 default:
//                     return text;
//             }
//         })();
//         const { data } = await sharp({
//             create: {
//                 width: imageSize,
//                 height: imageSize,
//                 channels: 4,
//                 background: { r: 255, g: 255, b: 255, alpha: 1 },
//             },
//         })
//             .clone()
//             .composite([
//                 {
//                     input: Buffer.from(
//                         `<svg width="${imageSize}" height="${imageSize}" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="80%" font-size="32" font-family="sans-serif" fill="black" text-anchor="middle">${escape}</text></svg>`
//                     ),
//                     left: 0,
//                     top: 0,
//                 },
//             ])
//             .grayscale()
//             .toBuffer({ resolveWithObject: true });
//         const pixelArray = new Uint8ClampedArray(data.buffer);
//         const sum = pixelArray.reduce((prev, cur) => prev + cur, 0);
//         // @ts-ignore
//         map[text] = sum;
//     }

//     const array = Object.entries(map)
//         .map(([str, sum]) => ({ str, sum }))
//         // @ts-ignore
//         .sort((a, b) => (a.sum as number) - (b.sum as number))
//         .map((e) => e.str)
//         .join("");
//     console.log(array);
// };
// f();
