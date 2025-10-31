// Componente para upload de portfólio de trabalhos
import { useState, useCallback } from 'react';
import { FiUpload, FiX, FiImage, FiEye } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';
import perfil_sem_foto from '../../assets/perfil_sem_foto.png';

const PortfolioUpload = ({
  label = "Portfólio de Trabalhos",
  value = [],
  onChange,
  maxFiles = 16,
  maxSizeMB = 5,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      // Validar tamanho
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name}: Arquivo muito grande (máximo ${maxSizeMB}MB)`);
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Apenas imagens são permitidas`);
        return;
      }

      // Verificar limite
      if (value.length + validFiles.length >= maxFiles) {
        errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    if (validFiles.length > 0) {
      setUploading(true);
      
      // Simular upload (aqui você faria o upload real)
      Promise.all(
        validFiles.map((file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                url: e.target.result,
                size: file.size,
                type: file.type
              });
            };
            reader.readAsDataURL(file);
          });
        })
      ).then(newFiles => {
        onChange([...value, ...newFiles]);
        setUploading(false);
      });
    }
  }, [value, maxFiles, maxSizeMB, onChange]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileId) => {
    onChange(value.filter(file => file.id !== fileId));
  }, [value, onChange]);

  // Função para abrir modal de visualização
  const handleViewImage = useCallback((file) => {
    setSelectedImage(file);
    setShowModal(true);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-gray-500 text-xs ml-2">
          (Máximo {maxFiles} arquivos, {maxSizeMB}MB cada)
        </span>
      </label>

      {/* Área de upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-[#19506e] bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || value.length >= maxFiles}
        />
        
        <div className="space-y-2">
          {uploading ? (
            <LoadingSpinner size="lg" color="blue" />
          ) : (
            <FiUpload className="w-8 h-8 text-gray-400 mx-auto" />
          )}
          
          <div>
            <p className="text-sm text-gray-600">
              {uploading 
                ? 'Enviando arquivos...' 
                : 'Arraste imagens aqui ou clique para selecionar'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF até {maxSizeMB}MB cada
            </p>
          </div>
        </div>
      </div>

      {/* Lista de arquivos */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {value.map((file, index) => (
            <div key={file.id || `file-${index}-${file.name}`} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = perfil_sem_foto;
                    e.target.alt = "Imagem não disponível";
                  }}
                />
              </div>
              
              {/* Overlay com ações */}
              <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewImage(file)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Visualizar"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                    title="Remover"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Nome do arquivo */}
              <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      <div className="text-sm text-gray-500">
        {value.length} de {maxFiles} arquivos enviados
      </div>

      {/* Modal de visualização */}
      {showModal && selectedImage && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop translúcido + blur leve */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setShowModal(false)}
          />
          {/* Painel */}
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-3 -right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
                aria-label="Fechar visualização"
              >
                <FiX className="w-6 h-6 text-gray-700" />
              </button>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {selectedImage.name}
                </h3>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = perfil_sem_foto;
                    e.target.alt = "Imagem não disponível";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioUpload;