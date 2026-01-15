import React, { useState, useEffect } from 'react';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocumentPreviewProps {
  file: File | { name: string; url: string; type: string };
  onClose: () => void;
  onDownload?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  onClose,
  onDownload
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPreview = async () => {
      try {
        let url = '';
        
        if (file instanceof File) {
          url = URL.createObjectURL(file);
        } else if ('url' in file) {
          url = file.url;
        }

        setPreviewUrl(url);
        setError('');
      } catch (err) {
        setError('Failed to load document preview');
        console.error('Preview error:', err);
      }
    };

    loadPreview();

    return () => {
      if (previewUrl && file instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const isPDF = file instanceof File 
    ? file.type === 'application/pdf' 
    : file.type === 'PDF' || file.name.toLowerCase().endsWith('.pdf');

  const isImage = file instanceof File
    ? file.type.startsWith('image/')
    : file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif)$/i.test(file.name);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 border-b border-gray-700">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText size={20} className="text-white flex-shrink-0" />
          <h2 className="text-white font-medium truncate">
            {file instanceof File ? file.name : file.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </Button>
            <span className="text-white text-sm px-2 min-w-[60px] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </Button>
          </div>

          {/* Rotate */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="text-white hover:bg-white/20"
            aria-label="Rotate"
          >
            <RotateCw size={18} />
          </Button>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white hover:bg-white/20"
            aria-label="Reset view"
          >
            Reset
          </Button>

          {/* Download */}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="text-white hover:bg-white/20"
              leftIcon={<Download size={18} />}
            >
              Download
            </Button>
          )}

          {/* Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-900 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="flex items-center justify-center min-h-full">
            {isPDF ? (
              <iframe
                src={previewUrl}
                className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-2xl"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                }}
                title="PDF Preview"
              />
            ) : isImage ? (
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                }}
              />
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-2xl max-w-4xl">
                <div className="text-center">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Document Preview
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Preview not available for this file type
                  </p>
                  <p className="text-sm text-gray-500">
                    {file instanceof File ? file.name : file.name}
                  </p>
                  {onDownload && (
                    <Button
                      onClick={onDownload}
                      className="mt-4"
                      leftIcon={<Download size={18} />}
                    >
                      Download File
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
