import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

type PositionValue = number | string;
type SizeValue = number | string;

interface Position {
  x: PositionValue;
  y: PositionValue;
}

interface Size {
  width: SizeValue;
  height: SizeValue;
}

// Utility functions to convert percentage/vw/vh values to pixels
const convertToPixels = (
  value: PositionValue | SizeValue,
  dimension: "width" | "height"
): number => {
  if (typeof value === "number") return value;

  const numericValue = parseFloat(value);
  const unit = value.replace(numericValue.toString(), "").trim();

  switch (unit) {
    case "vw":
    case "%":
      return dimension === "width"
        ? (numericValue / 100) * window.innerWidth
        : (numericValue / 100) * window.innerWidth; // For x positions, use width
    case "vh":
      return (numericValue / 100) * window.innerHeight;
    case "px":
    case "":
      return numericValue;
    default:
      return numericValue; // Fallback to numeric value
  }
};

const convertPositionToPixels = (pos: Position): { x: number; y: number } => ({
  x: convertToPixels(pos.x, "width"),
  y: convertToPixels(pos.y, "height"),
});

const convertSizeToPixels = (
  size: Size
): { width: number; height: number } => ({
  width: convertToPixels(size.width, "width"),
  height: convertToPixels(size.height, "height"),
});

interface DraggableWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  initialPosition?: Position;
  initialSize?: Size;
  minSize?: Size;
  maxSize?: Size;
  showControls?: boolean;
  resizable?: boolean;
}

