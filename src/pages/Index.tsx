import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Point {
  id: number;
  x: number;
  y: number;
  label: string;
}

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Главная');
  const [points, setPoints] = useState<Point[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const menuItems = ['Главная', 'Карта', 'Помещения', 'Контакты', 'Справка'];

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    const newPoint: Point = {
      id: Date.now(),
      x,
      y,
      label: `Точка ${points.length + 1}`
    };
    
    setPoints([...points, newPoint]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary hover:bg-primary/10 transition-all"
          >
            <Icon name="Menu" size={24} />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center shadow-lg shadow-primary/30">
              <Icon name="Building2" size={24} className="text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-foreground">
                SMART BUILDING
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Управление зданием
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-semibold tracking-wider">ОНЛАЙН</span>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 shadow-2xl shadow-primary/10`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-wider text-primary">МЕНЮ</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveSection(item);
                setIsMenuOpen(false);
              }}
              className={`w-full px-4 py-3 rounded text-left font-medium tracking-wide transition-all duration-200 flex items-center gap-3 group ${
                activeSection === item
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <div className={`w-1 h-6 rounded-full transition-all ${
                activeSection === item ? 'bg-background' : 'bg-primary/50 group-hover:bg-primary'
              }`} />
              {item}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Activity" size={14} className="text-primary" />
              <span className="font-semibold text-primary">Система активна</span>
            </div>
            <div className="text-[10px] opacity-70">
              Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
            </div>
          </div>
        </div>
      </aside>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-wider mb-1">{activeSection}</h2>
            <p className="text-sm text-muted-foreground tracking-wide">
              Интерактивная система визуализации
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <Icon name="ZoomOut" size={20} />
            </Button>
            <Button
              onClick={handleResetView}
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <Icon name="Maximize2" size={20} />
            </Button>
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <Icon name="ZoomIn" size={20} />
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/5">
          <div className="bg-muted/30 border-b border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                map_view.system
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              ZOOM: {(zoom * 100).toFixed(0)}% | ТОЧЕК: {points.length}
            </div>
          </div>

          <div
            className="relative bg-gradient-to-br from-muted/20 to-muted/5 cursor-crosshair select-none"
            style={{ height: 'calc(100vh - 280px)' }}
            onClick={handleMapClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="absolute inset-0 grid grid-cols-12 gap-0"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-border/20" />
              ))}
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Building2" size={64} className="text-primary/20 mx-auto mb-2" />
                    <p className="text-primary/50 font-semibold tracking-wider">
                      ПЛАН ЗДАНИЯ
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Нажмите для добавления точки
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {points.map((point) => (
                <div
                  key={point.id}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50 border-2 border-background" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-primary/50 rounded px-2 py-1 whitespace-nowrap text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                      {point.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur border border-border rounded px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={14} className="text-primary" />
                <span>ЛКМ - добавить точку | ПКМ + перетаскивание - перемещение</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
