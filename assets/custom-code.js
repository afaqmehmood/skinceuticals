$(function(){
    var mega_menus = $("div[class*='mega-menu-']");
    var menu_head = $(".menu-wrapper ul.menu-list>li");
    mega_menus.each(function(index){
        var mega_menu = $(this);
        var  handle = mega_menu.data('parent');
        for( var i = 0; i<menu_head.length; i++  ){
            var rel_handle = menu_head.eq(i).data('child-rel');
            // var chevron_btn = menu_head.eq(i).find('button.dropdown-toggle');
            if(handle == rel_handle ){
                // mega_menu.eq(i).show();
                menu_head.eq(i).addClass('has-mega-menu');
                menu_head.eq(i).find('.submenu-regular').remove();
                menu_head.eq(i).append(mega_menu);
                // chevron_btn.removeClass('hide');
            } else{
                mega_menu.eq(i).remove();
            }
        }
    });
    $('.mobile-menu-toggle').on('click', function(){
        $('.sidebar-menu-container').addClass('show');
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
    });
    $('.close-mobile-menu').on('click', function(){
        $('.sidebar-menu-container').removeClass('show');
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    });
    $('#language_EN').on('click', function() {
        let language_selector = $(document).find('ul#lang-list li a');
        let language_form = $(document).find('#localization_form');
        let language_input = language_form.find('#LocaleSelector');
        $.each(language_selector, function(index) {
            var _this = language_selector.eq(index);
            let selector_val = _this.attr('data-value');
            if (selector_val == 'en') {
                language_input.val(selector_val);
                language_form.submit();
                console.log(selector_val);
            }
        })
    });
    $('#language_FR').on('click', function() {
        let language_selector = $(document).find('ul#lang-list li a');
        let language_form = $(document).find('#localization_form');
        let language_input = language_form.find('#LocaleSelector');
        $.each(language_selector, function(index) {
            var _this = language_selector.eq(index);
            let selector_val = _this.attr('data-value');
            if (selector_val == 'fr') {
                language_input.val(selector_val);
                language_form.submit();
                console.log(selector_val);
            }
        })
    });
    $('#filter-toggler').on('click', function () {
        $(this).toggleClass('filter-shown');
        $('#filter_sidebar').toggleClass('mobile-absolute');
    })
    $('#search-bar-toggler').on('click', function(){
        $('.header-search_form').toggleClass('show');
    })
    $('.description-toggler').on('click', function() {
        let desc_tab = $('#description-tab');
        desc_tab.trigger('click');
        $('html, body').animate({
            scrollTop: desc_tab.offset().top
        }, 500);
    })
});
