/* pixelated-modal.js
   Simple pixelation modal that opens when elements with data-image are clicked.
*/
(function(){
  function createModal(src, opts={}){
    const width = opts.width || 400;
    const height = opts.height || 500;
    const cellSize = opts.cellSize || 3;
    const dotScale = typeof opts.dotScale === 'number' ? opts.dotScale : 0.9;
    const backgroundColor = opts.backgroundColor || '#000';
    const tintColor = opts.tintColor || null;
    const tintStrength = opts.tintStrength || 0;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = 99999;
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backdropFilter = 'blur(6px)';

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.borderRadius = '12px';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)';
    container.style.background = backgroundColor;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.background = backgroundColor;
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.right = '8px';
    closeBtn.style.top = '8px';
    closeBtn.style.background = 'rgba(255,255,255,0.06)';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '8px';
    closeBtn.style.width = '34px';
    closeBtn.style.height = '34px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = 3;
    container.appendChild(closeBtn);

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    let raf = null;
    let mouse = { x: width/2, y: height/2 };
    function onMove(e){
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      const cy = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
      mouse.x = Math.max(0, Math.min(width, cx - rect.left));
      mouse.y = Math.max(0, Math.min(height, cy - rect.top));
    }

    function drawPixelated(){
      // draw scaled down image to offscreen then scale up with imageSmoothing disabled
      const offW = Math.max(1, Math.floor(width / cellSize));
      const offH = Math.max(1, Math.floor(height / cellSize));
      const off = document.createElement('canvas');
      off.width = offW;
      off.height = offH;
      const offCtx = off.getContext('2d');

      // draw image to offscreen
      try{
        offCtx.drawImage(img, 0, 0, offW, offH);
      }catch(e){
        offCtx.fillStyle = '#222'; offCtx.fillRect(0,0,offW,offH);
      }

      // now draw onto main canvas scaling up without smoothing
      ctx.save();
      ctx.clearRect(0,0,width,height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, offW, offH, 0, 0, width, height);

      if (tintColor && tintStrength > 0) {
        ctx.fillStyle = tintColor;
        ctx.globalAlpha = tintStrength;
        ctx.fillRect(0,0,width,height);
        ctx.globalAlpha = 1;
      }

      // subtle follow distortion: draw a radial lighten at mouse
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(width,height)/2);
      grad.addColorStop(0, 'rgba(255,255,255,0.02)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,width,height);

      ctx.restore();
      raf = requestAnimationFrame(drawPixelated);
    }

    function start(){
      canvas.addEventListener('mousemove', onMove, { passive: true });
      canvas.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('touchmove', onMove, { passive: true });
      raf = requestAnimationFrame(drawPixelated);
    }

    function destroy(){
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onMove);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      overlay.remove();
    }

    closeBtn.addEventListener('click', destroy);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) destroy(); });
    window.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ destroy(); window.removeEventListener('keydown', esc);} }, { once: false });

    img.onload = () => { start(); };
    img.onerror = () => { start(); };
    return { destroy };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const sEl = document.getElementById('logo-S');
    const yEl = document.getElementById('logo-Y');
    function attach(el){ if(!el) return; el.addEventListener('click', ()=>{ const src = el.dataset.image; createModal(src, { width:400, height:500, cellSize:3, tintColor:'#fff', tintStrength:0.06 }); }); el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); el.click(); } }); }
    attach(sEl); attach(yEl);
  });

})();
