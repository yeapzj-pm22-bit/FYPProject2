import React, { useState } from 'react';
import { Calendar, FileText, Pill, Camera, Clock, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  // Sample data
  const appointments = [
    {
      appointID: 'APT001',
      bookingTitle: 'General Checkup',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-08-15',
      time: '10:00 AM',
      status: 'approved',
      hasRecord: true,
      recordId: 'REC001'
    },
    {
      appointID: 'APT002',
      bookingTitle: 'Follow-up Consultation',
      doctorName: 'Dr. Michael Chen',
      date: '2024-08-20',
      time: '2:30 PM',
      status: 'pending',
      hasRecord: false
    },
    {
      appointID: 'APT003',
      bookingTitle: 'Cardiology Consultation',
      doctorName: 'Dr. Emily Davis',
      date: '2024-08-10',
      time: '11:15 AM',
      status: 'rejected',
      hasRecord: false
    }
  ];

  const medicalRecords = [
    {
      recordId: 'REC001',
      appointID: 'APT001',
      date: '2024-08-15',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Mild hypertension, Vitamin D deficiency',
      instructions: 'Monitor blood pressure daily, increase physical activity to 30 minutes daily, maintain low-sodium diet, return for follow-up in 3 months.',
      prescriptions: [
        {
          medicine: 'Lisinopril 10mg',
          qty: 30,
          enableRefill: true,
          refillsLeft: 2,
          instructions: 'Take once daily in the morning'
        },
        {
          medicine: 'Vitamin D3 2000 IU',
          qty: 60,
          enableRefill: true,
          refillsLeft: 5,
          instructions: 'Take one capsule daily with food'
        },
        {
          medicine: 'Aspirin 81mg',
          qty: 90,
          enableRefill: false,
          refillsLeft: 0,
          instructions: 'Take once daily for cardiovascular protection'
        }
      ],
      images: [
        'https://via.placeholder.com/300x200/e3f2fd/1976d2?text=Blood+Test+Results',
        'https://via.placeholder.com/300x200/f3e5f5/7b1fa2?text=ECG+Report',
        'https://via.placeholder.com/300x200/e8f5e8/388e3c?text=X-Ray+Chest'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'rejected':
        return <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      case 'pending':
        return <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
      default:
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#6b7280' }} />;
    }
  };

  const handleRefillRequest = (medicine) => {
    alert(`Refill request submitted for ${medicine}`);
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="appointment-card">
      <div className="card-header">
        <div className="appointment-info">
          <h3 className="appointment-title">{appointment.bookingTitle}</h3>
          <p className="appointment-id">ID: {appointment.appointID}</p>
          <p className="doctor-name">Dr. {appointment.doctorName}</p>
        </div>
        <div className="status-container">
          {getStatusIcon(appointment.status)}
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="appointment-details">
        <div className="detail-item">
          <Calendar style={{ width: '16px', height: '16px' }} />
          <span>{appointment.date}</span>
        </div>
        <div className="detail-item">
          <Clock style={{ width: '16px', height: '16px' }} />
          <span>{appointment.time}</span>
        </div>
      </div>

      {appointment.hasRecord && (
        <button
          onClick={() => setSelectedRecord(medicalRecords.find(r => r.recordId === appointment.recordId))}
          className="view-record-btn"
        >
          <FileText style={{ width: '16px', height: '16px' }} />
          <span>View Medical Record</span>
        </button>
      )}
    </div>
  );

  const MedicalRecordModal = ({ record, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Medical Record</h2>
            <div className="record-info">
              <p>Record ID: {record.recordId} | Appointment: {record.appointID}</p>
              <p>Date: {record.date} | Doctor: {record.doctorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {/* Diagnosis */}
          <div className="section">
            <h3 className="section-title">
              <FileText style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px' }} />
              Diagnosis
            </h3>
            <div className="diagnosis-box">
              <p>{record.diagnosis}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="section">
            <h3 className="section-title">
              <AlertCircle style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px' }} />
              Instructions
            </h3>
            <div className="instructions-box">
              <p>{record.instructions}</p>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="section">
            <h3 className="section-title">
              <Pill style={{ width: '20px', height: '20px', color: '#8b5cf6', marginRight: '8px' }} />
              Prescriptions ({record.prescriptions.length} medications)
            </h3>
            <div className="prescriptions-grid">
              {record.prescriptions.map((prescription, index) => (
                <div key={index} className="prescription-card">
                  <div className="prescription-header">
                    <div>
                      <h4 className="medicine-name">{prescription.medicine}</h4>
                      <p className="medicine-instructions">{prescription.instructions}</p>
                    </div>
                    <div className="prescription-details">
                      <p>Qty: {prescription.qty}</p>
                      {prescription.enableRefill && (
                        <p className="refills-left">Refills left: {prescription.refillsLeft}</p>
                      )}
                    </div>
                  </div>

                  {prescription.enableRefill && prescription.refillsLeft > 0 ? (
                    <button
                      onClick={() => handleRefillRequest(prescription.medicine)}
                      className="refill-btn"
                    >
                      <RefreshCw style={{ width: '16px', height: '16px' }} />
                      <span>Request Refill</span>
                    </button>
                  ) : (
                    <div className="no-refill">
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      <span>No refills available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          {record.images && record.images.length > 0 && (
            <div className="section">
              <h3 className="section-title">
                <Camera style={{ width: '20px', height: '20px', color: '#f97316', marginRight: '8px' }} />
                Medical Images ({record.images.length} files)
              </h3>
              <div className="images-grid">
                {record.images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={image}
                      alt={`Medical image ${index + 1}`}
                      className="medical-image"
                      onClick={() => setImageModal(image)}
                    />
                    <div className="image-overlay">
                      <button
                        onClick={() => setImageModal(image)}
                        className="image-btn"
                      >
                        <Download style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ImageModal = ({ image, onClose }) => (
    <div className="image-modal-overlay">
      <div className="image-modal-content">
        <button onClick={onClose} className="image-close-btn">×</button>
        <img src={image} alt="Medical image" className="full-image" />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background-color: #f9fafb;
          color: #374151;
          line-height: 1.5;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .main-title {
          font-size: 30px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 32px;
        }

        .tab-navigation {
          display: flex;
          background-color: #e5e7eb;
          padding: 4px;
          border-radius: 8px;
          width: fit-content;
          margin-bottom: 32px;
        }

        .tab-btn {
          padding: 8px 24px;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }

        .tab-btn.active {
          background-color: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tab-btn:not(.active) {
          color: #4b5563;
        }

        .tab-btn:not(.active):hover {
          color: #1f2937;
        }

        .section-title-main {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .appointment-card, .record-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin-bottom: 16px;
          border-left: 4px solid #3b82f6;
        }

        .record-card {
          border-left-color: #10b981;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .appointment-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .appointment-id, .doctor-name {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .status-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-approved {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-rejected {
          background-color: #fecaca;
          color: #991b1b;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .appointment-details {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 14px;
        }

        .view-record-btn, .refill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #3b82f6;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
        }

        .view-record-btn:hover {
          background-color: #2563eb;
        }

        .record-card .view-record-btn {
          background-color: #10b981;
        }

        .record-card .view-record-btn:hover {
          background-color: #059669;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 1024px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .record-info {
          margin-top: 8px;
          color: #6b7280;
          font-size: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #374151;
        }

        .modal-body {
          padding: 24px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }

        .diagnosis-box {
          background-color: #eff6ff;
          padding: 16px;
          border-radius: 8px;
        }

        .instructions-box {
          background-color: #f0fdf4;
          padding: 16px;
          border-radius: 8px;
        }

        .prescriptions-grid {
          display: grid;
          gap: 16px;
        }

        .prescription-card {
          background-color: #faf5ff;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e9d5ff;
        }

        .prescription-header {
          display: flex;
          justify-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .medicine-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .medicine-instructions {
          font-size: 14px;
          color: #6b7280;
        }

        .prescription-details {
          text-align: right;
          font-size: 14px;
        }

        .refills-left {
          color: #059669;
        }

        .refill-btn {
          background-color: #10b981;
          font-size: 14px;
          padding: 8px 12px;
        }

        .refill-btn:hover {
          background-color: #059669;
        }

        .no-refill {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 14px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .image-container {
          position: relative;
          group: image;
        }

        .medical-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .medical-image:hover {
          opacity: 0.8;
        }

        .image-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-container:hover .image-overlay {
          opacity: 1;
        }

        .image-btn {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-btn:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .image-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
        }

        .image-modal-content {
          position: relative;
          max-width: 1024px;
          max-height: 90vh;
        }

        .image-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
        }

        .image-close-btn:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .full-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px 8px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
          }

          .appointment-details {
            flex-direction: column;
            gap: 8px;
          }

          .prescription-header {
            flex-direction: column;
            gap: 8px;
          }

          .images-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="container">
          <h1 className="main-title">Patient Dashboard</h1>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            >
              Medical Records
            </button>
          </div>

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="section-title-main">My Appointments</h2>
              <div>
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.appointID} appointment={appointment} />
                ))}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div>
              <h2 className="section-title-main">Medical Records</h2>
              <div>
                {medicalRecords.map((record) => (
                  <div key={record.recordId} className="record-card">
                    <div className="card-header">
                      <div className="appointment-info">
                        <h3 className="appointment-title">Medical Record #{record.recordId}</h3>
                        <p className="appointment-id">Appointment: {record.appointID}</p>
                        <p className="doctor-name">Dr. {record.doctorName}</p>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        {record.date}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontWeight: '500', color: '#374151' }}>Diagnosis:</p>
                      <p style={{ color: '#6b7280' }}>{record.diagnosis}</p>
                    </div>

                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="view-record-btn"
                    >
                      <FileText style={{ width: '16px', height: '16px' }} />
                      <span>View Full Record</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Record Modal */}
          {selectedRecord && (
            <MedicalRecordModal
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          )}

          {/* Image Modal */}
          {imageModal && (
            <ImageModal
              image={imageModal}
              onClose={() => setImageModal(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;