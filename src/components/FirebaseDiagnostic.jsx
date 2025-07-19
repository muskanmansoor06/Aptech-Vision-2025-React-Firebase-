import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { checkFirebaseConnection } from '../../firebase';

function FirebaseDiagnostic() {
  const { user, userRole, userData, firebaseStatus } = useContext(UserContext);
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    connectionTest: 'pending',
    authStatus: 'checking',
    firestoreStatus: 'checking'
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('Running Firebase diagnostics...');
      
      // Test Firebase connection
      try {
        const isConnected = await checkFirebaseConnection();
        setDiagnosticInfo(prev => ({
          ...prev,
          connectionTest: isConnected ? 'success' : 'failed'
        }));
      } catch (error) {
        console.error('Connection test failed:', error);
        setDiagnosticInfo(prev => ({
          ...prev,
          connectionTest: 'failed'
        }));
      }

      // Check auth status
      setDiagnosticInfo(prev => ({
        ...prev,
        authStatus: user ? 'authenticated' : 'not_authenticated'
      }));

      // Check Firestore status
      setDiagnosticInfo(prev => ({
        ...prev,
        firestoreStatus: firebaseStatus
      }));
    };

    runDiagnostics();
  }, [user, firebaseStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'authenticated':
      case 'online':
        return '#28a745';
      case 'failed':
      case 'not_authenticated':
      case 'offline':
        return '#dc3545';
      case 'pending':
      case 'checking':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return '✅ Connected';
      case 'failed': return '❌ Failed';
      case 'authenticated': return '✅ Authenticated';
      case 'not_authenticated': return '❌ Not Authenticated';
      case 'online': return '✅ Online';
      case 'offline': return '❌ Offline';
      case 'pending':
      case 'checking': return '⏳ Checking...';
      default: return '❓ Unknown';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Firebase Diagnostic</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Connection: </span>
        <span style={{ color: getStatusColor(diagnosticInfo.connectionTest) }}>
          {getStatusText(diagnosticInfo.connectionTest)}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Auth: </span>
        <span style={{ color: getStatusColor(diagnosticInfo.authStatus) }}>
          {getStatusText(diagnosticInfo.authStatus)}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Firestore: </span>
        <span style={{ color: getStatusColor(diagnosticInfo.firestoreStatus) }}>
          {getStatusText(diagnosticInfo.firestoreStatus)}
        </span>
      </div>
      
      {user && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>User: </span>
          <span>{user.email}</span>
        </div>
      )}
      
      {userRole && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>Role: </span>
          <span>{userRole}</span>
        </div>
      )}
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          fontSize: '11px',
          cursor: 'pointer',
          marginTop: '5px'
        }}
      >
        Refresh
      </button>
    </div>
  );
}

export default FirebaseDiagnostic; 