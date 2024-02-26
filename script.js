let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
      }
      const dirX = x - this.touchX;
      const dirY = y - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
      this.prevX = x;
      this.prevY = y;
    };

    const startHandler = (x, y) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if (this.rotating) {
        this.prevX = this.touchX;
        this.prevY = this.touchY;
      } else {
        this.prevX = x;
        this.prevY = y;
      }
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
      // Check if all papers are dragged
      const allPapersDragged = Array.from(document.querySelectorAll('.paper')).every(p => {
        const rect = p.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      // Show the love-shaped button if all papers are dragged
      if (allPapersDragged) {
        const loveButton = document.getElementById('loveButton');
        loveButton.style.display = 'block';
      }
    };

    paper.addEventListener('mousedown', (e) => {
      startHandler(e.clientX, e.clientY);
    });

    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startHandler(touch.clientX, touch.clientY);
    });

    document.addEventListener('mousemove', (e) => {
      moveHandler(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      moveHandler(touch.clientX, touch.clientY);
    });

    document.addEventListener('mouseup', () => {
      endHandler();
    });

    document.addEventListener('touchend', () => {
      endHandler();
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
