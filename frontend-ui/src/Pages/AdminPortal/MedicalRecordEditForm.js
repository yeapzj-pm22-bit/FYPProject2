// MedicalRecordEditForm.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';

const MedicalRecordEditForm = () => {
  // Prefilled values for editing
  const [diagnosis, setDiagnosis] = useState('Fever and cough');
  const [prescriptions, setPrescriptions] = useState([
    {
      medicine: 'Paracetamol',
      quantity: '10',
      instruction: 'Take 1 tablet every 6 hours after meals',
      refill: true,
      refillCount: '2',
      timeUnit: 'day',
      duration: '5',
    },
  ]);
  const [uploadedImages, setUploadedImages] = useState([
    {
      src: 'https://via.placeholder.com/100', // example placeholder image
      description: 'Chest X-ray',
    },
  ]);
const [editingIndex, setEditingIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newPrescription, setNewPrescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [instruction, setInstruction] = useState('');
  const [refillChecked, setRefillChecked] = useState(false);
  const [refillCount, setRefillCount] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const [duration, setDuration] = useState('');

  const [showModal2, setShowModal2] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDescription, setImageDescription] = useState('');


  const removeImage = (index) => {
    const updated = [...uploadedImages];
    updated.splice(index, 1);
    setUploadedImages(updated);
  };

    const handleEditPrescription = (index) => {
      const item = prescriptions[index];
      setNewPrescription(item.medicine);
      setQuantity(item.quantity);
      setInstruction(item.instruction);
      setRefillChecked(item.refill);
      setRefillCount(item.refillCount || '');
      setTimeUnit(item.timeUnit || '');
      setDuration(item.duration || '');
      setEditingIndex(index);
      setShowModal(true);
    };
const handleUpload = () => {
  if (selectedFile && selectedFile.length > 0) {
    const filesArray = Array.from(selectedFile);
    const newUploads = [];

    let loaded = 0;

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newUploads.push({
          src: reader.result,
          description: imageDescription
        });

        loaded++;
        if (loaded === filesArray.length) {
          setUploadedImages((prev) => [...prev, ...newUploads]);
          setShowModal2(false);
          setSelectedFile(null);
          setImageDescription('');
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

  const addPrescription = () => {
    const newItem = {
      medicine: newPrescription,
      quantity,
      instruction,
      refill: refillChecked,
      refillCount,
      timeUnit,
      duration
    };

    let updatedPrescriptions = [...prescriptions];

    if (editingIndex !== null) {
      updatedPrescriptions[editingIndex] = newItem;
    } else {
      updatedPrescriptions.push(newItem);
    }

    setPrescriptions(updatedPrescriptions);

    // Reset modal state
    setEditingIndex(null);
    setNewPrescription('');
    setQuantity('');
    setInstruction('');
    setRefillChecked(false);
    setRefillCount('');
    setTimeUnit('');
    setDuration('');
    setShowModal(false);
  };

  const removePrescription = (index) => {
    const updated = [...prescriptions];
    updated.splice(index, 1);
    setPrescriptions(updated);
  };

  return (
    <div className="container-fluid">
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Create Medical Record</h2>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <form className="p-4 border rounded shadow bg-white">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label>Patient</label>
              <select className="form-control">
                <option value="">-- Select Patient --</option>
                <option value="patient1">John Doe</option>
                <option value="patient2">Jane Smith</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Diagnosis</label>
              <textarea
                className="form-control"
                placeholder="Enter diagnosis"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></textarea>
            </div>

            <div className="col-md-12">
              <label>Prescriptions</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {prescriptions.map((item, idx) => (
                  <div
                    key={idx}
                    className="badge bg-secondary d-flex align-items-center px-3 py-2"
                    style={{ borderRadius: '25px', cursor: 'pointer' }}
                    onClick={() => handleEditPrescription(idx)}
                  >
                    {item.medicine}
                    <FaTimes
                      className="ms-2"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePrescription(idx);
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px' }}
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Medical Image</label>
                    <div
                      className="d-flex align-items-center gap-2 border rounded p-2"
                      style={{ cursor: 'pointer', height: '45px' }}
                      onClick={() => setShowModal2(true)}
                    >
                      <FaPlus className="text-primary" />
                      <span>Add Image</span>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="d-flex flex-wrap gap-3 mt-3">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="position-relative">
                            <img
                              src={img.src}
                              alt="Medical"
                              className="img-thumbnail"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ borderRadius: '60%', padding: '0.25rem 0.5rem' }}
                              onClick={() => removeImage(idx)}
                            >
                              ×
                            </button>
                            {img.description && (
                              <small className="d-block text-muted text-center mt-1" style={{ maxWidth: '100px' }}>
                                {img.description}
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                          {/* Upload Modal */}
                                <Modal show={showModal2} onHide={() => setShowModal2(false)}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>Upload Medical Image</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <input
                                      type="file"
                                      className="form-control mb-3"
                                      multiple
                                      onChange={(e) => setSelectedFile(e.target.files)}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter image description"
                                      value={imageDescription}
                                      onChange={(e) => setImageDescription(e.target.value)}
                                    />
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal2(false)}>
                                      Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
                                      Upload
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success px-4">
                Submit Record
              </button>
            </div>
          </div>
        </form>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
                <label>Medicine</label>
                <select
                  className="form-control"
                  value={newPrescription}
                  onChange={(e) => setNewPrescription(e.target.value)}
                >
                  <option value="">-- Select Medicine --</option>
                  <option value="Paracetamol">Paracetamol</option>
                  <option value="Amoxicillin">Amoxicillin</option>
                  <option value="Ibuprofen">Ibuprofen</option>
                  <option value="Metformin">Metformin</option>
                  {/* Add more medicines here as needed */}
                </select>
          </div>

          <div className="mb-3">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Medical Instruction</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter medical instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            ></textarea>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="refillCheck"
              checked={refillChecked}
              onChange={(e) => setRefillChecked(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="refillCheck">
              Enable Refill
            </label>
          </div>

          {refillChecked && (
            <>
              <div className="mb-3">
                <label>Refill Count</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter refill count"
                  value={refillCount}
                  onChange={(e) => setRefillCount(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Time Unit</label>
                <select
                  className="form-control"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="">-- Select Time Unit --</option>
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Duration</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addPrescription}>
            Add / Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicalRecordEditForm;