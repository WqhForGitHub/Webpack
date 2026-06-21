// src/index.js
// 图片懒加载入口：使用 IntersectionObserver 监听元素是否进入视口
// 进入视口后通过 import() 动态加载图片资源（webpack 会为每个图片生成独立 chunk）

console.log("[lazy-load] 图片懒加载 demo 启动");

// 图片名 -> 异步加载函数
// 使用 webpackChunkName 魔法注释命名 chunk，便于在 Network 中观察
const imageLoaders = {
  img1: () =>
    import(/* webpackChunkName: "image-1" */ "./images/img1.svg"),
  img2: () =>
    import(/* webpackChunkName: "image-2" */ "./images/img2.svg"),
  img3: () =>
    import(/* webpackChunkName: "image-3" */ "./images/img3.svg"),
  img4: () =>
    import(/* webpackChunkName: "image-4" */ "./images/img4.svg"),
};

function lazyLoad() {
  const placeholders = document.querySelectorAll(".placeholder");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const key = el.dataset.img;
          const loader = imageLoaders[key];
          if (!loader) return;

          console.log(`[lazy-load] 元素 ${key} 进入视口，开始加载图片`);
          loader().then((module) => {
            const url = module.default;
            el.innerHTML = `<img src="${url}" alt="${key}" />`;
            el.classList.add("loaded");
            console.log(`[lazy-load] ${key} 加载完成: ${url}`);
          });

          // 加载后取消监听
          observer.unobserve(el);
        }
      });
    },
    { rootMargin: "100px" }
  );

  placeholders.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", lazyLoad);
