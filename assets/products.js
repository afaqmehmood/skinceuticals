function productsToShow(){
	var productCount = localStorage.getItem("productCount");
	if ( productCount ) {
		return parseInt(productCount);
	}else{
		var productsToShow = $('#product-view option:selected').val();
		// localStorage.setItem("productCount", productsToShow);
		return parseInt(productsToShow);
	}
}
(function($){
	sessionStorage.setItem('currentPage', '');
	sessionStorage.setItem('generalFilter', '');
	var productsContainer = $('.products-container');
	var products = productsContainer.find('.product-loop');
	// console.log(products);
	var filteredProducts = products;
	var filterInputs = $('.filterInput');
	// var appliedFilters = $('#applied-filter-container');
	// var numberOfProducts = $('#productsShowing');

	var usePagination = true;
	var pageSize = 20;
	var currentPage = 1;
	var pageCount = 1;
	// console.log(pageSize);
	/**
	 * Sort Product Cards
	 * @param {[type]} sortBy [description]
	 */
	
	function sortProducts(sortBy) {
		var sortReverse = false;
		var sortField = 'data-title';

		sessionStorage.setItem('sortOrder', sortBy);

		if (sortBy == 'title' || sortBy == 'title-reverse') {
			sortField = 'data-title';
		}

		if (sortBy == 'price' || sortBy == 'price-reverse') {
			sortField = 'data-price';
		}

		if(sortBy == 'title-reverse' || sortBy == 'price-reverse') {
	      sortReverse = true;
	    }

	    products.sort(function(a,b){
	      var an = a.getAttribute(sortField);
	      var bn = b.getAttribute(sortField);

	      if ( sortField == 'data-price' ) {
	      	an = parseInt(an);
	      	bn = parseInt(bn);
	      }

	      if(an > bn) {
	        return sortReverse ? -1 : 1;
	      }
	      if(an < bn) {
	        return sortReverse ? 1 : -1;
	      }

	      return 0;
	    });

	    products.detach().appendTo(productsContainer);
		paginateProducts();
	}

	/**
	 * Filter Product Cards
	 * @param  {string[]} filterBy [ Array of filter values selected by user (subset) ]
	 * @param {boolean} reload [Whether filter is applied from reload (vs. on-page filtering)]
	 * @return {[type]}          [description]
	 */
	function filterProducts(filterBy = false, reload = false) {
		
		var generalFilter = filterBy[0];
		var tagFilter = filterBy[1];
		// If this is a new search, remove the currentPage item from the sessionStorage object
		if (!reload) {
			sessionStorage.removeItem('currentPage');
		}

		// If empty arrays are passed, set filterBy variable to false
		if ( generalFilter.length == 0 && tagFilter.length == 0 ) {
		  filterBy = false;
		  sessionStorage.removeItem('generalFilter');
		  sessionStorage.removeItem('tagFilter');

		  $("input:checked").each(function() {
				$(this).prop('checked', false);
		  });  
		}
		if (filterBy) {
			// Set storage for retention of search filters
			sessionStorage.setItem('generalFilter', JSON.stringify(generalFilter));
			sessionStorage.setItem('tagFilter', JSON.stringify(tagFilter));
			console.log(products);
		  	products.each( function() {
				var currentProduct = $(this);
		  	if ( generalFilter.length > 0  && tagFilter.length ) {
		  		if ( matchFilter(generalFilter, currentProduct.data('category'))
		  		  || matchFilter(generalFilter, currentProduct.data('type')) 
					|| matchFilter(generalFilter, currentProduct.data('condition'))
					) {
					filterShow(currentProduct);
			    } else {
					filterHide(currentProduct);
			    }
		  	} else if ( generalFilter.length > 0 ) {
		  		if ( matchFilter(generalFilter, currentProduct.data('category')) ||
				  matchFilter(generalFilter, currentProduct.data('type')) ||
				  matchFilter(generalFilter, currentProduct.data('condition')) 
				  ) {
					  console.log("true");
		  		  	filterShow(currentProduct);
		  		} else {
					console.log("false");
					filterHide(currentProduct);
		  		}
		  	} else {
		    	if ( matchFilter(tagFilter, $(this).data('tags')) ) {
					filterShow(currentProduct);
			    } else {
					filterHide(currentProduct);
			    }
		    }
		  });

		  var filtered = $(products).not('hide');
		} else {
			console.log('here');
	 	  	products.each(function() {
				filterShow($(this));
	 	  	});
		}

		// Attach spans above filters that show what filters are active
		showAppliedFilters(filterBy);
		filteredProductCount();
		paginateProducts(pageSize);

	}

	// Add to filtered items
	function filterShow(item) {
		let parent = item;
		parent.addClass('filter-shown').removeClass('hide');
		// parent.show();
		// console.log($('#products-container').children().length);
	}

	// Remove from filtered items
	function filterHide(item) {
		let parent = item;
		parent.removeClass('filter-shown').addClass('hide');
		// parent.hide();
	}

	/**
	 * Check products for matching filter values
	 * @param  {string[]} selectedFilters   [ Array of filter values selected by user ]
	 * @param  {string[]} itemProps [ Array of values attached to each product ]
	 * @return {boolean}            [ Whether product props match selected filters ]
	 */
	function matchFilter(selectedFilters, itemProps) {
		// console.log(selectedFilters, itemProps);
		if ( itemProps == undefined ) {
		  return false;
		}
		var _itemProps = itemProps.split(",");
  		for (var i = 0; i < selectedFilters.length; i++) {
			  for (let j = 0; j < _itemProps.length; j++) {
				  const element = _itemProps[j];
				  if (element == selectedFilters[i] ) {
					  return true;
				  } 
				//   if ( itemProps.indexOf(selectedFilters[i]) != -1 ) {
				// 	  return true;
				//   }
			  }
		}
		return false;
	}

	function filteredProductCount(count) {
		// var shownProducts = $(products).not(".hide");
		// numberOfProducts.html(shownProducts.length);
	}

	function showAppliedFilters(filters) {
		var filterString = "";
		$(filters[0]).each(function(index, value) {
			filterString = filterString.concat(value) + '|';
		});

		$(filters[1]).each(function(index, value) {
			filterString = filterString.concat(value) + '|';
		});
		allFilters = filterString.split('|');
		// appliedFilters.empty();

		for (var i = 0; i < allFilters.length; i++) {
		  var filterSpan = document.createElement('span');
		  filterSpan.classList.add('singleFilter');
		  filterSpan.innerHTML = allFilters[i];
		//   appliedFilters.append(filterSpan);
		}
		var inputs = document.querySelectorAll('.filterInput');
		for (var i = 0; i < allFilters.length; i++) {
			for(var j=0; j<inputs.length; j++){
				var val = inputs[j].value;
				if(val == allFilters[i]){
					inputs[j].checked = true;
				}
			}
		}
	}

	/**
	 * Apply pagination to the currently filtered products
	 * @return {integer} [description]
	 */
	function paginateProducts(pageSize) {
		
		// console.log(pageSize);
		if(!usePagination) return false;

		filteredProducts = products.filter('.filter-shown');
		var filteredCount = filteredProducts.length

		if(filteredCount < 1) {
			filteredProducts = products;
			filteredCount = filteredProducts.length
		}

		pageCount = Math.ceil(filteredCount / pageSize);
		// console.log(pageCount);
		var paginateList = $();
		 var previous = $('<li class="page-item"><a href="javascript:void(0)" class="pagination__button pagination-previous" data-target-page="previous">&laquo; Prev</a></li>');
		 var next = $('<li class="page-item"><a href="javascript:void(0)" class="pagination__button pagination-next" data-target-page="next">Next &raquo;</a></li>');

		 paginateList = paginateList.add(previous);
		if (pageCount > 1) {
			for(var $n = 1; $n <= pageCount; $n++) {
				var pageLi = $('<li class="page-item"/>');
				pageLi.append('<a id="pagination-' + $n + '" class="" data-target-page="' + $n + '">' + $n + '</a>');
	
				paginateList = paginateList.add(pageLi);
			}
		}

		 paginateList = paginateList.add(next);

		$('#pagination-container').html(paginateList);

		if (sessionStorage.currentPage) {
    		paginateChange(sessionStorage.currentPage, pageSize);
    	} else {
    		paginateChange(1, pageSize);
    	}
		
	}

	/**
	 * Change the current page
	 * @param  integer [pageNum=currentPage] [description]
	 * @return {void}
	 */
	function paginateChange(pageNum = currentPage, pageSize) {
		let next = currentPage + 1;
		// $('.pagination-next').attr('href', next);
		if(!usePagination) return false;

		if(pageNum == 'previous') {
			pageNum = currentPage - 1;
			if(pageNum < 1) pageNum = 1;
		}

		if(pageNum == 'next') {
			pageNum = currentPage + 1;
			if(pageNum > pageCount) pageNum = pageCount;
		}
		console.log(filteredProducts);
		filteredProducts.each(function(index, element) {
			console.log('here');
			var elementPage =  Math.ceil((index + 1) / pageSize);
			if(elementPage == pageNum) {
				$(element).addClass('paginate-show').removeClass('paginate-hide');
				// console.log(element);
				// $(element).parent().addClass('hide');
			} else {
				$(element).removeClass('paginate-show').addClass('paginate-hide');
				// $(element).parent().removeClass('hide');
			}
		});

		$('.page-item a').removeClass('active');
		$('#pagination-' + pageNum).addClass('active');

		currentPage = pageNum;
		sessionStorage.currentPage = currentPage;
	}

	$('#product-sort').on('change', function() {
		sortProducts($(this).val());
	});
	$('#product-view').on('change', function() {
		viewProducts($(this).val());
	});

	$('#clearCollectionFilters').on('click', function() {
		filterProducts([[],[]]);
	});

	$('.filterInput').on('change', function() {
		var generalFilters = [];
		var tagFilters = [];

		$("input[name='category']:checked").each(function() {
			generalFilters.push($(this).val());
		});

		$("input[name='type']:checked").each(function() {
			generalFilters.push($(this).val());
		});
		$("input[name='condition']:checked").each(function() {
			generalFilters.push($(this).val());
		});
		console.log(generalFilters)
		filterProducts([generalFilters, tagFilters]);
	});
function viewProducts(prodShow){
	// console.log(prodShow);
	localStorage.setItem("productCount", prodShow);
	paginateProducts(parseInt(prodShow));
}

		
	let prodToShow = localStorage.getItem("productCount");
	if(prodToShow != null){
		$("#product-view").trigger('change').val(prodToShow);
	}else{
		let p_count = $("#product-view option:selected").val();
		localStorage.setItem("productCount", p_count);
	}
	// Sets variable for tracking whether pagination is called in sort/filter function
	var runPaginate = true;
	
	// console.log(sessionStorage);

	// Checks for previous filter settings and applies if they are found
	// console.log(sessionStorage.tagFilter);
	if (sessionStorage.generalFilter || sessionStorage.tagFilter) {

		var prevFilters = [JSON.parse(sessionStorage.getItem('generalFilter')),
							JSON.parse(sessionStorage.getItem('tagFilter'))];
		filterProducts(prevFilters, true);
		runPaginate = false;
	} 
	if (sessionStorage.sortOrder) {
		sortProducts(sessionStorage.sortOrder);
		runPaginate = false;
	}

	if (runPaginate) {
		paginateProducts(pageSize);
	}

	$(document).find('#pagination-container').on({
		click: function(elem){
			// let prodToShow = localStorage.getItem("productCount");
			let prodToShow = pageSize;
			var targetPage = $(elem.target).data('target-page');
			paginateChange(targetPage, prodToShow);
			$('body,html').animate({
                scrollTop: 0
            }, 600);
		}
	}, '.page-item a');

})(jQuery);
