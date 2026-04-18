/**
 * 实验室知识库 - 自定义JavaScript
 * 功能：导航折叠、搜索触发、Esc关闭搜索
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initNavToggle();
        initSearchTrigger();
    });

    /**
     * 初始化导航折叠功能
     */
    function initNavToggle() {
        var sectionTitles = document.querySelectorAll('.lab-nav__section-title');

        sectionTitles.forEach(function(title) {
            var toggle = title.querySelector('.lab-nav__toggle');
            var parentItem = title.closest('.lab-nav__item');
            var nestedList = parentItem.querySelector('.lab-nav__list--nested');

            if (!toggle || !nestedList) return;

            var hasActiveChild = nestedList.querySelector('.lab-nav__item--active');

            if (hasActiveChild) {
                parentItem.classList.add('lab-nav__item--expanded');
                nestedList.classList.add('lab-nav__list--expanded');
                title.setAttribute('aria-expanded', 'true');
            } else {
                title.setAttribute('aria-expanded', 'false');
            }

            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var isExpanded = title.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    nestedList.classList.remove('lab-nav__list--expanded');
                    parentItem.classList.remove('lab-nav__item--expanded');
                    title.setAttribute('aria-expanded', 'false');
                } else {
                    nestedList.classList.add('lab-nav__list--expanded');
                    parentItem.classList.add('lab-nav__item--expanded');
                    title.setAttribute('aria-expanded', 'true');
                }
            });

            var link = title.querySelector('.lab-nav__link');
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
     * 搜索触发：点击侧边栏搜索按钮打开Material搜索对话框，
     * 并自动聚焦搜索输入框
     */
    function initSearchTrigger() {
        var searchToggle = document.getElementById('__search');
        if (!searchToggle) return;

        // 当搜索对话框打开时，自动聚焦输入框
        searchToggle.addEventListener('change', function() {
            if (this.checked) {
                var input = document.querySelector('.md-search__input');
                if (input) {
                    setTimeout(function() { input.focus(); }, 100);
                }
            }
        });

        // Esc键关闭搜索
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchToggle.checked) {
                searchToggle.checked = false;
            }
        });
    }

})();
