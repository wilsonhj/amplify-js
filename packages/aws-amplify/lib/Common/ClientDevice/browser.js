"use strict";
/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Hub_1 = require("../Hub");
var Logger_1 = require("../Logger");
var logger = new Logger_1.ConsoleLogger('ClientDevice_Browser');
function clientInfo() {
    if (typeof window === 'undefined') {
        return;
        { }
    }
    return browserClientInfo();
}
exports.clientInfo = clientInfo;
function browserClientInfo() {
    if (typeof window === 'undefined') {
        logger.warn('No window object available to get browser client info');
        return {};
    }
    var nav = window.navigator;
    if (!nav) {
        logger.warn('No navigator object available to get browser client info');
        return {};
    }
    var platform = nav.platform, product = nav.product, vendor = nav.vendor, userAgent = nav.userAgent, language = nav.language;
    var type = browserType(userAgent);
    var timezone = browserTimezone();
    return {
        'platform': platform,
        'make': product || vendor,
        'model': type.type,
        'version': type.version,
        'appVersion': [type.type, type.version].join('/'),
        'language': language,
        'timezone': timezone
    };
}
function dimension() {
    if (typeof window === 'undefined') {
        logger.warn('No window object available to get browser client info');
        return { width: 320, height: 320 };
    }
    return {
        'width': window.innerWidth,
        'height': window.innerHeight
    };
}
exports.dimension = dimension;
function browserTimezone() {
    var tzMatch = /.+\(([A-Z]+)\)/.exec(new Date().toString());
    return tzMatch[1] || "";
}
function browserType(userAgent) {
    var operaMatch = /.+(Opera[\s[A-Z]*|OPR[\sA-Z]*)\/([0-9\.]+).*/i.exec(userAgent);
    if (operaMatch) {
        return { type: operaMatch[1], version: operaMatch[2] };
    }
    var cfMatch = /.+(Chrome|Firefox|FxiOS)\/([0-9\.]+).*/i.exec(userAgent);
    if (cfMatch) {
        return { type: cfMatch[1], version: cfMatch[2] };
    }
    var ieMatch = /.+(Trident|Edge)\/([0-9\.]+).*/i.exec(userAgent);
    if (ieMatch) {
        return { type: ieMatch[1], version: ieMatch[2] };
    }
    var sMatch = /.+(Safari)\/([0-9\.]+).*/i.exec(userAgent);
    if (sMatch) {
        return { type: sMatch[1], version: sMatch[2] };
    }
    var awkMatch = /.+(AppleWebKit)\/([0-9\.]+).*/i.exec(userAgent);
    if (awkMatch) {
        return { type: awkMatch[1], version: awkMatch[2] };
    }
    var anyMatch = /.*([A-Z]+)\/([0-9\.]+).*/i.exec(userAgent);
    if (anyMatch) {
        return { type: anyMatch[1], version: anyMatch[2] };
    }
    return { type: '', version: '' };
}
if (typeof window !== 'undefined') {
    window.addEventListener('resize', function () {
        Hub_1.default.dispatch('window', { event: 'resize', data: dimension() }, 'DeviceInfo');
    });
    window.addEventListener('scroll', function () {
        var pos = { x: window.scrollX, y: window.scrollY };
        Hub_1.default.dispatch('window', { event: 'scroll', data: pos }, 'DeviceInfo');
    });
    window.addEventListener('offline', function () {
        Hub_1.default.dispatch('window', { event: 'offline' }, 'DeviceInfor');
    });
    window.addEventListener('online', function () {
        Hub_1.default.dispatch('window', { event: 'online' }, 'DeviceInfor');
    });
}
//# sourceMappingURL=browser.js.map