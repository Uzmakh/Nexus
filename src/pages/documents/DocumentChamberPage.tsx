import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, Upload, Download, Trash2, Share2, Video, Users, Eye, Edit, 
  Unlock, X, CheckCircle, Clock, FileCheck, PenTool, ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ESignaturePad } from '../../components/documents/ESignaturePad';
import { DocumentPreview } from '../../components/documents/DocumentPreview';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export type DocumentStatus = 'draft' | 'in_review' | 'signed';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: DocumentStatus;
  file?: File;
  url?: string;
  signature?: string;
  signedBy?: string;
  signedDate?: string;
}

const initialDocuments: Document[] = [
  {
    id: 1,
    name: 'Investment Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    status: 'draft',
    url: '#'
  },
  {
    id: 2,
    name: 'Partnership Contract.pdf',
    type: 'PDF',
    size: '1.8 MB',
    lastModified: '2024-02-10',
    status: 'in_review',
    url: '#'
  },
  {
    id: 3,
    name: 'NDA Agreement.pdf',
    type: 'PDF',
    size: '3.2 MB',
    lastModified: '2024-02-05',
    status: 'signed',
    signature: 'data:image/png;base64,...',
    signedBy: 'John Doe',
    signedDate: '2024-02-05',
    url: '#'
  }
];

const statusConfig = {
  draft: {
    label: 'Draft',
    variant: 'gray' as const,
    icon: FileText,
    color: 'text-gray-600'
  },
  in_review: {
    label: 'In Review',
    variant: 'warning' as const,
    icon: Clock,
    color: 'text-warning-600'
  },
  signed: {
    label: 'Signed',
    variant: 'success' as const,
    icon: CheckCircle,
    color: 'text-success-600'
  }
};

export const DocumentChamberPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId?: string }>();
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    documentId ? initialDocuments.find(d => d.id === parseInt(documentId)) || null : null
  );
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | { name: string; url: string; type: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const newDocument: Document = {
        id: Date.now(),
        name: file.name,
        type: file.type || 'PDF',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString().split('T')[0],
        status: 'draft',
        file: file
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      toast.success(`${file.name} uploaded successfully`);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handlePreview = (doc: Document) => {
    if (doc.file) {
      setPreviewFile(doc.file);
    } else if (doc.url) {
      setPreviewFile({ name: doc.name, url: doc.url, type: doc.type });
    }
    setShowPreview(true);
  };

  const handleSign = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSignaturePad(true);
  };

  const handleSaveSignature = (signatureData: string) => {
    if (selectedDocument) {
      const updatedDocuments = documents.map(doc =>
        doc.id === selectedDocument.id
          ? {
              ...doc,
              status: 'signed' as DocumentStatus,
              signature: signatureData,
              signedBy: user?.name || 'Unknown',
              signedDate: new Date().toISOString().split('T')[0]
            }
          : doc
      );
      
      setDocuments(updatedDocuments);
      setSelectedDocument(null);
      setShowSignaturePad(false);
      toast.success('Document signed successfully!');
    }
  };

  const handleStatusChange = (docId: number, newStatus: DocumentStatus) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    );
    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
  };

  const handleDelete = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/documents')}
            leftIcon={<ArrowLeft size={18} />}
          >
            Back to Documents
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Processing Chamber</h1>
            <p className="text-gray-600">Upload, review, and sign contracts and deals</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Upload Documents</h2>
        </CardHeader>
        <CardBody>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-gray-700 font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, and images (Max 10MB)
                </p>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
          <div className="flex items-center gap-2">
            <Badge variant="gray" size="sm">
              {documents.length} Total
            </Badge>
            <Badge variant="success" size="sm">
              {documents.filter(d => d.status === 'signed').length} Signed
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No documents yet. Upload your first document above.</p>
              </div>
            ) : (
              documents.map(doc => {
                const statusInfo = statusConfig[doc.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="p-3 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        <Badge variant={statusInfo.variant} size="sm">
                          <StatusIcon size={12} className="mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                        {doc.signedBy && (
                          <span className="text-success-600">
                            Signed by {doc.signedBy} on {doc.signedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {/* Status Actions */}
                      {doc.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(doc.id, 'in_review')}
                        >
                          Mark for Review
                        </Button>
                      )}

                      {doc.status === 'in_review' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(doc.id, 'draft')}
                          >
                            Back to Draft
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSign(doc)}
                            leftIcon={<PenTool size={16} />}
                          >
                            Sign Document
                          </Button>
                        </>
                      )}

                      {doc.status === 'signed' && (
                        <Badge variant="success" size="sm">
                          <CheckCircle size={12} className="mr-1" />
                          Signed
                        </Badge>
                      )}

                      {/* Action Buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(doc)}
                        className="p-2"
                        aria-label="Preview"
                      >
                        <Eye size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        aria-label="Download"
                      >
                        <Download size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        aria-label="Share"
                      >
                        <Share2 size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-error-600 hover:text-error-700"
                        onClick={() => handleDelete(doc.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardBody>
      </Card>

      {/* E-Signature Pad Modal */}
      {showSignaturePad && selectedDocument && (
        <ESignaturePad
          onSave={handleSaveSignature}
          onClose={() => {
            setShowSignaturePad(false);
            setSelectedDocument(null);
          }}
          userName={user?.name || 'Signer'}
        />
      )}

      {/* Document Preview Modal */}
      {showPreview && previewFile && (
        <DocumentPreview
          file={previewFile}
          onClose={() => {
            setShowPreview(false);
            setPreviewFile(null);
          }}
          onDownload={() => {
            if (previewFile instanceof File) {
              const url = URL.createObjectURL(previewFile);
              const a = document.createElement('a');
              a.href = url;
              a.download = previewFile.name;
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
        />
      )}
    </div>
  );
};
