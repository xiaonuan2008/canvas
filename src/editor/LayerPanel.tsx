import { useState } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { useEditorStore } from '../store/useEditorStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

export function LayerPanel() {
  const { objects, selectedObjectId, setSelectedObjectId, updateObject, removeObject, reorderObjects } = useCanvasStore();
  const { canvas } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  // dragRef reserved for future drag-and-drop reordering

  const handleSelect = (id: string) => {
    setSelectedObjectId(id);
    if (canvas) {
      const obj = canvas.getObjects().find((o: any) => o.customId === id);
      if (obj) {
        canvas.setActiveObject(obj);
        canvas.renderAll();
      }
    }
  };

  const handleToggleVisible = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const obj = objects.find((o) => o.id === id);
    if (obj) {
      updateObject(id, { visible: !obj.visible });
      // Also update fabric object
      if (canvas) {
        const fObj = canvas.getObjects().find((o: any) => o.customId === id);
        if (fObj) {
          fObj.set('visible', !obj.visible);
          canvas.renderAll();
        }
      }
    }
  };

  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const obj = objects.find((o) => o.id === id);
    if (obj) {
      updateObject(id, { locked: !obj.locked });
      if (canvas) {
        const fObj = canvas.getObjects().find((o: any) => o.customId === id);
        if (fObj) {
          fObj.set('selectable', obj.locked);
          fObj.set('evented', obj.locked);
          canvas.renderAll();
        }
      }
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeObject(id);
    if (canvas) {
      const fObj = canvas.getObjects().find((o: any) => o.customId === id);
      if (fObj) {
        canvas.remove(fObj);
        canvas.renderAll();
      }
    }
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const newObjects = [...objects];
    [newObjects[index], newObjects[index - 1]] = [newObjects[index - 1], newObjects[index]];
    reorderObjects(newObjects);
    // Update fabric z-index
    if (canvas) {
      const fObjs = canvas.getObjects();
      // Reorder based on newObjects order
      newObjects.forEach((obj, i) => {
        const fObj = fObjs.find((o: any) => o.customId === obj.id);
        if (fObj) {
          (canvas as any).moveObjectTo(fObj, i);
        }
      });
      canvas.renderAll();
    }
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === objects.length - 1) return;
    const newObjects = [...objects];
    [newObjects[index], newObjects[index + 1]] = [newObjects[index + 1], newObjects[index]];
    reorderObjects(newObjects);
    if (canvas) {
      const fObjs = canvas.getObjects();
      newObjects.forEach((obj, i) => {
        const fObj = fObjs.find((o: any) => o.customId === obj.id);
        if (fObj) {
          (canvas as any).moveObjectTo(fObj, i);
        }
      });
      canvas.renderAll();
    }
  };

  const handleDoubleClick = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      updateObject(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  // Reverse for display (top layer at top)
  const displayObjects = [...objects].reverse();

  return (
    <div className="w-56 bg-[#161b22] border-l border-[#30363d] flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[#30363d]">
        <h3 className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">图层</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {displayObjects.length === 0 ? (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs text-[#484f58]">暂无图层</p>
          </div>
        ) : (
          displayObjects.map((obj, displayIndex) => {
            const realIndex = objects.length - 1 - displayIndex;
            const isSelected = selectedObjectId === obj.id;
            return (
              <div
                key={obj.id}
                onClick={() => handleSelect(obj.id)}
                onDoubleClick={() => handleDoubleClick(obj.id, obj.name)}
                className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer group transition-colors ${
                  isSelected ? 'bg-[#1f6feb]/15' : 'hover:bg-[#21262d]'
                }`}
              >
                <GripVertical size={12} className="text-[#484f58] opacity-0 group-hover:opacity-100 cursor-grab" />
                
                <button
                  onClick={(e) => handleToggleVisible(obj.id, e)}
                  className="text-[#8b949e] hover:text-[#e6edf3]"
                >
                  {obj.visible ? <Eye size={12} /> : <EyeOff size={12} className="text-[#484f58]" />}
                </button>
                
                <button
                  onClick={(e) => handleToggleLock(obj.id, e)}
                  className="text-[#8b949e] hover:text-[#e6edf3]"
                >
                  {obj.locked ? <Lock size={12} /> : <Unlock size={12} className="text-[#484f58]" />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === obj.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRename(obj.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(obj.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full px-1 py-0.5 text-xs bg-[#0d1117] border border-[#58a6ff] rounded text-[#e6edf3] outline-none"
                    />
                  ) : (
                    <span className={`text-xs truncate block ${isSelected ? 'text-[#58a6ff]' : 'text-[#e6edf3]'}`}>
                      {obj.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => handleMoveUp(realIndex, e)} className="p-0.5 text-[#8b949e] hover:text-[#e6edf3]">
                    <ChevronUp size={12} />
                  </button>
                  <button onClick={(e) => handleMoveDown(realIndex, e)} className="p-0.5 text-[#8b949e] hover:text-[#e6edf3]">
                    <ChevronDown size={12} />
                  </button>
                  <button onClick={(e) => handleDelete(obj.id, e)} className="p-0.5 text-[#8b949e] hover:text-[#f85149]">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
