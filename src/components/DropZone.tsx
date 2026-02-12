import { useState, type FC } from 'react';
import { Upload } from 'lucide-react';
import '../styles/DropZone.css';

type DropZoneProps = {
  onFileSelect: (file: File) => Promise<void>;
  isLoading: boolean;
};

export const DropZone: FC<DropZoneProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await onFileSelect(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload size={40} color="#3182ce" className="dropzone-icon" />
      <h3 className="dropzone-title">Arraste seu arquivo Excel aqui</h3>
      <p className="dropzone-hint">ou clique para selecionar</p>
      <label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={isLoading}
          className="dropzone-input"
        />
        <span className={`dropzone-trigger ${isLoading ? 'disabled' : ''}`}>
          {isLoading ? 'Processando...' : 'Selecionar arquivo'}
        </span>
      </label>
      <p className="dropzone-formats">Formatos aceitos: .xlsx, .xls</p>
    </div>
  );
};
