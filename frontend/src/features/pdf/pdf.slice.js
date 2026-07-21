import { createSlice } from '@reduxjs/toolkit';

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: {
        documents: {},
        documentsLoading: false,
        selectedDocumentId: null,
        uploadStatus: 'idle', // idle | uploading | success | error
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
    setUploadError,
} = pdfSlice.actions
export default pdfSlice.reducer
