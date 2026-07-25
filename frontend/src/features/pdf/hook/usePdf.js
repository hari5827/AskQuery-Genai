import { useDispatch } from "react-redux";
import { uploadDocument, getDocuments, deleteDocument, addYoutubeVideo } from "../service/pdf.api";
import {
    setDocuments,
    removeDocument,
    setDocumentsLoading,
    setSelectedDocument,
    clearSelectedDocument,
    setUploadStatus,
    setUploadProgress,
    setUploadStageText,
    setUploadError,
    setAddingYoutube,
    setYoutubeError,
    setPendingManualTranscriptUrl,
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
                    sourceType: doc.sourceType || "pdf",
                    sourceUrl: doc.sourceUrl || null,
                }
                return acc
            }, {})))
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        } finally {
            dispatch(setDocumentsLoading(false))
        }
    }

    const PROCESSING_STAGES = ["Generating embeddings...", "Indexing in Pinecone..."]
    const PROCESSING_STAGE_MS = 1500
    const MIN_UPLOAD_DISPLAY_MS = 700

    async function handleUploadDocument(file) {
        dispatch(setUploadStatus("uploading"))
        dispatch(setUploadProgress(0))
        dispatch(setUploadStageText("Uploading PDF..."))
        dispatch(setUploadError(null))

        let stageInterval = null
        let stageIndex = 0
        let displayTicker = null
        let realPercent = 0
        let switchedToProcessing = false
        const startedAt = Date.now()

        const startProcessingStages = () => {
            if (switchedToProcessing) return
            switchedToProcessing = true
            clearInterval(displayTicker)
            dispatch(setUploadStatus("processing"))
            dispatch(setUploadStageText(PROCESSING_STAGES[0]))
            stageInterval = setInterval(() => {
                stageIndex = (stageIndex + 1) % PROCESSING_STAGES.length
                dispatch(setUploadStageText(PROCESSING_STAGES[stageIndex]))
            }, PROCESSING_STAGE_MS)
        }

        displayTicker = setInterval(() => {
            const elapsed = Date.now() - startedAt
            const timeCap = Math.min(100, Math.round((elapsed / MIN_UPLOAD_DISPLAY_MS) * 100))
            const shown = Math.min(realPercent, timeCap)
            dispatch(setUploadProgress(shown))
            if (shown >= 100) {
                startProcessingStages()
            }
        }, 30)

        try {
            await uploadDocument(file, (percent) => {
                realPercent = percent
            })

            clearInterval(displayTicker)
            clearInterval(stageInterval)
            dispatch(setUploadStageText("Ready!"))
            dispatch(setUploadStatus("success"))
            await handleGetDocuments()
        } catch (error) {
            clearInterval(displayTicker)
            clearInterval(stageInterval)
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
        dispatch(setUploadProgress(0))
        dispatch(setUploadStageText(""))
        dispatch(setUploadError(null))
    }

    async function handleAddYoutubeVideo(url, transcript) {
        dispatch(setAddingYoutube(true))
        dispatch(setYoutubeError(null))

        try {
            await addYoutubeVideo(url, transcript)
            dispatch(setPendingManualTranscriptUrl(null))
            await handleGetDocuments()
        } catch (error) {
            console.error("Failed to add YouTube video:", error)

            if (error?.response?.data?.needsManualTranscript) {
                dispatch(setPendingManualTranscriptUrl(url))
            } else {
                dispatch(setPendingManualTranscriptUrl(null))
            }

            dispatch(setYoutubeError(
                error?.response?.data?.message || "Couldn't add that video. Please try again."
            ))
        } finally {
            dispatch(setAddingYoutube(false))
        }
    }

    function handleResetYoutubeStatus() {
        dispatch(setYoutubeError(null))
    }

    function handleCancelManualTranscript() {
        dispatch(setPendingManualTranscriptUrl(null))
        dispatch(setYoutubeError(null))
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
        handleAddYoutubeVideo,
        handleResetYoutubeStatus,
        handleCancelManualTranscript,
        handleDeleteDocument,
        handleSelectDocument,
        handleDeselectDocument,
    }
}