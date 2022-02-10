/**
 * Scroll behaviours for multi sections main tag
 * It inculdes :
 * Pager
 * Add active class to a section if it is visible
 * Element can detect if a section is active (useful for menu on top)
 * Add content-white class to element (navbar, fixed footer, sidebar) which react to section with .content-white class
 * Add attribute  data-section-anchor="section-id" to a menu to add active class when the section is visible
 * ------------
 * Version : 0.1
 * 
 * default container class : sections-scroll
 * default section class : section
 */

;
(function() {
    'use strict'

    var sectionScroll

    class SectionScroll {

        constructor(element, config) {
            // Support instantiation without the `new` keyword.
            if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== SectionScroll.prototype) {
                return new SectionScroll(element, config);
            }
            sectionScroll = this; // Save reference to instance.
            sectionScroll.version = '1.0';
            sectionScroll.container = _resolveContainer(element);
            sectionScroll.initialized = false;
            if (config) {
                sectionScroll.config.sectionClass = config.sectionClass || sectionScroll.config.sectionClass
                sectionScroll.config.containerClass = config.containerClass || sectionScroll.config.containerClass
                sectionScroll.config.navDotContainer = config.navDotContainer || sectionScroll.config.navDotContainer
                sectionScroll.config.changeOnSectionColor = config.changeOnSectionColor || sectionScroll.config.changeOnSectionColor
            }

            return sectionScroll;
        }
        init() {
            if (sectionScroll && sectionScroll.container) {
                _init();
            } else {
                console.log('sectionScroll: initiation failed.');
            }
            return sectionScroll;
        }
    }

    /**
     * Configuration
     * -------------
     * This object signature can be passed directly to the sectionScroll constructor,
     * or as the second argument of the `reveal()` method.
     */
    SectionScroll.prototype.config = {
        container: document.querySelector('.sections-scroll'),
        sectionClass: 'section',
        containerClass: 'sections-scroll',
        navDotContainer: '.nav-dot-container',
        changeOnSectionColor: '[data-on-section-color]',
    }


    /**
     * Private Methods
     */
    function _init() {
        // Sections list
        sectionScroll.sections = sectionScroll.container.querySelectorAll(`.${sectionScroll.config.sectionClass}`);
        sectionScroll.activeSectionIndex = 0;

        // Add dot nav
        let navDotContainer = null;
        if (sectionScroll.config.navDotContainer) {
            navDotContainer = document.querySelector(sectionScroll.config.navDotContainer)
            // console.log(sectionScroll.config.navDotContainer)
        }
        if (!navDotContainer) {
            if (sectionScroll.config.navDotContainer) {
                console.log(`${sectionScroll.config.navDotContainer} navDotContainer not found`)
            }
        } else {
            sectionScroll.dotNavWrapper = document.createElement('ul')
            sectionScroll.dotNavWrapper.classList.add('nav-dots')
            sectionScroll.sections.forEach(function(section, index) {
                // Create new dot (an a tag wrapped inside a li tag)
                let dotNavItem = document.createElement('li');
                dotNavItem.classList.add('nav-item');
                let dotNavLink = document.createElement('a');
                dotNavLink.classList.add('nav-link');
                // Set click attribute to the dot element
                // use id a attribute
                if (section.getAttribute('id')) {
                    dotNavLink.setAttribute('href', `#${section.getAttribute('id')}`)
                } else {
                    dotNavLink.addEventListener('click', function() {
                        window.scrollTo(0, section.offsetTop)
                    })
                }
                dotNavItem.appendChild(dotNavLink);
                sectionScroll.dotNavWrapper.appendChild(dotNavItem);
            });
            // document.querySelector('.nav-dot-container').appendChild(dotNavWrapper)
            if (sectionScroll.config.navDotContainer) {
                navDotContainer = document.querySelector(sectionScroll.config.navDotContainer)
            }
            if (navDotContainer == null) {
                navDotContainer = document.createElement('nav')
            }
            navDotContainer.classList.add('nav-dot-container')
            navDotContainer.appendChild(sectionScroll.dotNavWrapper)
            document.body.appendChild(navDotContainer)
        }

        // Section events on scroll
        sectionScroll.dotNavItems = [];
        if (sectionScroll.dotNavWrapper) {
            sectionScroll.dotNavItems = sectionScroll.dotNavWrapper.querySelectorAll('.nav-item');
        }
        sectionScroll.sectionAnchorItems = [];
        sectionScroll.sectionAnchorItems = document.querySelectorAll('[data-section-anchor]');
        // First active section will be the first section
        sectionScroll.activeSection = document.querySelector('.page-main > .section');;

        // Section that will change on content-color
        sectionScroll.changeColorItems = document.querySelectorAll(sectionScroll.config.changeOnSectionColor);
        if (!sectionScroll.initialized) {
            _scrollHandler()
            window.addEventListener('scroll', _scrollHandler)
            sectionScroll.initialized = true
        }
        return sectionScroll
    }

    function _scrollHandler() {
        sectionScroll.sections.forEach(function(section, index) {
            // Add active class to active section
            if (_isScrolledIntoSection(section)) {
                sectionScroll.activeSectionIndex = index;
                sectionScroll.activeSection = section;
                if (!section.classList.contains('active')) {
                    section.classList.add('active');
                }

            } else {
                section.classList.remove('active');
            }

            // If section is supperposed with a content color change element, then add class to the later one
            sectionScroll.changeColorItems.forEach(function(changeColorItem) {
                if (_isElementsSuperposed(section, changeColorItem)) {
                    if (section.classList.contains('content-white')) {
                        if (!changeColorItem.classList.contains('content-white')) {
                            changeColorItem.classList.add('content-white');
                        }
                    } else {
                        changeColorItem.classList.remove('content-white');
                    }
                    if (section.classList.contains('content-dark')) {
                        if (!changeColorItem.classList.contains('content-dark')) {
                            changeColorItem.classList.add('content-dark');
                        }
                    } else {
                        changeColorItem.classList.remove('content-dark');
                    }
                }
            });



            // Add active class to active dot-navs
            sectionScroll.dotNavItems.forEach(function(dotNavItem, index) {
                if (index === sectionScroll.activeSectionIndex) {
                    if (!dotNavItem.classList.contains('active')) {
                        dotNavItem.classList.add('active');
                    };
                } else {
                    dotNavItem.classList.remove('active')
                }
            })
        });

        // Section anchor link
        sectionScroll.sectionAnchorItems.forEach(function(sectionAnchorItem, index) {
            if (sectionScroll.activeSection.getAttribute('id') === sectionAnchorItem.getAttribute('data-section-anchor')) {
                if (!sectionAnchorItem.classList.contains('active')) {
                    sectionAnchorItem.classList.add('active');
                };
            } else {
                sectionAnchorItem.classList.remove('active')
            }
        })
    }

    function _resolveContainer(container) {
        if (container) {
            if (typeof container === 'string') {
                return window.document.documentElement.querySelector(container)
            } else if (_isNode(container)) {
                return container
            } else {
                console.log('sectionScroll: invalid container "' + container + '" provided.')
                console.log('sectionScroll: falling back to default container.')
            }
        }
        return sectionScroll.config.container
    }

    function _isElementsSuperposed(el1, el2) {
        let el1Rect = el1.getBoundingClientRect();
        let el2Rect = el2.getBoundingClientRect();
        if (el1Rect.top <= el2Rect.bottom &&
            el2Rect.top <= el1Rect.bottom) {
            return true;
        }
        return false
    }

    // JS Helpers and utilities 
    function _isScrolledIntoSection(el, boundary = 1 / 3) {
        let rect = el.getBoundingClientRect();
        let elemTop = rect.top;
        let elemBottom = rect.bottom;

        let viewLimit = window.innerHeight * boundary;
        let isVisible = false;
        isVisible = elemTop < viewLimit && elemBottom >= viewLimit
        return isVisible
    }

    // Utilities
    function _isNode(object) {
        return typeof window.Node === 'object' ?
            object instanceof window.Node :
            object && typeof object === 'object' &&
            typeof object.nodeType === 'number' &&
            typeof object.nodeName === 'string'
    }


    /**
     * Module Wrapper
     * --------------
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SectionScroll
    } else {
        window.SectionScroll = SectionScroll
    }
    // if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    //     define(function () {
    //         return sectionScroll
    //     })
    // } else if (typeof module !== 'undefined' && module.exports) {
    //     module.exports = sectionScroll
    // } else {
    //     window.sectionScroll = sectionScroll
    // }
})();