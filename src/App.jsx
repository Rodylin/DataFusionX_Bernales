//Instructions on how to install and run located in the README.md
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import './App.css';
import jsPDF from 'jspdf';
import axios from 'axios';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [text, setText] = useState('');
  const [qrCodeURLs, setQRCodeURLs] = useState([]);
  const [csvContent, setCsvContent] = useState(null);
  const [csvContentText, setCsvContentText] = useState('');

  const qrCodeRefs = useRef([]);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/qrcodes');
      setQRCodeURLs(response.data);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const parsedData = Papa.parse(csvText, { header: true }).data;
      setCsvData(parsedData);
      setCsvContent(csvText);
      setCsvContentText(csvText);
    };
    reader.readAsText(file);
  };

  const generateQRCode = async () => {
    if (text.trim() !== '') {
      const qrCodeDataURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
      const newQRCode = { text, url: qrCodeDataURL };

      try {
        const response = await axios.post('http://localhost:3001/api/qrcodes', {
          text: newQRCode.text,
          qr_code_url: newQRCode.url
        });
        setQRCodeURLs([...qrCodeURLs, { id: response.data.insertId, ...newQRCode }]);
        setText('');
      } catch (error) {
        console.error('Error saving QR code:', error);
      }
    }
  };

  const deleteQRCode = async (index, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/qrcodes/${id}`);
      const updatedQRCodeURLs = qrCodeURLs.filter((_, i) => i !== index);
      setQRCodeURLs(updatedQRCodeURLs);
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const exportCSV = () => {
    const qrData = qrCodeURLs.map((qr) => ({
      Text: qr.text,
      QRCodeURL: qr.url
    }));
    const csvContent = Papa.unparse(qrData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'qr_codes.csv');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

    qrCodeRefs.current.forEach((ref, index) => {
      const qr = qrCodeURLs[index];
      if (ref) {
        const qrCanvas = ref.querySelector('canvas');
        if (qrCanvas) {
          const qrDataURL = qrCanvas.toDataURL('image/png');
          yPos += 10;
          doc.text(`QR Code: ${qr.text}`, 10, yPos);
          yPos += 10;
          doc.addImage(qrDataURL, 'PNG', 10, yPos, 50, 50);
          yPos += 60;
        }
      }
    });

    doc.save('document.pdf');
  };

  return (
    <div className="container">
      <h1>Task Management Toolkit</h1>
      <div className="section">
        <h2>CSV Operations</h2>
        <div className="input-container">
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
        </div>
        {csvContentText && (
          <div className="csv-contents">
            <h3>CSV Contents:</h3>
            <table className="csv-table">
              <thead>
                <tr>
                  {csvData.length > 0 && Object.keys(csvData[0]).map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="section">
        <h2>QR Code Operations</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter text for QR code"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="button" onClick={generateQRCode} disabled={!text.trim()}>Generate QR Code</button>
        </div>
        {qrCodeURLs.length > 0 && (
          <div className="qr-table-container">
            <h3>Generated QR Codes:</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Text</th>
                  <th>QR Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {qrCodeURLs.map((qr, index) => (
                  <tr key={index}>
                    <td>{qr.text}</td>
                    <td ref={el => qrCodeRefs.current[index] = el}>
                      <QRCode value={qr.text} />
                    </td>
                    <td>
                      <button className="button" onClick={() => deleteQRCode(index, qr.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="input-container">
          <button className="button" onClick={exportCSV}>Export CSV</button>
          <button className="button" onClick={generatePDF}>Generate PDF</button>
        </div>
      </div>
    </div>
  );
}

export default App;
