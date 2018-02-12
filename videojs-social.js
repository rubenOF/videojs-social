/*!
 videojs-social - v1.5.2 - 2015-09-15
 * Copyright (c) 2015 Brightcove; Licensed https://accounts.brightcove.com/en/terms-and-conditions
 */

/*! videojs-social - v0.0.0 - 2014-5-1
 * Copyright (c) 2014 Brightcove */
(function (window, videojs) {
    'use strict';

    // Allocate all variables to be used
    var defaults = {
            title: '',
            description: '',
            url: '',
            embed: '',
            services: {
                facebook: true,
                google: true,
                twitter: true,
                tumblr: true,
                pinterest: true,
                linkedin: true
            },
            temporary: false,
        },
        social,
        SocialButton,
        SocialOverlay,
        SocialInlineButton;

    /**
     * Initialize the plugin.
     * @param options (optional) {object} configuration for the plugin
     */
    social = function (options) {

        var settings,
            player = this;

        var playerEL = player.el();
        // Merge options with the buttons defaults
        settings = videojs.mergeOptions(defaults, options);

        // Make sure that at least one social service is specified
        //  If not, then do not add the social button
        if (!(settings &&
            settings.services &&
            (settings.services.facebook ||
            settings.services.twitter ||
            settings.services.google ||
            settings.services.tumblr ||
            settings.services.pinterest ||
            settings.services.linkedin))) {
            throw new Error('videojs-social requires at least one service to be enabled');
        }

        player.ready(function() {
            var controlBar = playerEL.parentNode.querySelector('.vjs-control-bar');

            // If we are being re-initialized then remove the old stuff
            if (controlBar.socialButton) {
                controlBar.removeChild(player.controlBar.socialButton);
                delete controlBar.socialButton;

                if (player.socialOverlay) {
                    player.removeChild(player.socialOverlay);
                    delete player.socialOverlay;
                }
            }
            // // Add social button to player
            videojs.options.children.push('socialButton');

            player.socialOverlay = player.addChild('socialOverlay', settings);

            player.socialOverlay.on('modalclose', function () {
                var player = this.player();

                player.bigPlayButton.show();
            });
            player.socialOverlay.on('modalopen', function () {
                var player = this.player();

                player.bigPlayButton.hide();
            });
        });
    };

    /*
     * The "Share" control bar button
     */
    SocialButton = videojs.extend(videojs.getComponent('Button'), {
        controlText_: 'Share',
        buildCSSClass: function() {
            return 'vjs-share-button vjs-control vjs-button vjs-menu-button';
        },
        handleClick: function(event) {
            var player = this.player();

            player.socialOverlay.open();
        }
    });
    videojs.registerComponent('SocialButton', SocialButton);

    /*
     * The "Share" inline button
     */
    SocialInlineButton = videojs.extend(videojs.getComponent('Button'), {
        controlText_: 'Share',
        buildCSSClass: function() {
            return 'vjs-share-control';
        },
        handleClick: function(event) {
            var player = this.player();

            player.socialOverlay.open();
        },
    });
    videojs.registerComponent('SocialInlineButton', SocialInlineButton);

    /*
     * The overlay panel that is toggled when the SocialButton is clicked
     */
    var ModalDialog = videojs.getComponent('ModalDialog');
    SocialOverlay = videojs.extend(ModalDialog, {
        buildCSSClass: function() {
            var buttonClass = ModalDialog.prototype.buildCSSClass();
            return 'vjs-sharing-container ' + buttonClass;
        },
        content: function() {
            var options = this.options_;

            return this._addSocialButtons(options.services);
        },
        open: function() {
            ModalDialog.prototype.open.call(this);
            var options = this.options_;

            if (!this.called) {
                this._bindServiceButtons(options.services);
            }

            this.called = true;
        }
    });

    /*
     * Iterates through the list of selected social services and creates their html
     */
    SocialOverlay.prototype._addSocialButtons = function (services) {

        var service, el, title;

        el = videojs.dom.createEl('div', {
            className: 'vjs-sharing-content',
            innerHTML: '<div/>',
        });
        title = el.firstChild;
        title.className += ' vjs-sharing-heading';
        title.innerHTML = player.localize('Share video');

        // Iterate through supported services and construct html
        for (service in services) {
            if (services[service] === true) {
                this._addServiceButton(el, service);
            }
        }

        // return html
        return el;
    };

    /*
     * Iterates through the list of selected social services and binds the href to the anchor
     */
    SocialOverlay.prototype._bindServiceButtons = function (services) {
        var player = this.player(),
            options = this.options_;

        var service,
            encodedUrl,
            encodedTitle,
            encodedDescription,
            encodedPoster,
            posterUrl = player.poster();

        // if there is a poster image, encode the url
        if (posterUrl) {
            encodedPoster = encodeURIComponent(posterUrl);
        }

        encodedUrl = encodeURIComponent(this._getUrl());
        encodedTitle = encodeURIComponent(this._getTitle());
        encodedDescription = encodeURIComponent(options.description);

        // Iterate through supported services and construct html
        for (service in services) {
            if (services[service] === true) {
                this._bindServiceButton(service, encodedUrl, encodedTitle, encodedDescription, encodedPoster, posterUrl);
            }
        }
    };

    /*
     *  Binds the correct href url to the matching service button
     */
    SocialOverlay.prototype._bindServiceButton = function (service, encodedUrl, encodedTitle, encodedDescription, encodedPoster, posterUrl) {
        var link, elementSelector;

        // Switch on the requested service
        switch (service) {
            // Facebook
            case 'facebook':
                // Bind Facebook button
                elementSelector = '.vjs-icon-facebook';
                link = 'https://www.facebook.com/sharer/sharer.php?u={URL}&title={TITLE}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle);

                break;

            // Google+
            case 'google':
                // Bind Google+ button
                elementSelector = '.vjs-icon-gplus';
                link = 'https://plus.google.com/share?url={URL}'.replace('{URL}', encodedUrl);

                break;

            // Twitter
            case 'twitter':
                // Bind Twitter button
                elementSelector = '.vjs-icon-twitter';
                link = 'https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&text={TITLE}&tw_p=tweetbutton&url={URL}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle);

                break;

            // Tumblr
            case 'tumblr':
                // Bind Tumblr button
                elementSelector = '.vjs-icon-tumblr';
                link = 'http://www.tumblr.com/share?v=3&u={URL}&t={TITLE}'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle);

                break;

            // Pinterest
            case 'pinterest':
                // Bind Pinterest button if there is a poster image available otherwise the link will not work
                elementSelector = '.vjs-icon-pinterest';
                link = 'https://pinterest.com/pin/create/button/?url={URL}{POSTER}&description={TITLE}&is_video=true'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle).replace('{POSTER}', encodedPoster ? '&media=' + encodedPoster : '');

                break;

            // LinkedIn
            case 'linkedin':
                // Bind LinkedIn button
                elementSelector = '.vjs-icon-linkedin';
                link = 'https://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&summary={DESCRIPTION}&source=Classic'.replace('{URL}', encodedUrl).replace('{TITLE}', encodedTitle).replace('{DESCRIPTION}', encodedDescription);

                break;

            default:
                throw new Error('An unsupported social service was specified.');
        }

        if (elementSelector) {
            var elt = this.el().querySelector(elementSelector);
            elt.href = link;
        }
    };

    /*
     * Determines the URL to be dispayed in the share dialog
     */
    SocialOverlay.prototype._getUrl = function () {
        var url,
            options = this.options_;

        // Determine the custom base url
        // In IE8, window.parent doesn't === window, but it does == equal it.
        // jshint -W116
        if (options.url) {
            url = options.url;
        } else if (window.parent != window) {
            url = document.referrer;
        } else {
            url = window.location.href;
        }
        // jshint +W116

        return url;
    };

    /*
     * Updates the title based on the media date or the custom options setting
     */
    SocialOverlay.prototype._getTitle = function () {
        var playerOptions,
            options = this.options_,
            player = this.player(),
            title = options.title;

        // If there's no title try and find one in the options
        if (!title) {
            // Get player options
            playerOptions = player.options_;

            // Search the player options data media for a title
            if (playerOptions['data-media'] && playerOptions['data-media'].title) {
                title = playerOptions['data-media'].title;
            }
        }

        return title || '';
    };

    /*
     * addServiceButton - Creates a link that appears as a social sharing button.
     */
    SocialOverlay.prototype._addServiceButton = function (el, service) {

        var link = '';
        var player = this.player();

        // Switch on the requested service
        switch (service) {
            // Facebook
            case 'facebook':
                link = '<a class="vjs-icon-facebook" aria-role="link" aria-label="Share on Facebook" tabindex="1" title="Facebook" target="_blank"><span class="vjs-control-text">Facebook</span></a>';
                break;

            // Google+
            case 'google':
                link = '<a class="vjs-icon-gplus" aria-role="link" aria-label="Share on Google Plus" tabindex="2" title="Google+" target="_blank"><span class="vjs-control-text">Google+</span></a>';
                break;

            // Twitter
            case 'twitter':
                link = '<a class="vjs-icon-twitter" aria-role="link" aria-label="Share on Twitter" tabindex="3" title="Twitter" target="_blank"><span class="vjs-control-text">Twitter</span></a>';
                break;

            // Tumblr
            case 'tumblr':
                link = '<a class="vjs-icon-tumblr" aria-role="link" aria-label="Share on Tumblr" tabindex="4" title="Tumblr" target="_blank"><span class="vjs-control-text">tumblr</span></a>';
                break;

            // Pinterest
            case 'pinterest':
                link = '<a class="vjs-icon-pinterest" aria-role="link" aria-label="Share on Pinterest" tabindex="5" title="Pinterest" target="_blank"><span class="vjs-control-text">Pinterest</span></a>';
                break;

            // LinkedIn
            case 'linkedin':
                link = '<a class="vjs-icon-linkedin" aria-role="link" aria-label="Share on LinkedIn" tabindex="6" title="LinkedIn" target="_blank"><span class="vjs-control-text">LinkedIn</span></a>';
                break;

            default:
                throw new Error('An unsupported social service was specified.');
        }

        var controlTextEl_ = videojs.dom.createEl('div', {
            className: 'vjs-sharing-icon-container',
            innerHTML: link,
        });

        el.appendChild(controlTextEl_);
    };

    var ControlBar = videojs.getComponent('ControlBar');
    ControlBar.prototype.options_.children.splice(ControlBar.prototype.options_.children.length - 1, 0, 'socialButton');

    videojs.registerComponent('SocialOverlay', SocialOverlay);

    // register the plugin
    videojs.registerPlugin('social', social);

    // End the closure
})(window, window.videojs);
