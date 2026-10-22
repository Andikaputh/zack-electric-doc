import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Menampilkan kertas (A4/Letter/F4) dengan skala otomatis agar SELURUH halaman
 * selalu terlihat di area preview — lebar dan tinggi ikut menyesuaikan.
 * `zoom` > 1 akan memperbesar kertas dan membuat area preview bisa digeser.
 */
export default function PaperScale({ zoom = 1, fitScale, children }) {
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
    const availableWidth = viewport.clientWidth - 8;

    // Tinggi yang tersedia diambil dari area scroll drawer, supaya satu
    // lembar kertas utuh (tidak terpotong) terlihat di layar.
    const drawerBody = viewport.closest('.drawer-body');
    let availableHeight = 0;
    if (drawerBody) {
      const drawerStyle = window.getComputedStyle(drawerBody);
      const paddingY =
        (parseFloat(drawerStyle.paddingTop) || 0) +
        (parseFloat(drawerStyle.paddingBottom) || 0);
      availableHeight = drawerBody.clientHeight - paddingY - 20;
    }
    if (!availableHeight || availableHeight < 0) {
      availableHeight = window.innerHeight - 160;
    }

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const fallbackFit = Math.min(
      1,
      availableWidth / paperWidth,
      availableHeight / paperHeight,
    );
    const activeFit = Number.isFinite(fitScale) ? fitScale : fallbackFit;

    setContainerWidth(availableWidth);
    setPaper({ width: paperWidth, height: paperHeight });
    setScale(activeFit * zoom);
  }, [zoom, fitScale]);

  useEffect(() => {
    recalc();

    const viewport = viewportRef.current;
    const inner = innerRef.current;
    const paperEl = inner?.firstElementChild;
    const drawerBody = viewport?.closest('.drawer-body');
    if (!viewport) return undefined;

    const observer = new ResizeObserver(recalc);
    observer.observe(viewport);
    if (paperEl) observer.observe(paperEl);
    if (drawerBody) observer.observe(drawerBody);

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
