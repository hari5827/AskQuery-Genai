import { createSlice } from '@reduxjs/toolkit';

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: {
        documents: {},
        documentsLoading: false,
        selectedDocumentId: null,
        uploadStatus: 'idle', // idle | uploading | processing | success | error
        uploadProgress: 0,
        uploadStageText: '',
        uploadError: null,
    },
    reducers: {
        setDocuments: (state, action) => {
            state.documents = action.payload
        },
        removeDocument: (state, action) => {
            const documentId = action.payload
            delete state.documents[documentId]
            if (state.selectedDocumentId === documentId) {
                state.selectedDocumentId = null
            }
        },
        setDocumentsLoading: (state, action) => {
            state.documentsLoading = action.payload
        },
        setSelectedDocument: (state, action) => {
            state.selectedDocumentId = action.payload
        },
        clearSelectedDocument: (state) => {
            state.selectedDocumentId = null
        },
        setUploadStatus: (state, action) => {
            state.uploadStatus = action.payload
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload
        },
        setUploadStageText: (state, action) => {
            state.uploadStageText = action.payload
        },
        setUploadError: (state, action) => {
            state.uploadError = action.payload
        },
    }
})

export const {
    setDocuments,
    removeDocument,
    setDocumentsLoading,
    setSelectedDocument,
    clearSelectedDocument,
    setUploadStatus,
    setUploadProgress,
    setUploadStageText,
    setUploadError,
} = pdfSlice.actions
export default pdfSlice.reducer
