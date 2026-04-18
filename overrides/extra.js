/**
 * 实验室知识库 - 自定义JavaScript
 * 功能：导航折叠、侧栏收缩/展开、搜索框点击外部关闭
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initNavToggle();
        initSidebarToggle();
        initSearchDismiss();
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
     * 侧栏收缩/展开功能
     * 点击顶栏三横线按钮切换侧栏，状态持久化到localStorage
     */
    function initSidebarToggle() {
        var toggleBtn = document.getElementById('lab-sidebar-toggle');
        if (!toggleBtn) return;

        var isHidden = document.documentElement.classList.contains('sidebar-hidden');
        toggleBtn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');

        toggleBtn.addEventListener('click', function() {
            var nowHidden = document.documentElement.classList.toggle('sidebar-hidden');
            toggleBtn.setAttribute('aria-expanded', nowHidden ? 'false' : 'true');
            localStorage.setItem('lab-sidebar-hidden', nowHidden ? 'true' : 'false');
        });
    }

    /**
     * 搜索框交互增强
     * 1. 聚焦搜索输入框时，自动勾选 #__search 以激活搜索结果面板
     * 2. 点击搜索区域外部时，取消勾选以关闭搜索
     */
    function initSearchDismiss() {
        var searchToggle = document.getElementById('__search');
        if (!searchToggle) return;

        var searchInput = document.querySelector('.md-search__input');
        var searchContainer = document.querySelector('.md-search');

        // 聚焦搜索输入框时激活搜索（勾选checkbox以显示结果面板）
        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                if (!searchToggle.checked) {
                    searchToggle.checked = true;
                    searchToggle.dispatchEvent(new Event('change'));
                }
            });
        }

        // 点击搜索区域外部时关闭搜索（使用mousedown更可靠）
        document.addEventListener('mousedown', function(e) {
            if (!searchToggle.checked) return;
            if (searchContainer && !searchContainer.contains(e.target)) {
                searchToggle.checked = false;
                searchToggle.dispatchEvent(new Event('change'));
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                }
            }
        });

        // Escape键关闭搜索
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchToggle.checked) {
                searchToggle.checked = false;
                searchToggle.dispatchEvent(new Event('change'));
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                }
            }
        });
    }

})();
