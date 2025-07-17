document.addEventListener("DOMContentLoaded", function () {
  // --- 元素获取 ---
  const inputs = {
    leftTitle1: document.getElementById("left-title-1"),
    leftTitle2: document.getElementById("left-title-2"),
    leftBgUpload: document.getElementById("left-bg-upload"),
    rightTitle1: document.getElementById("right-title-1"),
    rightTitle2: document.getElementById("right-title-2"),
    rightBgUpload: document.getElementById("right-bg-upload"),
  };

  const previews = {
    cover: document.getElementById("cover-preview"),
    leftPart: document.getElementById("preview-left"),
    rightPart: document.getElementById("preview-right"),
    leftTitle1: document.getElementById("preview-left-title-1"),
    leftTitle2: document.getElementById("preview-left-title-2"),
    rightTitle1: document.getElementById("preview-right-title-1"),
    rightTitle2: document.getElementById("preview-right-title-2"),
    overlay: document.getElementById("preview-overlay"),
  };

  const sliders = {
    leftTitleSize1: document.getElementById("left-title-size-1"),
    leftTitleSize2: document.getElementById("left-title-size-2"),
    leftLineGap: document.getElementById("left-line-gap"),
    rightTitleSize1: document.getElementById("right-title-size-1"),
    rightTitleSize2: document.getElementById("right-title-size-2"),
    rightLineGap: document.getElementById("right-line-gap"),
    overlayHeight: document.getElementById("overlay-height"),
    overlayOpacity: document.getElementById("overlay-opacity"),
  };

  const sliderValues = {
    leftTitleSize1: document.getElementById("left-title-size-1-value"),
    leftTitleSize2: document.getElementById("left-title-size-2-value"),
    leftLineGap: document.getElementById("left-line-gap-value"),
    rightTitleSize1: document.getElementById("right-title-size-1-value"),
    rightTitleSize2: document.getElementById("right-title-size-2-value"),
    rightLineGap: document.getElementById("right-line-gap-value"),
    overlayHeight: document.getElementById("overlay-height-value"),
    overlayOpacity: document.getElementById("overlay-opacity-value"),
  };

  const exportBtn = document.getElementById("export-btn");

  // --- 更新函数 ---
  const updateLeftTitles = () => {
    previews.leftTitle1.textContent = inputs.leftTitle1.value;
    previews.leftTitle2.textContent = inputs.leftTitle2.value;
  };

  const updateRightTitles = () => {
    previews.rightTitle1.textContent = inputs.rightTitle1.value;
    previews.rightTitle2.textContent = inputs.rightTitle2.value;
  };

  // --- 通用处理函数 ---

  const setupCssVariableSlider = (
    slider,
    valueLabel,
    targetElement,
    variableName,
    unit = "%"
  ) => {
    const update = () => {
      const value = slider.value;
      targetElement.style.setProperty(variableName, `${value}${unit}`);
      valueLabel.textContent = `${value}${unit}`;
    };
    slider.addEventListener("input", update);
    update();
  };

  const setupFontSizeSlider = (slider, valueLabel, targetElement) => {
    const update = () => {
      const size = slider.value;
      targetElement.style.fontSize = `${size}px`;
      valueLabel.textContent = `${size}px`;
    };
    slider.addEventListener("input", update);
    update();
  };

  const setupBgUpload = (uploadInput, targetDiv) => {
    uploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          targetDiv.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // --- 事件监听设置 ---
  function setupEventListeners() {
    // 文本输入
    inputs.leftTitle1.addEventListener("input", updateLeftTitles);
    inputs.leftTitle2.addEventListener("input", updateLeftTitles);
    inputs.rightTitle1.addEventListener("input", updateRightTitles);
    inputs.rightTitle2.addEventListener("input", updateRightTitles);

    // 图片上传
    setupBgUpload(inputs.leftBgUpload, previews.leftPart);
    setupBgUpload(inputs.rightBgUpload, previews.rightPart);

    // 字号滑块
    setupFontSizeSlider(
      sliders.leftTitleSize1,
      sliderValues.leftTitleSize1,
      previews.leftTitle1
    );
    setupFontSizeSlider(
      sliders.leftTitleSize2,
      sliderValues.leftTitleSize2,
      previews.leftTitle2
    );
    setupFontSizeSlider(
      sliders.rightTitleSize1,
      sliderValues.rightTitleSize1,
      previews.rightTitle1
    );
    setupFontSizeSlider(
      sliders.rightTitleSize2,
      sliderValues.rightTitleSize2,
      previews.rightTitle2
    );

    // 间距与样式滑块
    setupCssVariableSlider(
      sliders.leftLineGap,
      sliderValues.leftLineGap,
      previews.cover,
      "--left-line-gap",
      "px"
    );
    setupCssVariableSlider(
      sliders.rightLineGap,
      sliderValues.rightLineGap,
      previews.cover,
      "--right-line-gap",
      "px"
    );
    setupCssVariableSlider(
      sliders.overlayHeight,
      sliderValues.overlayHeight,
      previews.cover,
      "--overlay-height",
      "%"
    );

    const updateOpacity = () => {
      const value = sliders.overlayOpacity.value;
      previews.cover.style.setProperty("--overlay-opacity", value / 100);
      sliderValues.overlayOpacity.textContent = `${value}%`;
    };
    sliders.overlayOpacity.addEventListener("input", updateOpacity);
    updateOpacity();

    // 导出按钮
    exportBtn.addEventListener("click", onExport);
  }

  // --- 初始化内容 ---
  function initializeContent() {
    updateLeftTitles();
    updateRightTitles();
  }

  // --- 导出功能 (已修正) ---
  function onExport() {
    exportBtn.textContent = "生成中...";
    exportBtn.disabled = true;

    // 核心修正：严格遵循 "scale" 方案
    // 目标宽度 1283px / 预览宽度 641.5px = 2
    const exportScale = 2;

    html2canvas(previews.cover, {
      scale: exportScale, // 关键：使用 scale 放大画布
      useCORS: true, // 允许跨域图片
      backgroundColor: null, // 保持 CSS 定义的背景
      // **已移除错误的 onclone 函数**
    })
      .then((canvas) => {
        // canvas 的尺寸现在是 641.5 * 2 = 1283px 宽，高度按比例缩放
        const link = document.createElement("a");
        link.download = "wechat-cover-1283x383.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        exportBtn.textContent = "生成并导出图片 (1283x383)";
        exportBtn.disabled = false;
      })
      .catch((err) => {
        console.error("图片生成失败:", err);
        alert("图片生成失败！请检查浏览器控制台获取错误信息。");
        exportBtn.textContent = "生成并导出图片 (1283x383)";
        exportBtn.disabled = false;
      });
  }

  // --- 启动应用 ---
  initializeContent();
  setupEventListeners();
});