export const DraggableWindow = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 320, height: 400 },
  minSize = { width: 250, height: 200 },
  maxSize = { width: 800, height: 600 },
  showControls = true,
  resizable = true,
}: DraggableWindowProps) => {
  // Get current theme
  const { theme } = useTheme();

  // Convert initial values to pixels
  const initialPosPixels = convertPositionToPixels(initialPosition);
  const initialSizePixels = convertSizeToPixels(initialSize);
  const minSizePixels = convertSizeToPixels(minSize);
  const maxSizePixels = convertSizeToPixels(maxSize);

  // Internal state uses pixel values
  const [position, setPosition] = useState(initialPosPixels);
  const [size, setSize] = useState(initialSizePixels);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [resizeDirection, setResizeDirection] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState({
    position: initialPosPixels,
    size: initialSizePixels,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".window-titlebar")
    ) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    // Store the initial position for resize calculations
    setDragStart({
      x: position.x,
      y: position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Get current window dimensions dynamically
      const currentWidth = isMinimized ? size.width : size.width;
      const currentHeight = isMinimized ? 40 : size.height; // Updated to use 40

      // Keep window within viewport bounds
      const maxX = window.innerWidth - currentWidth;
      const maxY = window.innerHeight - currentHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    } else if (isResizing && resizable) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = dragStart.x; // Use stored initial position
      let newY = dragStart.y; // Use stored initial position

      // Handle different resize directions with viewport constraints
      if (resizeDirection.includes("right")) {
        const maxAllowedWidth = window.innerWidth - dragStart.x;
        newWidth = Math.max(
          minSizePixels.width,
          Math.min(
            maxSizePixels.width,
            Math.min(maxAllowedWidth, resizeStart.width + deltaX)
          )
        );
      }
      if (resizeDirection.includes("left")) {
        const maxAllowedWidth = resizeStart.width + dragStart.x;
        const proposedWidth = Math.max(
          minSizePixels.width,
          Math.min(
            maxSizePixels.width,
            Math.min(maxAllowedWidth, resizeStart.width - deltaX)
          )
        );
        newX = dragStart.x + (resizeStart.width - proposedWidth);
        newWidth = proposedWidth;
      }
      if (resizeDirection.includes("bottom")) {
        const maxAllowedHeight = window.innerHeight - dragStart.y;
        newHeight = Math.max(
          minSizePixels.height,
          Math.min(
            maxSizePixels.height,
            Math.min(maxAllowedHeight, resizeStart.height + deltaY)
          )
        );
      }
      if (resizeDirection.includes("top")) {
        const maxAllowedHeight = resizeStart.height + dragStart.y;
        const proposedHeight = Math.max(
          minSizePixels.height,
          Math.min(
            maxSizePixels.height,
            Math.min(maxAllowedHeight, resizeStart.height - deltaY)
          )
        );
        newY = dragStart.y + (resizeStart.height - proposedHeight);
        newHeight = proposedHeight;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection("");
  };

  // Traffic light control handlers
  const handleClose = () => {
    onClose();
  };

  const handleMinimize = () => {
    // Don't allow minimizing when maximized
    if (isMaximized) return;

    if (!isMinimized) {
      setPreviousState({ position, size });
    }
    setIsMinimized(!isMinimized);

    // Ensure window stays within bounds when minimizing
    const newHeight = isMinimized ? size.height : 40; // Reduced from 48 to 40
    const maxY = window.innerHeight - newHeight;
    if (position.y > maxY) {
      setPosition((prev) => ({ ...prev, y: Math.max(0, maxY) }));
    }
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      setPreviousState({ position, size });
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      // Restore previous state but ensure it's within current viewport
      const newPos = previousState.position;
      const newSize = previousState.size;
      const maxX = window.innerWidth - newSize.width;
      const maxY = window.innerHeight - newSize.height;

      setPosition({
        x: Math.max(0, Math.min(newPos.x, maxX)),
        y: Math.max(0, Math.min(newPos.y, maxY)),
      });
      setSize(previousState.size);
    }
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDragging ? "grabbing" : "resizing";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    resizeDirection,
    position,
    size,
    minSize,
    maxSize,
    resizable,
  ]);

  // Reset position when window opens (only on initial open)
  useEffect(() => {
    if (isOpen) {
      const newPosPixels = convertPositionToPixels(initialPosition);
      const newSizePixels = convertSizeToPixels(initialSize);

      // Ensure initial size doesn't exceed viewport
      const constrainedSize = {
        width: Math.min(newSizePixels.width, window.innerWidth),
        height: Math.min(newSizePixels.height, window.innerHeight),
      };

      // Ensure initial position keeps window within viewport
      const maxX = window.innerWidth - constrainedSize.width;
      const maxY = window.innerHeight - constrainedSize.height;
      const constrainedPosition = {
        x: Math.max(0, Math.min(newPosPixels.x, maxX)),
        y: Math.max(0, Math.min(newPosPixels.y, maxY)),
      };

      setPosition(constrainedPosition);
      setSize(constrainedSize);
      setIsMinimized(false);
      setIsMaximized(false);
    }
  }, [isOpen]); // Only depend on isOpen, not initialPosition/initialSize

  // Handle browser window resize
  useEffect(() => {
    const handleWindowResize = () => {
      if (!isOpen) return;

      // Recalculate pixel values for percentage-based constraints
      const newMinSizePixels = convertSizeToPixels(minSize);
      const newMaxSizePixels = convertSizeToPixels(maxSize);

      const currentHeight = isMinimized ? 40 : size.height; // Updated to use 40
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - currentHeight;

      // Constrain position if window is outside viewport
      setPosition((prev) => ({
        x: Math.max(0, Math.min(prev.x, maxX)),
        y: Math.max(0, Math.min(prev.y, maxY)),
      }));

      // Constrain size if it's outside new bounds
      setSize((prev) => {
        const constrainedWidth = Math.max(
          newMinSizePixels.width,
          Math.min(
            newMaxSizePixels.width,
            Math.min(prev.width, window.innerWidth)
          )
        );
        const constrainedHeight = Math.max(
          newMinSizePixels.height,
          Math.min(
            newMaxSizePixels.height,
            Math.min(prev.height, window.innerHeight)
          )
        );
        return {
          width: constrainedWidth,
          height: constrainedHeight,
        };
      });

      // If maximized, update size to new viewport
      if (isMaximized) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [
    isOpen,
    size.width,
    size.height,
    isMinimized,
    isMaximized,
    minSize,
    maxSize,
  ]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      className={`fixed z-50 select-none ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 40 : size.height, // Reduced from 48 to 40
        transition: isMinimized ? "height 0.3s ease" : "none",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      {/* Window Container with Glass Effect */}
      <div
        className={`backdrop-blur-md border rounded-xl shadow-2xl overflow-visible h-full flex flex-col transition-colors duration-200 ${
          theme === "dark"
            ? "bg-black/25 border-white/10"
            : "bg-white/25 border-white/20"
        }`}
      >
        {/* Titlebar */}
        <div
          className={`window-titlebar backdrop-blur-md border-b rounded-t-xl px-4 py-3 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors duration-200 ${
            theme === "dark"
              ? "bg-black/10 border-white/10"
              : "bg-white/20 border-white/20"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {showControls && (
                <>
                  <button
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    title="Close"
                  />
                  <button
                    onClick={handleMinimize}
                    disabled={isMaximized}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      isMaximized
                        ? "bg-gray-400 cursor-not-allowed opacity-50"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                    title={
                      isMaximized
                        ? "Cannot minimize when maximized"
                        : "Minimize"
                    }
                  />
                  <button
                    onClick={handleMaximize}
                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                    title={isMaximized ? "Restore" : "Maximize"}
                  />
                </>
              )}
            </div>

            {/* Centered title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {title}
              </span>
            </div>

            {/* Spacer to balance the layout */}
            <div className="w-0"></div>
          </div>
        </div>

        {/* Window Content */}
        {!isMinimized && (
          <div className="flex-1 p-6 overflow-auto">{children}</div>
        )}

        {/* Resize Handles */}
        {resizable && !isMaximized && !isMinimized && (
          <>
            {/* Corner handles */}
            <div
              className="absolute -top-2 -left-2 w-6 h-6 cursor-nw-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
            />
            <div
              className="absolute -top-2 -right-2 w-6 h-6 cursor-ne-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
            />
            <div
              className="absolute -bottom-2 -left-2 w-6 h-6 cursor-sw-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
            />
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 cursor-se-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
            />

            {/* Edge handles */}
            <div
              className="absolute -top-2 left-6 right-6 h-4 cursor-n-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "top")}
            />
            <div
              className="absolute -bottom-2 left-6 right-6 h-4 cursor-s-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
            />
            <div
              className="absolute -left-2 top-6 bottom-6 w-4 cursor-w-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "left")}
            />
            <div
              className="absolute -right-2 top-6 bottom-6 w-4 cursor-e-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "right")}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};
