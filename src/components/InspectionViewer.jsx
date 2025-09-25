import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

function InspectionsViewer() {
  const [data, setData] = useState(null);
  const [expandedInspections, setExpandedInspections] = useState({});
  const [loadingAuditId, setLoadingAuditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/inspection-items');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInspections();
  }, []);


  const items = Array.isArray(data?.data) ? data.data : [];
  const uniqueAuditItems = Object.values(
    items.reduce((acc, item) => {
      if (item.audit_id && !acc[item.audit_id]) {
        acc[item.audit_id] = item;
      }
      return acc;
    }, {})
  );

  const toggleInspectionDetails = async (auditId) => {
    if (expandedInspections[auditId]) {
      setExpandedInspections(prev => {
        const newState = { ...prev };
        delete newState[auditId];
        return newState;
      });
      return;
    }

    // show spinner
    setLoadingAuditId(auditId);

    try {
      const res = await fetch(`http://localhost:8000/api/inspection/${auditId}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      setExpandedInspections(prev => ({
        ...prev,
        [auditId]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch inspection:", error);
    } finally {
      setLoadingAuditId(null);
    }
  };

  if (loading) return <p style={{ color: 'white' }}><LoadingSpinner />.</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!uniqueAuditItems.length) return <p style={{ color: 'white' }}>No inspections found.</p>;

  return (
    <div style={{ marginLeft: "24px" }}>
      <h2 style={{ color: 'white' }}>Inspections Data Feed (Unique Inspections)</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {uniqueAuditItems.map((item) => {
          const auditId = item.audit_id;

          return (
            <li key={auditId} style={{ marginBottom: '1rem' }}>
              <div>
                <button
                  onClick={() => toggleInspectionDetails(auditId)}
                  style={{
                    background: 'none',
                    border: '1px solid #32CD32',
                    borderRadius: '4px',
                    color: '#32CD32',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                  }}
                >
                  {auditId}
                </button>

              
                {loadingAuditId === auditId && <LoadingSpinner />}

        
                {expandedInspections[auditId] && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '1rem',
                      backgroundColor: '#1e272e',
                      color: 'white',
                      border: '1px solid #555',
                      borderRadius: '5px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    }}
                  >
                    <strong>Inspection Details:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                      {JSON.stringify(expandedInspections[auditId], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default InspectionsViewer;
