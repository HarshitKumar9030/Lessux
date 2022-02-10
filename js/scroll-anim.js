/**
 * Scroll Anim
 * Animations when element is visible on viewport after scroll
 * ------------
 * Version : 0.1
 * 
 * default container class : scroll-anim
 * Add attribute  data-anim-visible="animation-name" an element to activate it
 */

;
(function() {
    'use strict'

    var scrollAnim

    class ScrollAnim {

        constructor(element, config) {
            // Support instantiation without the `new` keyword.
            if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollAnim.prototype) {
                return new ScrollAnim(element, config);
            }
            scrollAnim = this; // Save reference to instance.
            scrollAnim.version = '1.0';
            scrollAnim.container = _resolveContainer(element);
            scrollAnim.initialized = false;
            if (config) {
                // scrollAnim.config = config;
                scrollAnim.config.containerClass = config.containerClass || scrollAnim.config.containerClass
            }

            return scrollAnim;
        }
        init() {
            if (scrollAnim && scrollAnim.container) {
                _init();
            } else {
                console.log('ScrollAnim: initiation failed.');
            }
            return scrollAnim;
        }
    }

    /**
     * Configuration
     * -------------
     * This object signature can be passed directly to the ScrollAnim constructor,
     * or as the second argument of the `reveal()` method.
     */
    ScrollAnim.prototype.config = {
        container: document.querySelector('.scroll-anim'),
        containerClass: 'scroll-anim',
    }


    /**
     * Private Methods
     */
    function _init() {

        // Intersection observer required
        if (!!window.IntersectionObserver) {
            // let animContainer = document.querySelector('.scroll-anim');
            let observer;
            let observerOptions = {
                root: null,
                rootMargin: "0px",
                threshold: [0.15, 0.5, 1]
            }

            observer = new IntersectionObserver(_observerFunction, observerOptions);
            scrollAnim.container.querySelectorAll('[data-anim-visible]')
                .forEach(element => {
                    element.classList.add('anim-ready');
                    observer.observe(element);
                });

            // Fade in animation
            let fadeElts = scrollAnim.container.querySelectorAll('[data-anim-visible="fade"]');
            fadeElts.forEach(fadeElt => {
                /* let animBegin = 0.0;
                if (fadeElt.getAttribute('data-anim-start')) {
                    animBegin = parseFloat(fadeElt.getAttribute('data-anim-start'))
                    fadeElt.style.transitionDelay = `${animBegin}s`
                                
                } */
            })

            // Text letter by letter animation 
            // uncomment below and use the if condition below for only large devices)
            // if (window.innerWidth > 768 && !!window.IntersectionObserver) {
            let byLetterElts = scrollAnim.container.querySelectorAll('[data-anim-visible="by-letter"]');
            byLetterElts.forEach(byCharElt => {
                // Take into account delay, and start of the animations
                let animBegin = 0.0;
                if (byCharElt.getAttribute('data-anim-start')) {
                    animBegin = parseFloat(byCharElt.getAttribute('data-anim-start'))
                }
                let animLetterParam = 0.02;
                if (byCharElt.getAttribute('data-anim-letter-delay')) {
                    animLetterParam = parseFloat(byCharElt.getAttribute('data-anim-letter-delay'))
                }
                let animLineParam = 0.0;
                if (byCharElt.getAttribute('data-anim-line-delay')) {
                    animLineParam = parseFloat(byCharElt.getAttribute('data-anim-line-delay'))
                }
                // console.log(animLineParam)
                let lines = byCharElt.childNodes;
                let letterIndex = 0;
                let lineIndex = 0;
                // Split by lines
                lines.forEach((line) => {
                    if (line.tagName === 'BR') {

                    } else {
                        let lineTag = "span";
                        let lineClass = "line";
                        if (line.nodeName !== "#text") {
                            lineTag = line.nodeName
                            lineClass = `${lineClass} ${line.className}`
                        }
                        // let lineNode = document.createElement('span');
                        let lineNode = document.createElement(lineTag);
                        lineNode.className += lineClass
                        // Split by words
                        let words = line.textContent.replace(/(\r\n|\n|\r|\t)/g, " ").replace(/  +/g, " ").trim().split(' ');
                        // let beginLine = (lineIndex - 1) * animLineParam
                        words.forEach((word) => {
                            let wordNode = document.createElement('span');
                            wordNode.classList.add('word');
                            word = word + ' '
                            // Split by letters
                            let letters = word.split('');
                            letters.forEach((letter) => {
                                let letterNode = document.createElement('span');
                                letterNode.classList.add('letter');
                                letterNode.innerText = letter;
                                // Set the delay for each letters
                                let animDelay = animBegin + letterIndex * animLetterParam + (lineIndex) * animLineParam;
                                letterNode.style.transitionDelay = `${animDelay}s`
                                wordNode.appendChild(letterNode)
                                letterIndex++
                            })
                            lineNode.appendChild(wordNode)
                        })
                        lineIndex++
                        line.replaceWith(lineNode)
                    }
                })
            })
        } else {
            console.log('Scroll anim disabled : Intersection observer not available on this browser')
        }
    }

    function _observerFunction(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-visible');
                let animBegin = 0.0;
                if (entry.target.getAttribute('data-anim-start')) {
                    animBegin = parseFloat(entry.target.getAttribute('data-anim-start'))
                    entry.target.style.transitionDelay = `${animBegin}s`

                }
                observer.unobserve(entry.target);
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
                console.log('ScrollAnim: invalid container "' + container + '" provided.')
                console.log('ScrollAnim: falling back to default container.')
            }
        }
        return scrollAnim.config.container
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
        module.exports = ScrollAnim
    } else {
        window.ScrollAnim = ScrollAnim
    }
    // if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    //     define(function () {
    //         return ScrollAnim
    //     })
    // } else if (typeof module !== 'undefined' && module.exports) {
    //     module.exports = ScrollAnim
    // } else {
    //     window.ScrollAnim = ScrollAnim
    // }
})();