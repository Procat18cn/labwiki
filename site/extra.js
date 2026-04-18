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
     * 点击搜索区域外部关闭搜索框
     * Material主题通过 #__search checkbox 控制搜索显示状态
     */
    function initSearchDismiss() {
        var searchToggle = document.getElementById('__search');
        if (!searchToggle) return;

        document.addEventListener('click', function(e) {
            if (!searchToggle.checked) return;

            var searchContainer = document.querySelector('.md-search');
            if (searchContainer && !searchContainer.contains(e.target)) {
                searchToggle.checked = false;
            }
        });
    }

})();
