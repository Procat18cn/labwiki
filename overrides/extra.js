/**
 * 实验室知识库 - 自定义JavaScript
 * 功能：导航折叠、搜索增强、emoji支持
 */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        initNavToggle();
        initSearchEnhancement();
        fixEmojiDisplay();
    });

    /**
     * 初始化导航折叠功能
     */
    function initNavToggle() {
        // 查找所有章节标题
        const sectionTitles = document.querySelectorAll('.lab-nav__section-title');

        sectionTitles.forEach(function(title) {
            const toggle = title.querySelector('.lab-nav__toggle');
            const parentItem = title.closest('.lab-nav__item');
            const nestedList = parentItem.querySelector('.lab-nav__list--nested');

            if (!toggle || !nestedList) return;

            // 检查是否有激活的子项
            const hasActiveChild = nestedList.querySelector('.lab-nav__item--active');

            // 初始化展开状态
            if (hasActiveChild) {
                parentItem.classList.add('lab-nav__item--expanded');
                nestedList.classList.add('lab-nav__list--expanded');
                title.setAttribute('aria-expanded', 'true');
            } else {
                title.setAttribute('aria-expanded', 'false');
            }

            // 点击折叠/展开
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isExpanded = title.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    // 折叠
                    nestedList.classList.remove('lab-nav__list--expanded');
                    parentItem.classList.remove('lab-nav__item--expanded');
                    title.setAttribute('aria-expanded', 'false');
                } else {
                    // 展开
                    nestedList.classList.add('lab-nav__list--expanded');
                    parentItem.classList.add('lab-nav__item--expanded');
                    title.setAttribute('aria-expanded', 'true');
                }
            });

            // 点击标题也可以切换（如果标题不是链接）
            const link = title.querySelector('.lab-nav__link');
            if (link && link.tagName === 'SPAN') {
                title.addEventListener('click', function(e) {
                    if (e.target === title || e.target === link) {
                        toggle.click();
                    }
                });
            }
        });
    }

    /**
     * 搜索增强
     */
    function initSearchEnhancement() {
        // 监听搜索框聚焦
        const searchInput = document.querySelector('.md-search__input');
        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                document.body.classList.add('search-active');
            });

            searchInput.addEventListener('blur', function() {
                setTimeout(function() {
                    document.body.classList.remove('search-active');
                }, 200);
            });
        }
    }

    /**
     * 修复Emoji显示
     */
    function fixEmojiDisplay() {
        // 检测系统是否支持彩色emoji
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText('\u{1F600}', 0, 16); // 尝试渲染一个emoji

        // 添加emoji支持类
        document.documentElement.classList.add('emoji-supported');

        // 为Linux系统添加特殊处理
        if (navigator.userAgent.indexOf('Linux') !== -1) {
            document.documentElement.classList.add('linux-emoji-fix');
        }
    }

    /**
     * 平滑滚动到锚点
     */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

})();
