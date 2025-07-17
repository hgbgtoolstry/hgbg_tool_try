document.addEventListener("DOMContentLoaded", function () {
  // --- 元素获取 ---
  const inputs = {
    avatarUpload: document.getElementById("avatar-upload"),
    name: document.getElementById("name"),
    nickname: document.getElementById("nickname"),
    contactInfo: document.getElementById("contact-info"),
    affiliation: document.getElementById("affiliation"),
  };

  const previews = {
    avatar: document.getElementById("preview-avatar"),
    name: document.getElementById("preview-name"),
    nickname: document.getElementById("preview-nickname"),
    contactInfo: document.getElementById("preview-contact-info"),
    affiliation: document.getElementById("preview-affiliation"),
  };

  const sliders = {
    nameSize: document.getElementById("name-size"),
    nicknameSize: document.getElementById("nickname-size"),
    contactInfoSize: document.getElementById("contact-info-size"),
    affiliationSize: document.getElementById("affiliation-size"),
  };

  const sliderValues = {
    nameSize: document.getElementById("name-size-value"),
    nicknameSize: document.getElementById("nickname-size-value"),
    contactInfoSize: document.getElementById("contact-info-size-value"),
    affiliationSize: document.getElementById("affiliation-size-value"),
  };

  const exportBtn = document.getElementById("export-btn");
  const cardElement = document.getElementById("business-card");

  // --- 更新函数 ---
  const updateName = () => (previews.name.textContent = inputs.name.value);
  const updateNickname = () =>
    (previews.nickname.textContent = inputs.nickname.value);
  const updateContactInfo = () => {
    previews.contactInfo.innerHTML = inputs.contactInfo.value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  };
  const updateAffiliation = () =>
    (previews.affiliation.textContent = inputs.affiliation.value);

  // --- 通用滑块处理函数 ---
  const setupFontSizeSlider = (slider, targetElement, valueLabel) => {
    const update = () => {
      const size = slider.value;
      targetElement.style.fontSize = `${size}px`;
      valueLabel.textContent = `${size}px`;
    };
    slider.addEventListener("input", update);
    update(); // 初始化
  };

  // --- 事件监听设置 ---
  function setupEventListeners() {
    // 文本输入
    inputs.name.addEventListener("input", updateName);
    inputs.nickname.addEventListener("input", updateNickname);
    inputs.contactInfo.addEventListener("input", updateContactInfo);
    inputs.affiliation.addEventListener("input", updateAffiliation);

    // 图片上传
    inputs.avatarUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.avatar.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // 初始化所有滑块
    setupFontSizeSlider(sliders.nameSize, previews.name, sliderValues.nameSize);
    setupFontSizeSlider(
      sliders.nicknameSize,
      previews.nickname,
      sliderValues.nicknameSize
    );
    setupFontSizeSlider(
      sliders.contactInfoSize,
      previews.contactInfo,
      sliderValues.contactInfoSize
    );
    setupFontSizeSlider(
      sliders.affiliationSize,
      previews.affiliation,
      sliderValues.affiliationSize
    );

    // 导出按钮
    exportBtn.addEventListener("click", onExport);
  }

  // --- 初始化内容 ---
  function initializeContent() {
    updateName();
    updateNickname();
    updateContactInfo();
    updateAffiliation();
  }

  // --- 导出功能 ---
  function onExport() {
    exportBtn.textContent = "生成中...";
    exportBtn.disabled = true;

    // 使用 scale 选项来控制输出分辨率
    // 目标宽度 1100px / 预览宽度 550px = 2
    const exportScale = 2;

    html2canvas(cardElement, {
      scale: exportScale,
      useCORS: true,
      backgroundColor: null, // 使用DOM元素的背景色
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "business-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        exportBtn.textContent = "生成并导出名片 (1100x620)";
        exportBtn.disabled = false;
      })
      .catch((err) => {
        console.error("名片生成失败:", err);
        alert("名片生成失败！请检查浏览器控制台获取错误信息。");
        exportBtn.textContent = "生成并导出名片 (1100x620)";
        exportBtn.disabled = false;
      });
  }

  // --- 启动应用 ---
  initializeContent();
  setupEventListeners();
});
