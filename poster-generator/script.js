document.addEventListener("DOMContentLoaded", function () {
  // --- 元素获取 ---
  const inputs = {
    topTitle: document.getElementById("top-title"),
    mainTitle1: document.getElementById("main-title-1"),
    mainTitle2: document.getElementById("main-title-2"),
    imageUpload: document.getElementById("image-upload"),
    subtitle: document.getElementById("subtitle"),
    subtitleHighlight: document.getElementById("subtitle-highlight"),
    credits: document.getElementById("credits"),
  };

  const previews = {
    topTitleContainer: document.getElementById("preview-top-title-container"),
    mainTitleContainer: document.getElementById("preview-main-title-container"),
    subtitleContainer: document.getElementById("preview-subtitle-container"),
    creditsContainer: document.getElementById("preview-credits-container"),
    image: document.getElementById("preview-image"),
  };

  const sliders = {
    // 字号滑块
    topTitleSize: document.getElementById("top-title-size"),
    mainTitleSize: document.getElementById("main-title-size"),
    subtitleSize: document.getElementById("subtitle-size"),
    creditsSize: document.getElementById("credits-size"),
    // 间距滑块
    spacingTop: document.getElementById("spacing-top"),
    spacingTitleGap: document.getElementById("spacing-title-gap"),
    spacingMainToImage: document.getElementById("spacing-main-to-image"),
    spacingImageToSub: document.getElementById("spacing-image-to-sub"),
    spacingSubToCredits: document.getElementById("spacing-sub-to-credits"),
  };

  const sliderValues = {
    // 字号值
    topTitleSize: document.getElementById("top-title-size-value"),
    mainTitleSize: document.getElementById("main-title-size-value"),
    subtitleSize: document.getElementById("subtitle-size-value"),
    creditsSize: document.getElementById("credits-size-value"),
    // 间距值
    spacingTop: document.getElementById("spacing-top-value"),
    spacingTitleGap: document.getElementById("spacing-title-gap-value"),
    spacingMainToImage: document.getElementById("spacing-main-to-image-value"),
    spacingImageToSub: document.getElementById("spacing-image-to-sub-value"),
    spacingSubToCredits: document.getElementById(
      "spacing-sub-to-credits-value"
    ),
  };

  const exportBtn = document.getElementById("export-btn");
  const posterElement = document.getElementById("poster");

  // --- 更新函数 ---
  const updateTopTitle = () =>
    (document.getElementById("preview-top-title").textContent =
      inputs.topTitle.value);
  const updateMainTitle = () => {
    document.getElementById("preview-main-title-1").textContent =
      inputs.mainTitle1.value;
    document.getElementById("preview-main-title-2").textContent =
      inputs.mainTitle2.value;
  };
  const updateSubtitle = () => {
    const fullText = inputs.subtitle.value;
    const highlightText = inputs.subtitleHighlight.value;
    let safeText = fullText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let outputHtml = safeText.replace(/\n/g, "<br>");

    if (highlightText) {
      const safeHighlightText = highlightText
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const highlightedHtml = `<span class="text-with-gradient-excerpt">${safeHighlightText}</span>`;
      outputHtml = outputHtml.replace(
        new RegExp(
          safeHighlightText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "g"
        ),
        highlightedHtml
      );
    }
    previews.subtitleContainer.innerHTML = outputHtml;
  };
  const updateCredits = () => {
    previews.creditsContainer.innerHTML = inputs.credits.value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  };

  // --- 通用滑块处理函数 ---
  // 修改：处理字号 (px)
  const setupFontSizeSlider = (slider, targetElement, valueLabel) => {
    const update = () => {
      const size = slider.value;
      targetElement.style.fontSize = `${size}px`; // 使用px
      valueLabel.textContent = `${size}px`; // 显示px
    };
    slider.addEventListener("input", update);
    update();
  };
  // 处理间距
  const setupSpacingSlider = (slider, cssVariable, valueLabel) => {
    const update = () => {
      const value = slider.value;
      posterElement.style.setProperty(cssVariable, `${value}%`);
      valueLabel.textContent = `${value}%`;
    };
    slider.addEventListener("input", update);
    update(); // 修复：在页面加载时立即根据滑块的初始值更新CSS
  };

  // --- 事件监听设置 ---
  function setupEventListeners() {
    // 文本输入
    inputs.topTitle.addEventListener("input", updateTopTitle);
    inputs.mainTitle1.addEventListener("input", updateMainTitle);
    inputs.mainTitle2.addEventListener("input", updateMainTitle);
    inputs.subtitle.addEventListener("input", updateSubtitle);
    inputs.subtitleHighlight.addEventListener("input", updateSubtitle);
    inputs.credits.addEventListener("input", updateCredits);

    // 图片上传
    inputs.imageUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // 初始化所有滑块
    setupFontSizeSlider(
      sliders.topTitleSize,
      previews.topTitleContainer,
      sliderValues.topTitleSize
    );
    setupFontSizeSlider(
      sliders.mainTitleSize,
      previews.mainTitleContainer,
      sliderValues.mainTitleSize
    );
    setupFontSizeSlider(
      sliders.subtitleSize,
      previews.subtitleContainer,
      sliderValues.subtitleSize
    );
    setupFontSizeSlider(
      sliders.creditsSize,
      previews.creditsContainer,
      sliderValues.creditsSize
    );

    setupSpacingSlider(
      sliders.spacingTop,
      "--spacing-top",
      sliderValues.spacingTop
    );
    setupSpacingSlider(
      sliders.spacingTitleGap,
      "--spacing-title-gap",
      sliderValues.spacingTitleGap
    );
    setupSpacingSlider(
      sliders.spacingMainToImage,
      "--spacing-main-to-image",
      sliderValues.spacingMainToImage
    );
    setupSpacingSlider(
      sliders.spacingImageToSub,
      "--spacing-image-to-sub",
      sliderValues.spacingImageToSub
    );
    setupSpacingSlider(
      sliders.spacingSubToCredits,
      "--spacing-sub-to-credits",
      sliderValues.spacingSubToCredits
    );

    // 导出按钮
    exportBtn.addEventListener("click", onExport);
  }

  // --- 初始化内容 ---
  function initializeContent() {
    previews.image.src = "default-image.png";
    posterElement.style.backgroundImage = `url('head_background.png')`;

    updateTopTitle();
    updateMainTitle();
    updateSubtitle();
    updateCredits();
  }

  // --- 导出功能 ---
  function onExport() {
    exportBtn.textContent = "生成中...";
    exportBtn.disabled = true;

    // 核心修复：使用 scale 选项来控制输出分辨率
    // 目标宽度 1242px / 预览宽度 621px = 2
    const exportScale = 2;

    html2canvas(posterElement, {
      // width 和 height 选项是用来裁剪的，我们用scale来控制整体分辨率
      // width: 1242,
      // height: 1660,
      scale: exportScale, // 关键！
      useCORS: true, // 允许加载跨域图片（如果字体或图片来自CDN）
      backgroundColor: "#ffffff", // 确保背景色
    })
      .then((canvas) => {
        // canvas的尺寸现在是 621*2=1242 x 830*2=1660
        const link = document.createElement("a");
        link.download = "poster-export.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        exportBtn.textContent = "生成并导出图片 (1242x1660)";
        exportBtn.disabled = false;
      })
      .catch((err) => {
        console.error("图片生成失败:", err);
        alert(
          "图片生成失败！请确保您正通过本地服务器 (http://localhost) 访问页面，并检查浏览器控制台获取错误信息。"
        );
        exportBtn.textContent = "生成并导出图片 (1242x1660)";
        exportBtn.disabled = false;
      });
  }

  // --- 启动应用 ---
  initializeContent();
  setupEventListeners();
});
