import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Download, Trash2, Share2, Video, Users, Eye, Edit, Unlock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const documents = [
  {
    id: 1,
    name: 'Pitch Deck 2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    shared: true,
    inChamber: false,
    viewers: 0
  },
  {
    id: 2,
    name: 'Financial Projections.xlsx',
    type: 'Spreadsheet',
    size: '1.8 MB',
    lastModified: '2024-02-10',
    shared: false,
    inChamber: true,
    viewers: 2
  },
  {
    id: 3,
    name: 'Business Plan.docx',
    type: 'Document',
    size: '3.2 MB',
    lastModified: '2024-02-05',
    shared: true,
    inChamber: false,
    viewers: 0
  },
  {
    id: 4,
    name: 'Market Research.pdf',
    type: 'PDF',
    size: '5.1 MB',
    lastModified: '2024-01-28',
    shared: false,
    inChamber: false,
    viewers: 0
  }
];

const activeChamberParticipants = [
  { id: '1', name: 'John Doe', avatarUrl: '', role: 'Viewer' },
  { id: '2', name: 'Jane Smith', avatarUrl: '', role: 'Editor' }
];

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenChamber = (docId?: number) => {
    if (docId) {
      navigate(`/documents/chamber/${docId}`);
    } else {
      navigate('/documents/chamber');
    }
  };

  const handleStartVideoCall = () => {
    navigate('/video-call');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents & Document Chamber</h1>
          <p className="text-gray-600">Manage your startup's important files and collaborate in real-time</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            leftIcon={<Video size={18} />}
            onClick={handleStartVideoCall}
          >
            Start Video Call
          </Button>
          <Button 
            variant="accent"
            leftIcon={<FileText size={18} />}
            onClick={() => handleOpenChamber()}
          >
            Document Processing Chamber
          </Button>
          <Button leftIcon={<Upload size={18} />}>
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Chamber Section */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={24} className="text-primary-600" />
                Document Chamber
              </h2>
              <p className="text-gray-600 mt-1">Collaborate on documents during video calls</p>
            </div>
            <Badge variant="success" size="lg">
              <Users size={14} className="mr-1" />
              {activeChamberParticipants.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Active Participants */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Participants</h3>
              <div className="space-y-3">
                {activeChamberParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Avatar
                      src={participant.avatarUrl}
                      alt={participant.name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                    {participant.role === 'Editor' ? (
                      <Edit size={16} className="text-primary-600" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Document */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Document</h3>
              <div className="bg-white rounded-lg p-4 border-2 border-primary-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-gray-900">
                          Financial Projections.xlsx
                        </h4>
                        <Badge variant="secondary" size="sm">In Chamber</Badge>
                      </div>
                      <p className="text-sm text-gray-500">Spreadsheet • 1.8 MB • Modified 2024-02-10</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="gray" size="sm">
                          <Users size={12} className="mr-1" />
                          2 Viewers
                        </Badge>
                        <Badge variant="success" size="sm">
                          <Unlock size={12} className="mr-1" />
                          Unlocked
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenChamber(2)}
                    >
                      Open in Chamber
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenChamber()}
                      leftIcon={<FileText size={16} />}
                    >
                      Document Processing
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Chamber Features</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Video size={16} className="text-primary-600" />
                    <span>Video Call Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye size={16} className="text-primary-600" />
                    <span>Real-time Viewing</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Edit size={16} className="text-primary-600" />
                    <span>Collaborative Editing</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-primary-600" />
                    <span>Multi-user Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Storage info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-900">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-medium text-gray-900">7.5 GB</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Recent Files
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Shared with Me
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Starred
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Trash
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Document list */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Sort by
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="p-2 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        {doc.shared && (
                          <Badge variant="secondary" size="sm">Shared</Badge>
                        )}
                        {doc.inChamber && (
                          <Badge variant="accent" size="sm">
                            <Users size={12} className="mr-1" />
                            In Chamber ({doc.viewers})
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {doc.inChamber ? (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => handleOpenChamber(doc.id)}
                          className="text-white"
                        >
                          <Video size={16} className="mr-1" />
                          Open in Chamber
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenChamber(doc.id)}
                        >
                          <Video size={16} className="mr-1" />
                          Add to Chamber
                        </Button>
                      )}
                      
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
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};