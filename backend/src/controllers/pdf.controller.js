import { loadPDF } from "../services/pdf.service.js";
import { splitDocument } from "../utils/splitDocument.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const docs = await loadPDF(req.file.path);
    const chunks = await splitDocument(docs);
    
    const vectors = await generateEmbeddings(chunks);
    console.log("Generated vectors:", vectors.length);
    const storedCount = await storeVectors(
    vectors,
    chunks,
    req.file.originalname
     );

       console.log(vectors.length);
      console.log(vectors[0].length);


    console.log(docs);
    console.log(chunks);
     console.log(chunks.length);

  return res.status(200).json({
  success: true,
  totalPages: docs.length,
  totalChunks: chunks.length,
   totalVectors: vectors.length,
    storedVectors: storedCount
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};