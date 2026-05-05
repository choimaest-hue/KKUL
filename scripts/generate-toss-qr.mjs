import QRCode from "qrcode";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../public/toss-qr.png");

await QRCode.toFile(outPath, "supertoss://send?bank=웰컴저축은행&accountNo=06601213519539", {
  type: "png",
  width: 400,
  margin: 2,
  color: { dark: "#000000", light: "#ffffff" },
  errorCorrectionLevel: "H",
});

console.log("toss-qr.png generated:", outPath);
