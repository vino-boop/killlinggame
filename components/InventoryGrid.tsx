
import React, { useCallback, useRef } from 'react';
import { InventoryItem, Item } from '../types';

interface InventoryGridProps {
  items: InventoryItem[];
  rows: number;
  cols: number;
  title: string;
  gridId: 'backpack' | 'vehicle' | 'home';
  onUseItem?: (item: InventoryItem) => void;
  onUpdateItems: (newItems: InventoryItem[]) => void;
  onItemClick?: (item: InventoryItem, gridId: string) => void;
  accentColor?: string;
  description?: string;
}

const CELL_SIZE = 40; 
const GAP = 4;

const InventoryGrid: React.FC<InventoryGridProps> = ({ 
  items, 
  rows, 
  cols, 
  title, 
  gridId,
  onUseItem, 
  onUpdateItems,
  onItemClick,
  accentColor = "text-blue-500",
  description,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const isOccupied = useCallback((x: number, y: number, w: number, h: number, excludeItem?: InventoryItem) => {
    if (x < 0 || y < 0 || x + w > cols || y + h > rows) return true;
    return items.some(item => {
      if (item === excludeItem) return false;
      return (
        x < item.x + item.width &&
        x + w > item.x &&
        y < item.y + item.height &&
        y + h > item.y
      );
    });
  }, [items, rows, cols]);

  const handleRotate = (e: React.MouseEvent, item: InventoryItem) => {
    e.preventDefault();
    const newWidth = item.height;
    const newHeight = item.width;
    
    if (!isOccupied(item.x, item.y, newWidth, newHeight, item)) {
      const newItems = items.map(i => 
        i === item ? { ...i, width: newWidth, height: newHeight } : i
      );
      onUpdateItems(newItems);
    }
  };

  return (
    <div className="bg-black/40 p-5 border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-md select-none flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{title}</h3>
        <span className={`text-[10px] font-black mono ${accentColor} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>{items.length} / {rows * cols}</span>
      </div>
      
      <div 
        ref={gridRef}
        className="relative bg-gray-950/80 p-1 border border-white/10 rounded-2xl overflow-hidden shadow-inner"
        style={{ 
          width: cols * (CELL_SIZE + GAP) + 8,
          height: rows * (CELL_SIZE + GAP) + 8,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          gap: `${GAP}px`
        }}
      >
        {/* Background Grid Cells */}
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={i} className="w-full h-full border border-white/[0.02] bg-white/[0.01] rounded-lg" />
        ))}

        {/* Inventory Items */}
        {items.map((item, idx) => {
          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onItemClick?.(item, gridId)}
              onContextMenu={(e) => handleRotate(e, item)}
              onDoubleClick={() => onUseItem?.(item)}
              className="absolute cursor-pointer rounded-xl border transition-all flex items-center justify-center text-2xl group shadow-lg hover:brightness-125 hover:scale-[1.02] active:scale-95"
              style={{
                left: item.x * (CELL_SIZE + GAP) + 4,
                top: item.y * (CELL_SIZE + GAP) + 4,
                width: item.width * (CELL_SIZE + GAP) - GAP,
                height: item.height * (CELL_SIZE + GAP) - GAP,
                backgroundColor: item.color + '33',
                borderColor: item.color + '66',
                boxShadow: `0 0 20px ${item.color}11`,
                zIndex: 10
              }}
            >
              <span className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 w-full px-2 space-y-1 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
          <span>L-CLICK: TRANSFER</span>
          <span>R-CLICK: ROTATE</span>
          <span>D-CLICK: USE</span>
        </div>
        {description && <p className="text-[8px] text-gray-600 leading-tight uppercase font-black text-center pt-1 border-t border-white/5">{description}</p>}
      </div>
    </div>
  );
};

export default InventoryGrid;
