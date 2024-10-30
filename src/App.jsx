// src/App.jsx
import FileExplorer from './components/FileExplorer';

function App() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">파일 탐색기</h1>
            <FileExplorer />
        </div>
    );
}

export default App;