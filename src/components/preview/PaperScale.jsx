import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Menampilkan kertas A4 (atau ukuran lain) dengan skala otomatis agar selalu
 * pas di lebar area preview. `zoom` > 1 akan memperbesar kertas dan membuat
 * area preview bisa digeser (scroll) ke samping.
 */
export default function PaperScale({ zoom = 1, children }) {
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [paper, setPaper] = useState({ width: 794, height: 1123 });
  const [containerWidth, setContainerWidth] = useState(0);

  const recalc = useCallback(() => {
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!viewport || !inner) return;

    const paperEl = inner.firstElementChild;
    const paperWidth = paperEl?.offsetWidth || 794;
    const paperHeight = paperEl?.offsetHeight || 1123;
    const available = viewport.clientWidth - 8;

    if (available <= 0) return;

    setContainerWidth(available);
    setPaper({ width: paperWidth, height: paperHeight });
    setScale(Math.min(1, available / paperWidth) * zoom);
  }, [zoom]);

  useEffect(() => {
    recalc();

    const viewport = viewportRef.current;
    const inner = innerRef.current;
    const paperEl = inner?.firstElementChild;
    if (!viewport) return undefined;

    const observer = new ResizeObserver(recalc);
    observer.observe(viewport);
    if (paperEl) observer.observe(paperEl);

    window.addEventListener('resize', recalc);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [recalc]);

  const scaledWidth = containerWidth > 0 ? paper.width * scale : undefined;

  return (
    <div className="paper-scale" ref={viewportRef}>
      <div
        className="paper-scale-space"
        style={{
          width: scaledWidth,
          height: paper.height * scale,
        }}
      >
        <div
          className="paper-scale-inner"
          ref={innerRef}
          style={{
            width: paper.width,
            height: paper.height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
