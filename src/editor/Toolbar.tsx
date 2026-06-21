import {
  MousePointer2, Type, Image, Square, Circle,
  Undo2, Redo2, Trash2, Copy, ZoomIn, ZoomOut,
  Download, Hexagon,
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useRef } from 'react';
import { useEditorAPI } from '../context/EditorContext';

const tools = [
  { id: 'select' as const, icon: MousePointer2, label: '选择' },
  { id: 'text' as const, icon: Type, label: '文字' },
  { id: 'image' as const, icon: Image, label: '图片' },
  { id: 'rect' as const, icon: Square, label: '矩形' },
  { id: 'circle' as const, icon: Circle, label: '圆形' },
];

export function Toolbar() {
  const api = useEditorAPI();
  const { activeTool, setActiveTool, setZoom, zoom } = useEditorStore();
  const { canUndo, canRedo } = useHistoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'text': api.addText(); break;
      case 'image': fileInputRef.current?.click(); break;
      case 'rect': api.addRect(); break;
      case 'circle': api.addCircle(); break;
      default: break;
    }
    setActiveTool(toolId as any);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    api.addImage(url);
    e.target.value = '';
  };

  const handleUndo = () => api.undo();
  const handleRedo = () => api.redo();
  const handleDelete = () => api.deleteSelected();
  const handleDuplicate = () => api.duplicateSelected();

  const handleExport = () => {
    const dataURL = api.exportImage('png');
    if (dataURL) {
      const link = document.createElement('a');
      link.download = 'design-export.png';
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className="w-14 bg-bg-secondary border-r border-border flex flex-col items-center py-3 gap-1">
      {/* Logo */}
      <div className="w-10 h-10 flex items-center justify-center mb-2">
        <Hexagon size={22} className="text-accent" />
      </div>

      <div className="w-8 h-px bg-border my-1" />

      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-accent-bg text-accent'
                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            }`}
            title={tool.label}
          >
            <Icon size={18} />
          </button>
        );
      })}

      <div className="w-8 h-px bg-border my-2" />

      <button onClick={handleUndo} disabled={!canUndo()} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover disabled:opacity-30" title="撤销">
        <Undo2 size={18} />
      </button>
      <button onClick={handleRedo} disabled={!canRedo()} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover disabled:opacity-30" title="重做">
        <Redo2 size={18} />
      </button>

      <div className="w-8 h-px bg-border my-2" />

      <button onClick={handleDuplicate} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover" title="复制">
        <Copy size={18} />
      </button>
      <button onClick={handleDelete} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover" title="删除">
        <Trash2 size={18} />
      </button>

      <div className="flex-1" />

      <div className="w-full px-2 py-2 bg-bg-tertiary border-t border-border flex flex-col items-center gap-1">
        <button onClick={() => setZoom(Math.min(zoom + 0.1, 3))} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover" title="放大">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover" title="缩小">
          <ZoomOut size={18} />
        </button>
        <button onClick={handleExport} className="w-10 h-10 rounded-lg flex items-center justify-center text-accent hover:bg-accent-bg" title="导出 PNG">
          <Download size={18} />
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
}
