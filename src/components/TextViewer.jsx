function TextViewer({ file, content }) {
  if (!file) {
      return (
          <div className="h-full flex items-center justify-center text-gray-500">
              파일을 선택해주세요
          </div>
      );
  }

  return (
      <div className="h-full">
          <div className="mb-4">
              <h2 className="text-xl font-semibold">{file.name}</h2>
          </div>
          <div className="border rounded-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                  {content}
              </pre>
          </div>
      </div>
  );
}

export default TextViewer;