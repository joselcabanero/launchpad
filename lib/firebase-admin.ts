import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

let app: App

if (!getApps().length) {
    // Check if service account file exists or use GOOGLE_APPLICATION_CREDENTIALS
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json'

    app = initializeApp({
        credential: cert(serviceAccountPath),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
} else {
    app = getApps()[0] as App
}

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
