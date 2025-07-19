import React, { useState } from 'react';

function FirebaseTroubleshooter() {
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  const troubleshootingSteps = [
    {
      title: "1. Check Firestore Database",
      description: "Make sure Firestore Database is enabled in your Firebase console",
      steps: [
        "Go to Firebase Console (https://console.firebase.google.com/)",
        "Select your project: almahub-86893",
        "Click on 'Firestore Database' in the left sidebar",
        "If not created, click 'Create Database'",
        "Choose 'Start in test mode' for development"
      ]
    },
    {
      title: "2. Configure Security Rules",
      description: "Update Firestore security rules to allow read/write access",
      steps: [
        "In Firestore Database, go to 'Rules' tab",
        "Replace the rules with:",
        "rules_version = '2';",
        "service cloud.firestore {",
        "  match /databases/{database}/documents {",
        "    match /users/{userId} {",
        "      allow read, write: if request.auth != null && request.auth.uid == userId;",
        "    }",
        "  }",
        "}",
        "Click 'Publish'"
      ]
    },
    {
      title: "3. Check Network Connection",
      description: "Ensure you have a stable internet connection",
      steps: [
        "Check your internet connection",
        "Try refreshing the page",
        "Clear browser cache and cookies",
        "Try using a different browser"
      ]
    },
    {
      title: "4. Verify Firebase Config",
      description: "Ensure the Firebase configuration is correct",
      steps: [
        "Check that the project ID matches: almahub-86893",
        "Verify API key is correct",
        "Ensure all required services are enabled"
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowTroubleshooter(!showTroubleshooter)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#ff6b6b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '12px'
        }}
      >
        {showTroubleshooter ? 'Hide' : 'Show'} Troubleshooter
      </button>

      {showTroubleshooter && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1001,
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>Firebase Troubleshooting Guide</h2>
            <button
              onClick={() => setShowTroubleshooter(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Common Issues:</strong>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>400 Bad Request errors</li>
              <li>Firestore connection failures</li>
              <li>Authentication issues</li>
              <li>Permission denied errors</li>
            </ul>
          </div>

          {troubleshootingSteps.map((step, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>{step.title}</h3>
              <p style={{ margin: '0 0 15px 0', color: '#6c757d' }}>{step.description}</p>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                {step.steps.map((subStep, subIndex) => (
                  <li key={subIndex} style={{ marginBottom: '5px', color: '#495057' }}>
                    {subStep}
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => setShowTroubleshooter(false)}
              style={{
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FirebaseTroubleshooter; 