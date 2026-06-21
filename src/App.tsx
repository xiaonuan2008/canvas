import { useRef, useEffect } from 'react';
import { EditorProvider } from './context/EditorContext';
import { useEditorAPI } from './context/EditorContext';
import type { EditorAPI } from './context/EditorContext';
import { CanvasEditor } from './editor/CanvasEditor';
import { Toolbar } from './editor/Toolbar';
import { PropertyPanel } from './editor/PropertyPanel';
import { ToastProvider } from './components/Toast';
import { Hexagon, Download } from 'lucide-react';
import '@fontsource/noto-sans-sc/index.css';

function AppContent() {
  const editorRef = useRef<EditorAPI>(null);
  const api = useEditorAPI();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) api.redo();
        else api.undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        api.duplicateSelected();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          api.deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [api]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-primary">
      {/* Title bar */}
      <div className="h-9 flex items-center justify-between px-4 border-b border-border bg-bg-primary">
        <div className="flex items-center gap-2">
          <Hexagon size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">Design Tool</span>
          <span className="text-xs text-text-muted">· 未命名项目</span>
        </div>
        <button
          onClick={() => {
            const dataURL = api.exportImage('png');
            if (dataURL) {
              const link = document.createElement('a');
              link.download = 'design-export.png';
              link.href = dataURL;
              link.click();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1 text-xs bg-accent-bg text-accent rounded hover:bg-accent hover:text-white transition-colors"
        >
          <Download size={14} />
          导出 PNG
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <CanvasEditor ref={editorRef} />
        <PropertyPanel />
      </div>
    </div>
  );
}

function App() {
  return (
    <EditorProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </EditorProvider>
  );
}

export default App;
