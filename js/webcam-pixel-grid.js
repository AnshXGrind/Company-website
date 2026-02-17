// Lightweight WebcamPixelGrid fallback component
// Usage: add a <div id="webcam-grid-root" data-cols="60" data-rows="40" ...></div>
(function(){
  function q(sel, root=document){return root.querySelector(sel)}

  function createGrid(root){
    const cols = parseInt(root.dataset.cols) || 60;
    const rows = parseInt(root.dataset.rows) || 40;
    const maxElevation = parseFloat(root.dataset.maxElevation) || 50;
    const motionSensitivity = parseFloat(root.dataset.motionSensitivity) || 0.25;
    const gapRatio = parseFloat(root.dataset.gapRatio) || 0.05;
    const mirror = root.dataset.mirror === 'true';
    const invert = root.dataset.invert === 'true';
    const darken = parseFloat(root.dataset.darken) || 0.6;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    root.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let vw = 0, vh = 0;

    function resize(){
      vw = Math.max(1, root.clientWidth);
      vh = Math.max(1, root.clientHeight);
      canvas.width = vw;
      canvas.height = vh;
    }
    resize();
    window.addEventListener('resize', resize);

    // small offscreen canvas for sampling
    const sample = document.createElement('canvas');
    sample.width = cols;
    sample.height = rows;
    const sctx = sample.getContext('2d');

    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    let usingWebcam = false;

    function fallbackNoise(t){
      sctx.clearRect(0,0,cols,rows);
      const img = sctx.createImageData(cols,rows);
      for(let i=0;i<img.data.length;i+=4){
        const v = Math.floor(128 + 64*Math.sin((t+i)/50));
        img.data[i]=img.data[i+1]=img.data[i+2]=v;
        img.data[i+3]=255;
      }
      sctx.putImageData(img,0,0);
    }

    function draw(){
      if (usingWebcam && video.readyState >= 2) {
        try { sctx.drawImage(video, 0, 0, cols, rows); } catch(e) { /* ignore */ }
      }

      const data = sctx.getImageData(0,0,cols,rows).data;
      ctx.clearRect(0,0,vw,vh);
      const tileW = vw / cols;
      const tileH = vh / rows;
      const gapW = tileW * gapRatio;
      const gapH = tileH * gapRatio;
      const drawW = Math.max(1, tileW - gapW);
      const drawH = Math.max(1, tileH - gapH);

      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          const i = (y*cols + x)*4;
          let r = data[i], g = data[i+1], b = data[i+2];
          let luminance = (0.2126*r + 0.7152*g + 0.0722*b)/255;
          if (invert) luminance = 1 - luminance;
          const alpha = Math.max(0, Math.min(1, (luminance * (1 - darken))));
          const cx = mirror ? (cols - 1 - x) : x;
          const left = Math.round(cx * tileW + gapW/2);
          const top = Math.round(y * tileH + gapH/2);

          // color mode: use sampled color darkened
          const colR = Math.round(r * (1 - darken * (1 - luminance)));
          const colG = Math.round(g * (1 - darken * (1 - luminance)));
          const colB = Math.round(b * (1 - darken * (1 - luminance)));

          ctx.fillStyle = `rgba(${colR},${colG},${colB},${Math.max(0.06, alpha)})`;
          ctx.fillRect(left, top, Math.ceil(drawW), Math.ceil(drawH));
        }
      }
      requestAnimationFrame(draw);
    }

    // start fallback loop until webcam ready or error
    let t0 = 0;
    function fallbackLoop(ts){
      if (!usingWebcam) fallbackNoise(ts || 0);
      t0 = ts; requestAnimationFrame(fallbackLoop);
    }
    requestAnimationFrame(fallbackLoop);

    function startVideoStream(){
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(stream => {
        usingWebcam = true;
        video.srcObject = stream;
        video.addEventListener('play', () => {
          // replace fallback sampling with live sampling
          function sampleLoop(){
            try { sctx.drawImage(video, 0, 0, cols, rows); } catch(e){}
            requestAnimationFrame(sampleLoop);
          }
          sampleLoop();
          draw();
        });
      }).catch(err=>{
        console.warn('WebcamPixelGrid: webcam refused or not available', err);
      });
    }

    // attempt to start, but be quiet if blocked
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      startVideoStream();
    }

    return { destroy(){ try{ video.srcObject && video.srcObject.getTracks().forEach(t=>t.stop()); }catch(e){} window.removeEventListener('resize', resize); root.removeChild(canvas); } };
  }

  // Auto-init any root present
  document.addEventListener('DOMContentLoaded', ()=>{
    const root = document.getElementById('webcam-grid-root');
    if (!root) return;
    // ensure root styling
    root.style.position = 'absolute';
    root.style.inset = '0';
    root.style.zIndex = '0';
    root.style.pointerEvents = 'none';
    root.dataset.cols = root.dataset.cols || '60';
    root.dataset.rows = root.dataset.rows || '40';
    createGrid(root);
  });

})();
