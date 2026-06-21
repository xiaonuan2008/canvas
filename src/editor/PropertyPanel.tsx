import { useEffect, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useCanvasStore } from '../store/useCanvasStore';
import { AssetPanel } from './AssetPanel';
import { Eye, EyeOff, Lock, Unlock, SlidersHorizontal, Library } from 'lucide-react';
import { useEditorAPI } from '../context/EditorContext';

type RightPanelTab = 'properties' | 'assets';

export function PropertyPanel() {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('properties');
  const { canvasWidth, canvasHeight, setCanvasSize, canvas } = useEditorStore();
  const { selectedObjectId, objects } = useCanvasStore();
  const api = useEditorAPI();

  const selectedObj = objects.find((o) => o.id === selectedObjectId);

  // Text properties state
  const [fontFamily, setFontFamily] = useState('Noto Sans SC');
  const [fontSize, setFontSize] = useState(24);
  const [fill, setFill] = useState('#1e293b');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [underline, setUnderline] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [charSpacing, setCharSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState('left');
  const [hasStroke, setHasStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [hasShadow, setHasShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');

  // Listen for selected object changes and read fabric text properties
  useEffect(() => {
    if (!canvas || !selectedObjectId) return;

    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (fabricObj && fabricObj.type === 'textbox') {
      const textObj = fabricObj as any;
      setFontFamily(textObj.fontFamily || 'Noto Sans SC');
      setFontSize(textObj.fontSize || 24);
      setFill(textObj.fill || '#1e293b');
      setFontWeight(textObj.fontWeight || 'normal');
      setFontStyle(textObj.fontStyle || 'normal');
      setUnderline(textObj.underline || false);
      setLineHeight(textObj.lineHeight || 1.2);
      setCharSpacing(textObj.charSpacing || 0);
      setTextAlign(textObj.textAlign || 'left');
      setHasStroke(!!textObj.stroke);
      setStrokeColor(textObj.stroke || '#000000');
      setStrokeWidth(textObj.strokeWidth || 1);
      setHasShadow(!!textObj.shadow);
      setShadowColor(textObj.shadow?.color || '#000000');
    }
  }, [selectedObjectId, canvas]);

  const updateTextProperty = (property: string, value: any) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    textObj.set(property, value);
    canvas.renderAll();

    // Update local state
    switch (property) {
      case 'fontFamily': setFontFamily(value); break;
      case 'fontSize': setFontSize(value); break;
      case 'fill': setFill(value); break;
      case 'fontWeight': setFontWeight(value); break;
      case 'fontStyle': setFontStyle(value); break;
      case 'underline': setUnderline(value); break;
      case 'lineHeight': setLineHeight(value); break;
      case 'charSpacing': setCharSpacing(value); break;
      case 'textAlign': setTextAlign(value); break;
    }
  };

  const toggleStyle = (style: 'fontWeight' | 'fontStyle' | 'underline') => {
    if (style === 'fontWeight') {
      const newValue = fontWeight === 'bold' ? 'normal' : 'bold';
      updateTextProperty('fontWeight', newValue);
    } else if (style === 'fontStyle') {
      const newValue = fontStyle === 'italic' ? 'normal' : 'italic';
      updateTextProperty('fontStyle', newValue);
    } else if (style === 'underline') {
      updateTextProperty('underline', !underline);
    }
  };

  const toggleStroke = (enabled: boolean) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    if (enabled) {
      textObj.set('stroke', strokeColor);
      textObj.set('strokeWidth', strokeWidth);
    } else {
      textObj.set('stroke', undefined);
      textObj.set('strokeWidth', 0);
    }
    canvas.renderAll();
    setHasStroke(enabled);
  };

  const updateStrokeColor = (color: string) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    textObj.set('stroke', color);
    canvas.renderAll();
    setStrokeColor(color);
  };

  const updateStrokeWidth = (width: number) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    textObj.set('strokeWidth', width);
    canvas.renderAll();
    setStrokeWidth(width);
  };

  const toggleShadow = (enabled: boolean) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    if (enabled) {
      textObj.set('shadow', new (window as any).fabric.Shadow({
        color: shadowColor,
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      }));
    } else {
      textObj.set('shadow', undefined);
    }
    canvas.renderAll();
    setHasShadow(enabled);
  };

  const updateShadowColor = (color: string) => {
    if (!canvas || !selectedObjectId) return;
    const fabricObj = canvas.getObjects().find((o: any) => o.customId === selectedObjectId);
    if (!fabricObj || fabricObj.type !== 'textbox') return;

    const textObj = fabricObj as any;
    textObj.set('shadow', new (window as any).fabric.Shadow({
      color: color,
      blur: 5,
      offsetX: 2,
      offsetY: 2,
    }));
    canvas.renderAll();
    setShadowColor(color);
  };

  return (
    <div className="w-64 bg-bg-secondary border-l border-border flex flex-col overflow-hidden">
      {/* Top Tab Switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors ${
            activeTab === 'properties'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <SlidersHorizontal size={14} />
          属性
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors ${
            activeTab === 'assets'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Library size={14} />
          素材
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'properties' && (
          <div className="h-full overflow-y-auto">
            {/* Canvas Settings */}
            <div className="p-4 border-b border-border">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">画布设置</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-text-secondary w-8">宽</label>
                  <input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasSize(Number(e.target.value), canvasHeight)}
                    className="flex-1 px-2 py-1 text-xs bg-bg-primary border border-border rounded focus:outline-none focus:border-accent text-text-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-text-secondary w-8">高</label>
                  <input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasSize(canvasWidth, Number(e.target.value))}
                    className="flex-1 px-2 py-1 text-xs bg-bg-primary border border-border rounded focus:outline-none focus:border-accent text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Text Properties */}
            {selectedObj?.type === 'text' && (
              <div className="p-4 space-y-4">
                <h3 className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">文字属性</h3>

                {/* 字体选择 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">字体</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded text-[#e6edf3] focus:border-[#58a6ff] outline-none"
                  >
                    <option value="Noto Sans SC">思源黑体</option>
                    <option value="Noto Serif SC">思源宋体</option>
                    <option value="system-ui">系统默认</option>
                  </select>
                </div>

                {/* 字号 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">字号</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="8" max="200" value={fontSize}
                      onChange={(e) => updateTextProperty('fontSize', Number(e.target.value))}
                      className="flex-1 accent-[#58a6ff]"
                    />
                    <input
                      type="number" min="8" max="200" value={fontSize}
                      onChange={(e) => updateTextProperty('fontSize', Number(e.target.value))}
                      className="w-14 px-2 py-1 text-xs bg-[#0d1117] border border-[#30363d] rounded text-[#e6edf3] text-center focus:border-[#58a6ff] outline-none"
                    />
                  </div>
                </div>

                {/* 颜色 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">颜色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color" value={fill}
                      onChange={(e) => updateTextProperty('fill', e.target.value)}
                      className="w-8 h-8 rounded border border-[#30363d] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text" value={fill}
                      onChange={(e) => updateTextProperty('fill', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded text-[#e6edf3] focus:border-[#58a6ff] outline-none"
                    />
                  </div>
                </div>

                {/* 字重 + 样式 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">样式</label>
                  <div className="flex gap-1">
                    <button onClick={() => toggleStyle('fontWeight')} className={`flex-1 py-1.5 text-xs rounded border ${fontWeight === 'bold' ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}>粗体</button>
                    <button onClick={() => toggleStyle('fontStyle')} className={`flex-1 py-1.5 text-xs rounded border ${fontStyle === 'italic' ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}>斜体</button>
                    <button onClick={() => toggleStyle('underline')} className={`flex-1 py-1.5 text-xs rounded border ${underline ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}>下划线</button>
                  </div>
                </div>

                {/* 行高 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">行高</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0.5" max="3" step="0.1" value={lineHeight}
                      onChange={(e) => updateTextProperty('lineHeight', Number(e.target.value))}
                      className="flex-1 accent-[#58a6ff]"
                    />
                    <span className="w-10 text-xs text-[#e6edf3] text-right">{lineHeight}</span>
                  </div>
                </div>

                {/* 字间距 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">字间距</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="-50" max="100" value={charSpacing}
                      onChange={(e) => updateTextProperty('charSpacing', Number(e.target.value))}
                      className="flex-1 accent-[#58a6ff]"
                    />
                    <span className="w-10 text-xs text-[#e6edf3] text-right">{charSpacing}</span>
                  </div>
                </div>

                {/* 对齐方式 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">对齐</label>
                  <div className="flex gap-1">
                    {['left', 'center', 'right', 'justify'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateTextProperty('textAlign', align)}
                        className={`flex-1 py-1.5 text-xs rounded border ${textAlign === align ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}
                      >
                        {align === 'left' && '左'}
                        {align === 'center' && '中'}
                        {align === 'right' && '右'}
                        {align === 'justify' && '两端'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 文字效果 */}
                <div>
                  <label className="text-[11px] text-[#8b949e] block mb-1">效果</label>
                  <div className="space-y-2">
                    {/* 描边 */}
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={hasStroke} onChange={(e) => toggleStroke(e.target.checked)} className="accent-[#58a6ff]" />
                      <span className="text-xs text-[#e6edf3]">描边</span>
                      {hasStroke && (
                        <>
                          <input type="color" value={strokeColor} onChange={(e) => updateStrokeColor(e.target.value)} className="w-6 h-6 rounded border border-[#30363d]" />
                          <input type="number" min="0" max="20" value={strokeWidth} onChange={(e) => updateStrokeWidth(Number(e.target.value))} className="w-12 px-1 py-0.5 text-xs bg-[#0d1117] border border-[#30363d] rounded text-[#e6edf3]" />
                        </>
                      )}
                    </div>
                    {/* 阴影 */}
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={hasShadow} onChange={(e) => toggleShadow(e.target.checked)} className="accent-[#58a6ff]" />
                      <span className="text-xs text-[#e6edf3]">阴影</span>
                      {hasShadow && (
                        <input type="color" value={shadowColor} onChange={(e) => updateShadowColor(e.target.value)} className="w-6 h-6 rounded border border-[#30363d]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Object Properties (non-text) */}
            {selectedObj && selectedObj.type !== 'text' ? (
              <div className="p-4">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">对象属性</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">类型</span>
                    <span className="text-xs text-text-primary">{selectedObj.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">名称</span>
                    <span className="text-xs text-text-primary">{selectedObj.name}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-border rounded hover:bg-bg-hover text-text-secondary">
                      {selectedObj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {selectedObj.visible ? '可见' : '隐藏'}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-border rounded hover:bg-bg-hover text-text-secondary">
                      {selectedObj.locked ? <Lock size={12} /> : <Unlock size={12} />}
                      {selectedObj.locked ? '锁定' : '解锁'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {!selectedObj && (
              <div className="flex-1 flex items-center justify-center py-12">
                <p className="text-xs text-text-muted">选择一个对象以编辑属性</p>
              </div>
            )}

            {/* Quick Templates */}
            <div className="p-4 border-t border-border mt-auto">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">快速操作</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCanvasSize(1080, 1080)}
                  className="px-2 py-2 text-xs border border-border rounded bg-bg-tertiary hover:bg-bg-hover hover:border-accent text-text-primary transition-colors"
                >
                  朋友圈 1:1
                </button>
                <button
                  onClick={() => setCanvasSize(1080, 1920)}
                  className="px-2 py-2 text-xs border border-border rounded bg-bg-tertiary hover:bg-bg-hover hover:border-accent text-text-primary transition-colors"
                >
                  小红书 9:16
                </button>
                <button
                  onClick={() => setCanvasSize(1200, 630)}
                  className="px-2 py-2 text-xs border border-border rounded bg-bg-tertiary hover:bg-bg-hover hover:border-accent text-text-primary transition-colors"
                >
                  公众号头图
                </button>
                <button
                  onClick={() => setCanvasSize(1920, 1080)}
                  className="px-2 py-2 text-xs border border-border rounded bg-bg-tertiary hover:bg-bg-hover hover:border-accent text-text-primary transition-colors"
                >
                  横版 16:9
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="h-full overflow-hidden">
            <AssetPanel onAddImage={api.addImage} onSetBackground={api.setBackground} />
          </div>
        )}
      </div>
    </div>
  );
}
