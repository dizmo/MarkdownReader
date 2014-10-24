Class("MarkdownReader.VideoConverter", {
    my: {
        methods: {
            toFlash: function (html) {
                var $video = jQuery (html);
                var urlFlashPlayer = JSON.parse (
                    dizmo.privateStorage().getProperty('urlFlashPlayer'));
                var urlNoFlashImage = JSON.parse (
                    dizmo.privateStorage().getProperty('urlNoFlashImage'));

                var attribute = {
                    // HTML5 <video> tag special attributes; see:
                    // http://www.html5rocks.com/en/tutorials/video/basics
                    autoplay: $video.attr('autoplay'),
                    controls: $video.attr('controls'),
                    height: $video.attr('height'),
                    loop: $video.attr('loop'),
                    name: $video.attr('name'),
                    muted: $video.attr('muted'),
                    poster: $video.attr('poster'),
                    preload: $video.attr('preload'), // {none, metadata, auto}; ignored!
                    src: $video.attr('src'),
                    style: $video.attr('style'),
                    width: $video.attr('width')
                };

                if (attribute.src === undefined) {
                    attribute.src = $video.find('> source').attr('src');
                }

                var flashvar = {
                    // Basic configuration options; see: http://help.adobe.com/en_US/
                    // FMPSMP/Dev/WS3fd35e178bb08cb3-49a02f129f1468bd6-7fff.html
                    audioPan: $video.attr('_audioPan'),
                    autoPlay: $video.attr('_autoPlay'),
                    bufferingOverlay: $video.attr('_bufferingOverlay'),
                    controlBarAutoHide: $video.attr('_controlBarAutoHide'),
                    controlBarAutoHideTimeout: $video.attr('_controlBarAutoHideTimeout'),
                    controlBarMode: $video.attr('_controlBarMode')||'none',
                    endOfVideoOverlay: $video.attr('_endOfVideoOverlay'),
                    muted: $video.attr('_muted'),
                    loop: $video.attr('_loop'),
                    playButtonOverlay: $video.attr('_playButtonOverlay'),
                    poster: $video.attr('_poster'),
                    volume: $video.attr('_volume'),

                    // General advanced options; see: http://help.adobe.com/en_US/
                    // FMPSMP/Dev/WS3fd35e178bb08cb3-49a02f129f1468bd6-7ff9.html
                    backgroundColor: $video.attr('_backgroundColor'),
                    clipEndTime: $video.attr('_clipEndTime'),
                    clipStartTime: $video.attr('_clipStartTime'),
                    configuration: $video.attr('_configuration'),
                    haltOnError: $video.attr('_haltOnError'),
                    highQualityThreshold: $video.attr('_highQualityThreshold'),
                    scaleMode: $video.attr('_scaleMode')||'zoom',
                    skin: $video.attr('_skin'),
                    streamType: $video.attr('_streamType'),
                    verbose: $video.attr('_verbose')
                }, flashvars = '';

                // HTML5 <video> tag special attributes:
                if (attribute.autoplay !== undefined)
                    flashvars += '&autoPlay=true';
                if (attribute.controls === undefined)
                    flashvars += '&controlBarMode=none';
                if (attribute.loop !== undefined)
                    flashvars += '&loop=true';
                if (attribute.muted !== undefined)
                    flashvars += '&muted=true';
                if (attribute.poster !== undefined)
                    flashvars += '&poster=' + attribute.poster;
                if (attribute.src !== undefined)
                    flashvars += '&src=' + attribute.src;

                // SMP -- Basic configuration options:
                if (flashvar.audioPan !== undefined)
                    flashvars += '&audioPan=' + flashvar.audioPan;
                if (flashvar.autoPlay !== undefined)
                    flashvars += '&autoPlay=' + flashvar.autoPlay;
                if (flashvar.bufferingOverlay !== undefined)
                    flashvars += '&bufferingOverlay=' + flashvar.bufferingOverlay;
                if (flashvar.controlBarMode !== undefined)
                    flashvars += '&controlBarMode=' + flashvar.controlBarMode;
                if (flashvar.controlBarAutoHide !== undefined)
                    flashvars += '&controlBarAutoHide=' + flashvar.controlBarAutoHide;
                if (flashvar.controlBarAutoHideTimeout !== undefined)
                    flashvars += '&controlBarAutoHideTimeout=' + flashvar.controlBarAutoHideTimeout;
                if (flashvar.endOfVideoOverlay !== undefined)
                    flashvars += '&endOfVideoOverlay=' + flashvar.endOfVideoOverlay;
                if (flashvar.loop !== undefined)
                    flashvars += '&loop=' + flashvar.loop;
                if (flashvar.muted !== undefined)
                    flashvars += '&muted=' + flashvar.muted;
                if (flashvar.playButtonOverlay !== undefined)
                    flashvars += '&playButtonOverlay=' + flashvar.playButtonOverlay;
                if (flashvar.poster !== undefined)
                    flashvars += '&poster=' + flashvar.poster;
                if (flashvar.volume !== undefined)
                    flashvars += '&volume=' + flashvar.volume;

                // SMP -- General advanced options:
                if (flashvar.backgroundColor !== undefined)
                    flashvars += '&backgroundColor=' + flashvar.backgroundColor;
                if (flashvar.clipEndTime !== undefined)
                    flashvars += '&clipEndTime=' + flashvar.clipEndTime;
                if (flashvar.clipStartTime !== undefined)
                    flashvars += '&clipStartTime=' + flashvar.clipStartTime;
                if (flashvar.configuration !== undefined)
                    flashvars += '&configuration=' + flashvar.configuration;
                if (flashvar.haltOnError !== undefined)
                    flashvars += '&haltOnError=' + flashvar.haltOnError;
                if (flashvar.highQualityThreshold !== undefined)
                    flashvars += '&highQualityThreshold=' + flashvar.highQualityThreshold;
                if (flashvar.scaleMode !== undefined)
                    flashvars += '&scaleMode=' + flashvar.scaleMode;
                if (flashvar.skin !== undefined)
                    flashvars += '&skin=' + flashvar.skin;
                if (flashvar.streamType !== undefined)
                    flashvars += '&streamType=' + flashvar.streamType;
                if (flashvar.verbose !== undefined)
                    flashvars += '&verbose=' + flashvar.verbose;

                var $object = jQuery(
                    '<object height="{0}" name="{1}" style="{2}" type="{3}" width="{4}">'
                        .replace('{0}', attribute.height||'')
                        .replace('{1}', attribute.name||'')
                        .replace('{2}', attribute.style||'')
                        .replace('{3}', 'application/x-shockwave-flash')
                        .replace('{4}', attribute.width||''))
                    .append(jQuery('<param>', {
                        name: 'movie', value: urlFlashPlayer}))
                    .append(jQuery('<param>', {
                        name: 'flashvars', value: flashvars.replace(/^&/, '')}));

                var $img = $video.find('> img');
                if ($img.length == 0) {
                    $img = jQuery(
                        '<img alt="{0}" height="{1}" width="{2}" src="{3}">'
                            .replace('{0}', $video.find('> p').html()||'no flash player')
                            .replace('{1}', attribute.height||'')
                            .replace('{2}', attribute.width||'')
                            .replace('{3}', urlNoFlashImage||''));
                }

                return $object.append($img).prop('outerHTML').replace(/&amp;/g, '&');
            }
        }
    }
});
