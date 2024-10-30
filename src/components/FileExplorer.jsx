// src/components/FileExplorer.jsx
import { useState } from 'react';
import AceEditorComponent from './AceEditorComponent';
import { FolderOpen } from 'lucide-react';

// FileItem 컴포넌트를 같은 파일에 정의
function FileItem({ file, depth = 0, onFileClick, selectedPath }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [childFiles, setChildFiles] = useState([]);

    const handleToggle = async (e) => {
        e.stopPropagation();
        if (file.isDirectory) {
            if (!isExpanded || childFiles.length === 0) {
                try {
                    const files = await window.electronAPI.readDirectory(file.path);
                    files.sort((a, b) => {
                        if (a.isDirectory === b.isDirectory) {
                            return a.name.localeCompare(b.name);
                        }
                        return b.isDirectory - a.isDirectory;
                    });
                    setChildFiles(files);
                } catch (error) {
                    console.error('Error reading directory:', error);
                }
            }
            setIsExpanded(!isExpanded);
        }
    };

    const getFileIcon = () => {
        if (file.isDirectory) {
            return isExpanded ? '📂' : '📁';
        }
        return '📄';
    };

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer select-none
                    ${selectedPath === file.path ? 'bg-blue-100' : ''}`}
                style={{ paddingLeft: `${depth * 20}px` }}
                onClick={() => onFileClick(file)}
            >
                <div className="w-6 h-6 flex items-center justify-center mr-1">
                    {file.isDirectory && (
                        <button 
                            onClick={handleToggle}
                            className="w-4 h-4 flex items-center justify-center"
                        >
                            {isExpanded ? '▼' : '▶'}
                        </button>
                    )}
                </div>
                <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {getFileIcon()}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate font-medium">{file.name}</span>
                    {!file.isDirectory && (
                        <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                        </span>
                    )}
                </div>
            </div>
            {isExpanded && childFiles.length > 0 && (
                <div>
                    {childFiles.map((childFile) => (
                        <FileItem
                            key={childFile.path}
                            file={childFile}
                            depth={depth + 1}
                            onFileClick={onFileClick}
                            selectedPath={selectedPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// 메인 FileExplorer 컴포넌트
function FileExplorer() {
    const [currentPath, setCurrentPath] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    const handleSelectDirectory = async () => {
        try {
            const path = await window.electronAPI.openDirectory();
            if (path) {
                setCurrentPath(path);
                const filesData = await window.electronAPI.readDirectory(path);
                filesData.sort((a, b) => {
                    if (a.isDirectory === b.isDirectory) {
                        return a.name.localeCompare(b.name);
                    }
                    return b.isDirectory - a.isDirectory;
                });
                setFiles(filesData);
                setSelectedFile(null);
                setFileContent('');
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        }
    };

    const handleFileClick = async (file) => {
        if (!file.isDirectory) {
            try {
                const content = await window.electronAPI.readFile(file.path);
                setSelectedFile(file);
                setFileContent(content);
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 p-4 border-r flex flex-col">
                <div className="mb-4">
                    <button 
                        onClick={handleSelectDirectory}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <FolderOpen className="w-5 h-5 mr-2" />
                        폴더 선택
                    </button>
                </div>

                {currentPath && (
                    <div className="mb-2">
                        <p className="text-sm text-gray-600">
                            현재 경로: {currentPath}
                        </p>
                    </div>
                )}

                <div className="flex-1 border rounded-lg overflow-y-auto">
                    {files.map((file) => (
                        <FileItem
                            key={file.path}
                            file={file}
                            onFileClick={handleFileClick}
                            selectedPath={selectedFile?.path}
                        />
                    ))}
                </div>
            </div>
            
            <div className="w-2/3 p-4">
                <AceEditorComponent 
                    file={selectedFile}
                    content={fileContent}
                />
            </div>
        </div>
    );
}

export default FileExplorer;