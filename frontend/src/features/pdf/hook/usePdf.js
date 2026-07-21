import { useDispatch } from "react-redux";
import { uploadDocument, getDocuments, deleteDocument } from "../service/pdf.api";
import {
    setDocuments,
    removeDocument,
    setDocumentsLoading,
    setSelectedDocument,
    clearSelectedDocument,
    setUploadStatus,
    setUploadError,
} from "../pdf.slice";

export const usePdf = () => {

    const dispatch = useDispatch()

    async function handleGetDocuments() {
        dispatch(setDocumentsLoading(true))
        try {
            const data = await getDocuments()
            const { documents } = data
            dispatch(setDocuments(documents.reduce((acc, doc) => {
                acc[doc._id] = {
                    id: doc._id,
                    originalName: doc.originalName,
                    status: doc.status,
                    createdAt: doc.createdAt,
                }
                return acc
            }, {})))
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        } finally {
            dispatch(setDocumentsLoading(false))
        }
    }

    async function handleUploadDocument(file) {
        dispatch(setUploadStatus("uploading"))
        dispatch(setUploadError(null))
        try {
            await uploadDocument(file)
            dispatch(setUploadStatus("success"))
            await handleGetDocuments()
        } catch (error) {
            console.error("Failed to upload document:", error)
            dispatch(setUploadStatus("error"))
            dispatch(setUploadError(error?.response?.data?.message || "Upload failed. Please try again."))
        }
    }

    function handleInvalidFile(message) {
        dispatch(setUploadStatus("error"))
        dispatch(setUploadError(message))
    }

    function handleResetUploadStatus() {
        dispatch(setUploadStatus("idle"))
        dispatch(setUploadError(null))
    }

    async function handleDeleteDocument(documentId) {
        await deleteDocument(documentId)
        dispatch(removeDocument(documentId))
    }

    function handleSelectDocument(documentId) {
        dispatch(setSelectedDocument(documentId))
    }

    function handleDeselectDocument() {
        dispatch(clearSelectedDocument())
    }

    return {
        handleGetDocuments,
        handleUploadDocument,
        handleInvalidFile,
        handleResetUploadStatus,
        handleDeleteDocument,
        handleSelectDocument,
        handleDeselectDocument,
    }
}
