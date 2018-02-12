# videojs-social
The social media plugin enables users to share a video through Facebook, Google+, Twitter, Tumblr, Pinterest and LinkedIn.

## Properties

For plugins in general, the options object is used to pass data to the plugin to customize initialization. In this case, you can use the following properties in this object:
title

    Type: string
    This is a custom title that will appear when your video is shared.

description

    Type: string
    This is a custom description that will be used by the social services which support it.

url

    Type: string
    This is the URL that points to your custom web page which has your video and the meta tags for sharing. Refer to the meta tags section for details on how to add the social media metadata to your player page.

embedCode

    Type: string
    This is the Brightcove player iframe embed code for sharing the video. This allows you to completely override the contents of the Embed Code field located in the sharing dialog.
    Social Media Embed Code
    You can get the value of this property by using the getEmbedCode() method.

services

Include all service properties in this object. To enable or disable support for a service, set the property value to true or false instead of removing them.

    facebook
        Type: boolean
        Default: true
        This enables the Facebook sharing icon.
    google
        Type: boolean
        Default: true
        This enables the Google+ sharing icon.
    twitter
        Type: boolean
        Default: true
        This enables the Twitter sharing icon.
    tumblr
        Type: boolean
        Default: true
        This enables the Tumblr sharing icon.
    pinterest
        Type: boolean
        Default: true
        This enables the Pinterest sharing icon.
    linkedin
        Type: boolean
        Default: true
        This enables the LinkedIn sharing icon
