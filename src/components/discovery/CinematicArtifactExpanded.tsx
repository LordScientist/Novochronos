import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Artifact } from '../../types/artifact';
import { CinematicScienceExperience } from '../scenes/CinematicScienceExperience';

interface CinematicArtifactExpandedProps {
  artifact: Artifact;
  originRect: DOMRect | null;
  onClose: () => void;
  onLaunchGame?: (artifact: Artifact) => void;
}

export const CinematicArtifactExpanded: React.FC<CinematicArtifactExpandedProps> = ({
  artifact,
  originRect,
  onClose,
  onLaunchGame,
}) => {
  // FLIP Expansion Transition States
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trigger FLIP expansion on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsExpanded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Prevent background page scrolling while artifact is expanded
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle closing with smooth reverse FLIP animation
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsExpanded(false);

    // Wait for reverse transition duration before unmounting
    setTimeout(() => {
      onClose();
    }, 550);
  }, [isClosing, onClose]);

  // Keyboard navigation: Escape key closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Calculate inline styles for FLIP transition
  const getContainerStyle = (): React.CSSProperties => {
    if (!originRect || isExpanded) {
      return {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        opacity: 1,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    // Initial and Collapsing position matches the exact origin card rect
    return {
      top: `${originRect.top}px`,
      left: `${originRect.left}px`,
      width: `${originRect.width}px`,
      height: `${originRect.height}px`,
      borderRadius: '16px',
      opacity: isClosing ? 0.3 : 1,
      transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none">
      {/* Background Dimming Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main Shared-Element Expanding Container */}
      <div
        ref={containerRef}
        style={getContainerStyle()}
        className="fixed z-50 bg-[#02040a] border border-white/15 overflow-hidden flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
      >
        <CinematicScienceExperience
          artifact={artifact}
          onClose={handleClose}
          onLaunchGame={onLaunchGame}
        />
      </div>
    </div>
  );
};
