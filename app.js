/*=========== Offline Fallback Check ===========*/
if (typeof window.jQuery === "undefined") {
    window.addEventListener("DOMContentLoaded", function () {
        var n = document.createElement("div");
        n.setAttribute("role", "status");
        n.style.cssText =
            "position:fixed;left:16px;right:16px;bottom:16px;padding:12px 16px;background:#111318;color:#fff;border-radius:10px;font:12px/1.5 system-ui,sans-serif;z-index:9999;box-shadow:0 12px 30px rgba(0,0,0,.25)";
        n.textContent =
            "Letterspace could not load jQuery (no internet connection?). The page needs a one-time online load to fetch jQuery; after that everything runs locally.";
        document.body.appendChild(n);
    });
}
/*=========== Main Application Initialization ===========*/
jQuery(function ($) {
    "use strict";
    /*=========== Default Configuration & Global State ===========*/
    var defaults = { 
        fontSize: 16, 
        percent: 5, 
        pixels: 0.8, 
        lhPercent: 150, 
        lhPixels: 24, 
        mode: "percent" 
    };
    var state = $.extend({}, defaults);
    var toastTimer;
    var recentTimer;
    var recent = [];
    /*=========== Cache DOM Elements ===========*/
    var $fontInput = $("#font-size");
    var $fontRange = $("#font-size-range");
    var $spacingInput = $("#spacing-value");
    var $spacingRange = $("#spacing-range");
    var $lhInput = $("#lineheight-value");
    var $lhRange = $("#lineheight-range");
    /*=========== Number Formatting & Sanitization Utilities ===========*/
    function cleanNumber(value, precision) {
        if (precision === undefined) precision = 3;
        var rounded = Number(Number(value).toFixed(precision));
        return Object.is(rounded, -0) ? 0 : rounded;
    }
    function formatNumber(value, precision) {
        return cleanNumber(value, precision).toString();
    }
    function shortNumber(value) {
        return cleanNumber(value, 2).toString();
    }
    function safeNumber(value, fallback) {
        var parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    /*=========== Dynamic Range Slider Background Fill ===========*/
    function updateRangeFill($range) {
        var min = Number($range.attr("min"));
        var max = Number($range.attr("max"));
        var value = Number($range.val());
        var fill = ((value - min) / (max - min)) * 100;
        $range.css(
            "background",
            "linear-gradient(to right, #1976f3 0%, #1976f3 " +
            fill +
            "%, #e5e9ef " +
            fill +
            "%, #e5e9ef 100%)"
        );
    }
    /*=========== Result Pulse Animation ===========*/
    function setResultPulse() {
        var $r1 = $("#result-value");
        var $r2 = $("#lh-result-value");
        $r1.removeClass("is-updating");
        $r2.removeClass("is-updating");
        if ($r1[0]) void $r1[0].offsetWidth;
        if ($r2[0]) void $r2[0].offsetWidth;
        $r1.addClass("is-updating");
        $r2.addClass("is-updating");
    }
    /*=========== Debounced Recent Calculations Scheduler ===========*/
    function scheduleRecent() {
        clearTimeout(recentTimer);
        recentTimer = setTimeout(function () {
            pushRecent(state.fontSize, state.percent, state.pixels, state.lhPercent, state.lhPixels);
        }, 420);
    }
    /*=========== History Storage Manager ===========*/
    function pushRecent(font, percent, pixels, lhPercent, lhPixels) {
        var key = shortNumber(font) + "|" + shortNumber(percent) + "|" + shortNumber(lhPercent);
        for (var i = recent.length - 1; i >= 0; i -= 1) {
            if (recent[i].key === key) recent.splice(i, 1);
        }
        recent.unshift({ key: key, font: font, percent: percent, pixels: pixels, lhPercent: lhPercent, lhPixels: lhPixels });
        while (recent.length > 4) recent.pop();
        renderRecent();
    }
    /*=========== Render History Chips UI ===========*/
    function renderRecent() {
        var $chips = $("#recent-chips");
        if (!recent.length) {
            $chips.html(
                '<span class="recent-empty">Your recent conversions will appear here.</span>'
            );
            return;
        }
        $chips.empty();
        recent.forEach(function (r) {
            var $chip = $(
                '<button type="button" class="recent-chip ripple-host"></button>'
            )
                .attr({ "data-font": r.font, "data-percent": r.percent, "data-lineheight": r.lhPercent })
                .html(
                    '<span class="dot"></span>' +
                    shortNumber(r.font) +
                    "px &middot; " +
                    shortNumber(r.percent) +
                    "% &rarr; " +
                    shortNumber(r.pixels) +
                    "px"
                );
            $chips.append($chip);
        });
    }
    /*=========== Core Typography Calculation Engine ===========*/
    function calculate() {
        state.fontSize = Math.max(1, safeNumber($fontInput.val(), state.fontSize));
        if (state.mode === "percent") {
            state.percent = safeNumber($spacingInput.val(), state.percent);
            state.pixels = cleanNumber(state.fontSize * (state.percent / 100));
            state.lhPercent = safeNumber($lhInput.val(), state.lhPercent);
            state.lhPixels = cleanNumber(state.fontSize * (state.lhPercent / 100));
        } else {
            state.pixels = safeNumber($spacingInput.val(), state.pixels);
            state.percent = cleanNumber((state.pixels / state.fontSize) * 100);
            state.lhPixels = safeNumber($lhInput.val(), state.lhPixels);
            state.lhPercent = cleanNumber((state.lhPixels / state.fontSize) * 100);
        }
        render();
        scheduleRecent();
    }
    /*=========== UI Sync & Render Function ===========*/
    function render() {
        var font = formatNumber(state.fontSize);
        var percent = formatNumber(state.percent);
        var pixels = formatNumber(state.pixels);
        var lhPercent = formatNumber(state.lhPercent);
        var lhPixels = formatNumber(state.lhPixels);
        var em = formatNumber(state.percent / 100);
        var lhRatio = formatNumber(state.lhPercent / 100);
        var lsResult = state.mode === "percent" ? pixels : percent;
        var lsUnit = state.mode === "percent" ? "px" : "%";
        var lhResult = state.mode === "percent" ? lhPixels : lhPercent;
        var lhUnit = state.mode === "percent" ? "px" : "%";
        $("#result-value").html(lsResult + " <span>" + lsUnit + "</span>");
        $("#lh-result-value").html(lhResult + " <span>" + lhUnit + "</span>");
        $("#result-label").text(
            state.mode === "percent" ? "CSS letter spacing" : "Figma letter spacing"
        );
        $("#lh-result-label").text(
            state.mode === "percent" ? "CSS line height" : "Figma line height"
        );
        var minRem = (state.fontSize * 0.75 / 16).toFixed(2);
        var maxRem = (state.fontSize / 16).toFixed(2);
        var calcStr = "clamp(" + minRem + "rem, 4vw, " + maxRem + "rem)";
        $("#calculation").text(calcStr);
        $("#preview-meta").text(font + "px / " + percent + "% / " + lhPercent + "%");
        $("#figma-output").text(percent + "% / " + lhPercent + "%");
        $("#pixel-output").text(pixels + "px / " + lhPixels + "px");
        $("#em-output").text(em + "em / " + lhRatio);
        $("#css-code").html("letter-spacing: " + pixels + "px;<br>line-height: " + lhPixels + "px;");
        $("#preview-output").css({
            "font-size": state.fontSize + "px",
            "letter-spacing": state.pixels + "px",
            "line-height": state.lhPixels + "px"
        });
        $("#specimen-track").css("letter-spacing", state.pixels + "px");
        updateRangeFill($fontRange);
        updateRangeFill($spacingRange);
        updateRangeFill($lhRange);
        setResultPulse();
    }
    /*=========== Mode Switcher Handler ===========*/
    function setMode(mode) {
        state.mode = mode;
        $(".mode-button").removeClass("active");
        $('.mode-button[data-mode="' + mode + '"]').addClass("active");
        if (mode === "percent") {
            $("#spacing-label").text("Figma letter spacing");
            $("#spacing-unit").text("%");
            $("#spacing-help").text("Use the exact percentage shown in Figma's type panel.");
            $("#spacing-range-labels").html("<span>-20%</span><span>40%</span>");
            $spacingInput.attr({ min: -20, max: 40, step: 0.1 }).val(formatNumber(state.percent));
            $spacingRange.attr({ min: -20, max: 40, step: 0.1 }).val(state.percent);
            $("#lineheight-label").text("Figma line height");
            $("#lineheight-unit").text("%");
            $("#lineheight-help").text("Use the line height percentage from Figma.");
            $("#lineheight-range-labels").html("<span>50%</span><span>250%</span>");
            $lhInput.attr({ min: 0, max: 400, step: 1 }).val(formatNumber(state.lhPercent));
            $lhRange.attr({ min: 50, max: 250, step: 1 }).val(state.lhPercent);
        } else {
            $("#spacing-label").text("CSS letter spacing");
            $("#spacing-unit").text("px");
            $("#spacing-help").text("Enter a pixel value to recover the matching Figma percentage.");
            $("#spacing-range-labels").html("<span>-10px</span><span>20px</span>");
            $spacingInput.attr({ min: -10, max: 20, step: 0.01 }).val(formatNumber(state.pixels));
            $spacingRange.attr({ min: -10, max: 20, step: 0.01 }).val(state.pixels);
            $("#lineheight-label").text("CSS line height");
            $("#lineheight-unit").text("px");
            $("#lineheight-help").text("Enter pixel line height to recover Figma line height %.");
            $("#lineheight-range-labels").html("<span>10px</span><span>200px</span>");
            $lhInput.attr({ min: 0, max: 500, step: 0.1 }).val(formatNumber(state.lhPixels));
            $lhRange.attr({ min: 10, max: 200, step: 0.1 }).val(state.lhPixels);
        }
        render();
    }
    /*=========== Apply Values Utility ===========*/
    function applyValues(fontSize, percent, lhPercent) {
        state.fontSize = fontSize;
        state.percent = percent;
        state.pixels = cleanNumber(fontSize * (percent / 100));
        state.lhPercent = lhPercent !== undefined ? lhPercent : 150;
        state.lhPixels = cleanNumber(fontSize * (state.lhPercent / 100));
        $fontInput.val(fontSize);
        $fontRange.val(fontSize);
        setMode("percent");
        $spacingInput.val(percent);
        $spacingRange.val(percent);
        $lhInput.val(state.lhPercent);
        $lhRange.val(state.lhPercent);
        calculate();
    }
    /*=========== Toast Notification System ===========*/
    function showToast(message) {
        clearTimeout(toastTimer);
        $("#toast").text(message).addClass("visible");
        toastTimer = setTimeout(function () {
            $("#toast").removeClass("visible");
        }, 1800);
    }
    /*=========== Clipboard Integration ===========*/
    function copyText(text, message) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(text)
                .then(function () {
                    showToast(message);
                })
                .catch(function () {
                    legacyCopy(text, message);
                });
            return;
        }
        legacyCopy(text, message);
    }
    function legacyCopy(text, message) {
        var $temporary = $("<textarea>")
            .val(text)
            .css({ position: "fixed", opacity: 0, pointerEvents: "none" });
        $("body").append($temporary);
        $temporary[0].select();
        try {
            document.execCommand("copy");
        } catch (e) { }
        $temporary.remove();
        showToast(message);
    }
    /*=========== Material Design Ripple Effect Generator ===========*/
    function spawnRipple(event) {
        var el = this;
        var rect = el.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = (event && event.clientX ? event.clientX : rect.left + rect.width / 2) - rect.left;
        var y = (event && event.clientY ? event.clientY : rect.top + rect.height / 2) - rect.top;
        var $ripple = $("<span class='ripple'></span>").css({
            width: size,
            height: size,
            left: x,
            top: y,
        });
        $(el).append($ripple);
        setTimeout(function () {
            $ripple.remove();
        }, 680);
    }
    if (!$("link[rel='canonical']").length && window.location.protocol !== "file:") {
        $("<link>", {
            rel: "canonical",
            href: window.location.origin + window.location.pathname,
        }).appendTo("head");
    }
    $(".range-input").each(function () {
        updateRangeFill($(this));
    });
    var $progress = $("#scroll-progress");
    function updateProgress() {
        var el = document.documentElement;
        var max = el.scrollHeight - el.clientHeight;
        var ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
        $progress.css("transform", "scaleX(" + ratio + ")");
    }
    $(window).on("scroll resize", function () {
        window.requestAnimationFrame(updateProgress);
    });
    updateProgress();
    var winEl = $(".converter-window")[0];
    if (winEl) {
        $(winEl).on("mousemove", function (event) {
            var rect = winEl.getBoundingClientRect();
            winEl.style.setProperty("--mx", event.clientX - rect.left + "px");
            winEl.style.setProperty("--my", event.clientY - rect.top + "px");
        });
    }
    var rippleSelector =
        ".primary-button, .dark-button, .nav-action, .subtle-button, .mode-button, .preset-list button, #copy-css-button, #copy-result-button";
    $(rippleSelector).addClass("ripple-host").on("click", spawnRipple);
    $(".preset-list button")
        .on("mousemove.tilt", function (event) {
            var rect = this.getBoundingClientRect();
            var px = (event.clientX - rect.left) / rect.width - 0.5;
            var py = (event.clientY - rect.top) / rect.height - 0.5;
            this.style.transform =
                "translateY(-2px) rotateX(" +
                (-py * 6).toFixed(2) +
                "deg) rotateY(" +
                (px * 8).toFixed(2) +
                "deg)";
        })
        .on("mouseleave.tilt", function () {
            this.style.transform = "";
        });
    /*=========== Input & Slider Event Listeners ===========*/
    $fontInput.on("input", function () {
        var value = Math.max(1, safeNumber($(this).val(), state.fontSize));
        $fontRange.val(Math.min(120, Math.max(8, value)));
        calculate();
    });
    $fontRange.on("input", function () {
        $fontInput.val($(this).val());
        calculate();
    });
    $spacingInput.on("input", function () {
        var min = Number($spacingRange.attr("min"));
        var max = Number($spacingRange.attr("max"));
        var value = safeNumber($(this).val(), 0);
        $spacingRange.val(Math.min(max, Math.max(min, value)));
        calculate();
    });
    $spacingRange.on("input", function () {
        $spacingInput.val($(this).val());
        calculate();
    });
    $lhInput.on("input", function () {
        var min = Number($lhRange.attr("min"));
        var max = Number($lhRange.attr("max"));
        var value = safeNumber($(this).val(), 0);
        $lhRange.val(Math.min(max, Math.max(min, value)));
        calculate();
    });
    $lhRange.on("input", function () {
        $lhInput.val($(this).val());
        calculate();
    });
    $(".mode-button").on("click", function () {
        setMode($(this).data("mode"));
    });
    $("#preview-text").on("input", function () {
        $("#preview-output").text($(this).val() || "Type something to preview.");
    });
    $(".preset-list button").on("click", function () {
        applyValues(
            Number($(this).data("font")),
            Number($(this).data("percent")),
            Number($(this).data("lineheight"))
        );
    });
    $("[data-preset-example]").on("click", function () {
        applyValues(48, -2, 140);
        document
            .getElementById("converter")
            .scrollIntoView({ behavior: "smooth", block: "center" });
    });
    $("#reset-button").on("click", function () {
        $("#preview-text").val("Design with precision.");
        $("#preview-output").text("Design with precision.");
        applyValues(defaults.fontSize, defaults.percent, defaults.lhPercent);
    });
    $("#copy-css-button").on("click", function () {
        copyText(
            "letter-spacing: " + formatNumber(state.pixels) + "px;\nline-height: " + formatNumber(state.lhPixels) + "px;",
            "CSS copied to clipboard"
        );
    });
    $("#copy-result-button").on("click", function () {
        var value =
            state.mode === "percent"
                ? "letter-spacing: " + formatNumber(state.pixels) + "px; line-height: " + formatNumber(state.lhPixels) + "px;"
                : "letter-spacing: " + formatNumber(state.percent) + "%; line-height: " + formatNumber(state.lhPercent) + "%;";
        copyText(value, "Result copied to clipboard");
    });
    $(document).on("click", ".recent-chip", function () {
        applyValues(
            Number($(this).data("font")),
            Number($(this).data("percent")),
            Number($(this).data("lineheight"))
        );
    });
    $("[data-scroll-to]").on("click", function () {
        document
            .getElementById($(this).data("scroll-to"))
            .scrollIntoView({ behavior: "smooth", block: "center" });
    });
    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        $(entry.target).addClass("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16 }
        );
        $(".reveal").each(function () {
            observer.observe(this);
        });
    } else {
        $(".reveal").addClass("is-visible");
    }
    renderRecent();
    render();
});