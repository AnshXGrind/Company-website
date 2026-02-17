// World Map Animation (Vanilla JS)
// Based on connectivity visualization with animated arcs

class WorldMap {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.dots = options.dots || [];
    this.animationFrame = null;
    this.time = 0;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  
  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width * 2; // Retina
    this.canvas.height = rect.height * 2;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(2, 2);
  }
  
  latLngToXY(lat, lng) {
    const rect = this.container.getBoundingClientRect();
    // Simple equirectangular projection
    const x = (lng + 180) * (rect.width / 360);
    const y = (90 - lat) * (rect.height / 180);
    return { x, y };
  }
  
  drawArc(start, end, progress) {
    const ctx = this.ctx;
    const startXY = this.latLngToXY(start.lat, start.lng);
    const endXY = this.latLngToXY(end.lat, end.lng);
    
    // Bezier curve for arc
    const midX = (startXY.x + endXY.x) / 2;
    const midY = Math.min(startXY.y, endXY.y) - 50;
    
    ctx.beginPath();
    ctx.moveTo(startXY.x, startXY.y);
    
    for (let t = 0; t <= progress; t += 0.02) {
      const x = (1 - t) * (1 - t) * startXY.x + 2 * (1 - t) * t * midX + t * t * endXY.x;
      const y = (1 - t) * (1 - t) * startXY.y + 2 * (1 - t) * t * midY + t * t * endXY.y;
      ctx.lineTo(x, y);
    }
    
    const gradient = ctx.createLinearGradient(startXY.x, startXY.y, endXY.x, endXY.y);
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0)');
    gradient.addColorStop(progress, 'rgba(167, 139, 250, 0.8)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw moving dot
    const t = progress;
    const dotX = (1 - t) * (1 - t) * startXY.x + 2 * (1 - t) * t * midX + t * t * endXY.x;
    const dotY = (1 - t) * (1 - t) * startXY.y + 2 * (1 - t) * t * midY + t * t * endXY.y;
    
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(167, 139, 250, 1)';
    ctx.fill();
  }
  
  drawDot(lat, lng) {
    const { x, y } = this.latLngToXY(lat, lng);
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    // Pulse effect
    ctx.beginPath();
    ctx.arc(x, y, 6 + Math.sin(this.time * 2) * 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  animate() {
    const ctx = this.ctx;
    const rect = this.container.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw world map outline (simplified)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(20, 20, rect.width - 40, rect.height - 40);
    
    // Draw grid
    for (let i = 0; i <= 4; i++) {
      const x = 20 + (rect.width - 40) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, rect.height - 20);
      ctx.stroke();
      
      const y = 20 + (rect.height - 40) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(rect.width - 20, y);
      ctx.stroke();
    }
    
    // Draw connections
    this.dots.forEach((dot, i) => {
      const progress = Math.min(1, Math.max(0, (this.time - i * 0.5) % 3) / 2);
      if (progress > 0) {
        this.drawArc(dot.start, dot.end, progress);
      }
      this.drawDot(dot.start.lat, dot.start.lng);
      this.drawDot(dot.end.lat, dot.end.lng);
    });
    
    this.time += 0.016;
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorldMap;
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('world-map-container');
  if (mapContainer) {
    new WorldMap(mapContainer, {
      dots: [
        {
          start: { lat: 64.2008, lng: -149.4937 }, // Alaska
          end: { lat: 34.0522, lng: -118.2437 }    // Los Angeles
        },
        {
          start: { lat: 64.2008, lng: -149.4937 }, // Alaska
          end: { lat: -15.7975, lng: -47.8919 }   // Brazil
        },
        {
          start: { lat: -15.7975, lng: -47.8919 }, // Brazil
          end: { lat: 38.7223, lng: -9.1393 }     // Lisbon
        },
        {
          start: { lat: 51.5074, lng: -0.1278 },  // London
          end: { lat: 28.6139, lng: 77.209 }      // New Delhi
        },
        {
          start: { lat: 28.6139, lng: 77.209 },   // New Delhi
          end: { lat: 43.1332, lng: 131.9113 }    // Vladivostok
        },
        {
          start: { lat: 28.6139, lng: 77.209 },   // New Delhi
          end: { lat: -1.2921, lng: 36.8219 }     // Nairobi
        }
      ]
    });
  }
});
