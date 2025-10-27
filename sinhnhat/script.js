{
(function(){
  const gift = document.getElementById('giftcard');

  // tạo confetti helper
  function createConfetti(container, count=18){
    const conf = document.createElement('div');
    conf.className = 'confetti';
    for(let i=0;i<count;i++){
      const c = document.createElement('i');
      const colorList = ['#ff4d59','#ffd215','#28c9ff','#ff7fbf','#ffc617'];
      c.style.left = Math.random()*100 + '%';
      c.style.background = colorList[Math.floor(Math.random()*colorList.length)];
      c.style.animationDelay = (Math.random()*400)+'ms';
      c.style.transform = 'translateY(-20vh) rotate('+ (Math.random()*360)+'deg)';
      conf.appendChild(c);
    }
    container.appendChild(conf);
    // xóa confetti sau animation
    setTimeout(()=> conf.remove(), 2200);
  }

  function openFromRect(rect){
    // overlay phần nền (mờ)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 300ms ease';
    document.body.appendChild(overlay);

    // thẻ modal hiện tại sẽ được đặt chính xác lên vị trí giftcard
    const card = document.createElement('div');
    card.className = 'modal-card';
    // set vị trí bằng rect (vị trí tương ứng viewport)
    card.style.left = rect.left + 'px';
    card.style.top = rect.top + 'px';
    card.style.width = rect.width + 'px';
    card.style.height = rect.height + 'px';

    // nội dung bên trong (ẩn trước khi bung)
    card.innerHTML = `
    <div class="modal-content">
        <div class="letter-header">
            <div class="hearts">
                <span class="heart">💝</span>
                <span class="heart">💖</span>
                <span class="heart">💝</span>
            </div>
            <h1 class="letter-title">Happy Birthday!</h1>
        </div>

        <div class="letter-section">
            <p>🎉 Chúc mừng sinh nhật tuổi 17 của tôi! 🎂</p>
            <p>Một năm tuyệt vời nữa lại trôi qua, mang theo bao kỷ niệm đẹp và những trải nghiệm quý giá. Hôm nay là ngày đặc biệt - ngày của riêng tôi!</p>
        </div>

        

        <div style="color:red; text-align:center; font-size:50px;" class="letter-section">Chúc mừng sinh nhật! 🎂</div>
    </div>
    `;
    document.body.appendChild(card);

    // hiệu ứng layout: force reflow rồi bung ra giữa
    requestAnimationFrame(()=>{
      overlay.style.opacity = '1';

      const targetWidth = Math.min(window.innerWidth * 0.86, 720);
      const targetHeight = Math.min(window.innerHeight * 0.66, 520);

      // center bằng translate(-50%,-50%)
      card.style.transition = 'all 450ms cubic-bezier(.2,.9,.2,1)';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.transform = 'translate(-50%,-50%)';
      card.style.width = targetWidth + 'px';
      card.style.height = targetHeight + 'px';
      card.style.borderRadius = '12px';
      card.style.background = '#fff';

      // sau khi bung xong, thêm lớp open để show greeting animation
      setTimeout(()=>{
        card.classList.add('open');
        // thêm confetti
        createConfetti(card, 24);
      }, 300);
    });

    // đóng khi ấn nút hoặc click overlay
    function closeToRect(){
      overlay.style.opacity = '0';
      card.classList.remove('open');
      // animate trở về vị trí cũ
      card.style.transform = 'none';
      card.style.left = rect.left + 'px';
      card.style.top = rect.top + 'px';
      card.style.width = rect.width + 'px';
      card.style.height = rect.height + 'px';
      card.style.borderRadius = '6px';
      setTimeout(()=>{
        overlay.remove();
        card.remove();
      }, 420);
    }

    overlay.addEventListener('click', closeToRect);
    card.querySelector('.close-btn').addEventListener('click', closeToRect);
  }

  function createSparkles() {
    let sparkles = '';
    for(let i = 0; i < 20; i++) {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        sparkles += `<div class="sparkle" style="left:${left}%;top:${top}%;animation-delay:${delay}s"></div>`;
    }
    return sparkles;
  }

  if(gift){
    gift.addEventListener('click', function(e){
      const rect = gift.getBoundingClientRect();
      openFromRect(rect);
    });
  }
})();
}