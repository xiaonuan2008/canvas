import { useState, useCallback } from 'react';
import { Search, Image as ImageIcon, Palette, Shapes } from 'lucide-react';

interface AssetPanelProps {
  onAddImage: (url: string) => void;
  onSetBackground: (color: string) => void;
}

type AssetTab = 'images' | 'colors' | 'icons';

// 预设背景色板
const colorPalettes = [
  { name: '经典', colors: ['#ffffff', '#000000', '#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f8b500', '#3b6978', '#204051', '#cae8d5'] },
  { name: '渐变灵感', colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'] },
  { name: '自然', colors: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fdcb6e', '#e17055'] },
  { name: '温暖', colors: ['#2c3e50', '#e74c3c', '#ecf0f1', '#3498db', '#9b59b6', '#1abc9c', '#f1c40f', '#e67e22', '#34495e', '#95a5a6'] },
];

// 预设图标（使用 Lucide 名称）
const iconList = [
  'Heart', 'Star', 'Zap', 'Sun', 'Moon', 'Cloud', 'Music', 'Camera',
  'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'Bookmark', 'Flag',
  'Home', 'User', 'Users', 'Settings', 'Bell', 'Search', 'Link',
  'Share', 'Download', 'Upload', 'Trash', 'Edit', 'Copy', 'Check',
  'X', 'Plus', 'Minus', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
];

export function AssetPanel({ onAddImage, onSetBackground }: AssetPanelProps) {
  const [activeTab, setActiveTab] = useState<AssetTab>('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const searchImages = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      // 使用 Unsplash Source (简化版，实际项目应使用官方 API)
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20`, {
        headers: {
          Authorization: '563492ad6f91700001000001f8c9a5a5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5', // 占位符，用户需要替换为真实 API Key
        },
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data.photos?.map((p: any) => p.src.medium) || []);
      } else {
        // Fallback: 使用占位图片服务
        setImages(Array.from({ length: 12 }, (_, i) =>
          `https://picsum.photos/300/200?random=${Date.now() + i}`
        ));
      }
    } catch {
      setImages(Array.from({ length: 12 }, (_, i) =>
        `https://picsum.photos/300/200?random=${Date.now() + i}`
      ));
    }
    setIsLoading(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchQuery);
  };

  const tabs = [
    { id: 'images' as const, icon: ImageIcon, label: '图片' },
    { id: 'colors' as const, icon: Palette, label: '色板' },
    { id: 'icons' as const, icon: Shapes, label: '图标' },
  ];

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'images' && (
          <div className="space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图片..."
                className="flex-1 px-2.5 py-1.5 text-xs bg-bg-primary border border-border rounded text-text-primary placeholder-text-muted focus:border-accent outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-bg-tertiary border border-border rounded text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <Search size={14} />
              </button>
            </form>

            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => onAddImage(url)}
                    className="relative aspect-[3/2] rounded overflow-hidden border border-border hover:border-accent transition-colors group"
                  >
                    <img
                      src={url}
                      alt=""
                      className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${loadedImages.has(i) ? 'opacity-100' : 'opacity-0'}`}
                      loading="lazy"
                      onLoad={() => setLoadedImages((prev) => new Set(prev).add(i))}
                    />
                    {!loadedImages.has(i) && (
                      <div className="absolute inset-0 bg-[#21262d] animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {images.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <ImageIcon size={32} className="mx-auto text-border mb-2" />
                <p className="text-xs text-text-muted">输入关键词搜索图片</p>
                <p className="text-[10px] text-border mt-1">或拖拽图片到画布</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-4">
            {colorPalettes.map((palette) => (
              <div key={palette.name}>
                <h4 className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">{palette.name}</h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {palette.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => onSetBackground(color)}
                      className="aspect-square rounded border border-border hover:border-accent hover:scale-110 transition-all"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h4 className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">自定义</h4>
              <input
                type="color"
                onChange={(e) => onSetBackground(e.target.value)}
                className="w-full h-8 rounded border border-border bg-transparent cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="grid grid-cols-4 gap-1">
            {iconList.map((iconName) => (
              <button
                key={iconName}
                onClick={() => {
                  // 添加一个带图标的形状到画布
                  // 这里简化处理，实际可以用 Iconify 渲染 SVG 后转为 fabric 对象
                }}
                className="aspect-square flex items-center justify-center rounded border border-border text-text-secondary hover:border-accent hover:text-accent hover:bg-accent-bg transition-all"
                title={iconName}
              >
                <span className="text-[10px]">{iconName.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
