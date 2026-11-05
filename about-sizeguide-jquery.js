$(document).ready(function () {
  'use strict';
  console.log('jQuery is ready!');
  if (document.getElementById('jq-solea')) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tasks 1тАУ3: a searchable collection of SOLEA help articles.
  var articles = [
    { title: 'About SOLEA', text: 'SOLEA brings together elegance, creativity and individuality.' },
    { title: 'Our team', text: 'Aruzhan Bolatova, Ardak Korabay and Aiym Rakhat created the six SOLEA pages together.' },
    { title: 'Measure your feet', text: 'Measure both feet from heel to longest toe in centimetres. Use the larger measurement.' },
    { title: 'Between sizes', text: 'If you are between sizes, compare the size chart and ask for individual fit advice.' },
    { title: 'Choosing your fit', text: 'Consider foot width and shoe shape. Fit can vary by designer.' },
    { title: 'Care for your heels', text: 'Store heels in a dry place and use care products suitable for the material.' }
  ];

  var $section = $('<section id="jq-solea" class="jq-solea" aria-labelledby="jq-title">');
  $section.html(`
    <div class="jq-inner">
      <p class="jq-eyebrow">SOLEA CONCIERGE</p>
      <h2 id="jq-title">A little more guidance</h2>
      <label for="jq-search">Search our story and fit advice</label>
      <input id="jq-search" type="search" placeholder="Try team, feet or sizes" autocomplete="off" aria-controls="jq-results jq-suggestions">
      <div id="jq-suggestions" class="jq-suggestions" aria-label="Search suggestions" hidden></div>
      <p id="jq-count" role="status" aria-live="polite"></p>
      <div id="jq-results" class="jq-grid"></div>
      <div class="jq-stats" aria-label="SOLEA in numbers">
        <div><strong data-jq-count="3">0</strong><span>Team creators</span></div>
        <div><strong data-jq-count="6">0</strong><span>Project pages</span></div>
        <div><strong data-jq-count="8">0</strong><span>EU sizes in our chart</span></div>
      </div>
      <h3>Keep your fit note</h3>
      <p id="jq-copy-text">Measure both feet and compare the larger measurement with the SOLEA size chart.</p>
      <button type="button" id="jq-copy" class="jq-button" aria-describedby="jq-copy-feedback">Copy fit note</button>
      <span id="jq-copy-feedback" class="jq-tooltip" role="status" hidden></span>
      <form id="jq-form">
        <h3>Try a private fit reminder</h3>
        <p>Demo only: your email stays on this page. Nothing is sent or saved.</p>
        <label for="jq-email">Email</label>
        <input id="jq-email" type="email" required autocomplete="email" placeholder="you@example.com">
        <button type="submit" class="jq-button">Preview reminder</button>
        <p id="jq-form-status" role="status" aria-live="polite"></p>
      </form>
      <h3>A closer look at SOLEA</h3>
      <div class="jq-gallery">
        <img data-jq-src="images/c11.jpg" width="420" height="320" alt="SOLEA footwear inspiration, first look">
        <img data-jq-src="images/c12.jpeg" width="420" height="320" alt="SOLEA footwear inspiration, second look">
        <img data-jq-src="images/c13.jpeg" width="420" height="320" alt="SOLEA footwear inspiration, third look">
      </div>
    </div>`);
  var $main = $('main').first();
  if ($main.length) $main.append($section);
  else $section.insertBefore($('footer').first());

  articles.forEach(function (article) {
    var $card = $('<article class="jq-card">');
    $('<h3>').text(article.title).appendTo($card);
    $('<p>').text(article.text).appendTo($card);
    $('#jq-results').append($card);
  });

  // Use text nodes, not raw user HTML, to safely highlight every literal match.
  function highlight($element, original, query) {
    $element.empty();
    if (!query) { $element.text(original); return; }
    var start = 0;
    var position;
    while ((position = original.toLowerCase().indexOf(query, start)) !== -1) {
      $element.append(document.createTextNode(original.slice(start, position)));
      $('<mark>').text(original.slice(position, position + query.length)).appendTo($element);
      start = position + query.length;
    }
    $element.append(document.createTextNode(original.slice(start)));
  }

  function search(showSuggestions) {
    var query = $('#jq-search').val().trim().toLowerCase();
    var count = 0;
    var $suggestions = $('#jq-suggestions').empty();
    $('#jq-results .jq-card').each(function (index) {
      var article = articles[index];
      var match = (article.title + ' ' + article.text).toLowerCase().includes(query);
      $(this).prop('hidden', !match);
      highlight($(this).find('h3'), article.title, query);
      highlight($(this).find('p'), article.text, query);
      if (match) {
        count++;
        if (query) $('<button type="button">').text(article.title).appendTo($suggestions);
      }
    });
    $('#jq-count').text(count ? count + ' articles found' : 'No matches. Try feet, team or sizes.');
    $suggestions.prop('hidden', !(showSuggestions && query && count));
  }
  $('#jq-search').on('input', function () { search(true); });
  $('#jq-search').on('keydown', function (event) {
    if (event.key === 'Escape') $('#jq-suggestions').prop('hidden', true);
    if (event.key === 'ArrowDown' && !$('#jq-suggestions').prop('hidden')) {
      event.preventDefault();
      $('#jq-suggestions button').first().trigger('focus');
    }
  });
  $('#jq-suggestions').on('click', 'button', function () {
    $('#jq-search').val($(this).text()).trigger('focus');
    search(false);
  });
  $(document).on('click', function (event) {
    if (!$(event.target).closest('#jq-search, #jq-suggestions').length) {
      $('#jq-suggestions').prop('hidden', true);
    }
  });
  search(false);

  // Task 4: progress is calculated from the actual scrollable page height.
  var $progress = $('<div class="jq-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100"><span></span></div>').appendTo('body');
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 100;
    $progress.attr('aria-valuenow', Math.round(percent)).find('span').css('width', percent + '%');
  }
  $(window).on('scroll resize load', updateProgress);
  if (window.ResizeObserver) new ResizeObserver(updateProgress).observe(document.body);
  updateProgress();

  // Task 5: start the jQuery counter animation once the stats become visible.
  function countUp(element) {
    var target = Number($(element).attr('data-jq-count'));
    $({ value: 0 }).animate({ value: target }, {
      duration: reducedMotion ? 0 : 1200,
      step: function (value) { $(element).text(Math.floor(value)); },
      complete: function () { $(element).text(target); }
    });
  }
  var counterObserver;
  if ('IntersectionObserver' in window) {
    counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });
    $('[data-jq-count]').each(function () { counterObserver.observe(this); });
  } else $('[data-jq-count]').each(function () { countUp(this); });

  // Task 7: a reusable notification; restart its timer on repeated actions.
  var $toast = $('<div class="jq-toast" role="status" aria-live="polite">').hide().appendTo('body');
  var toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    $toast.stop(true, true).text(message).fadeIn(reducedMotion ? 0 : 180);
    toastTimer = setTimeout(function () { $toast.fadeOut(reducedMotion ? 0 : 350); }, 3500);
  }

  // Task 6: native email validation runs before the submit event.
  $('#jq-form').on('submit', function (event) {
    event.preventDefault();
    var $button = $(this).find('[type="submit"]');
    if ($button.prop('disabled')) return;
    $button.prop('disabled', true).attr('aria-busy', 'true')
      .html('<span class="jq-spinner" aria-hidden="true"></span> Please waitтАж');
    $('#jq-form-status').text('Preparing your local previewтАж');
    setTimeout(function () {
      $button.prop('disabled', false).removeAttr('aria-busy').text('Preview reminder');
      $('#jq-form-status').text('Preview ready: measure both feet before choosing your size. No email was sent.');
      notify('Fit reminder preview is ready. No email was sent.');
    }, 1500);
  });

  // Task 8: confirm success only after the Clipboard API actually resolves.
  var copyTimer;
  $('#jq-copy').on('click', async function () {
    var $button = $(this);
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText($('#jq-copy-text').text());
      clearTimeout(copyTimer);
      $button.text('тЬУ Copied');
      $('#jq-copy-feedback').text('Copied to clipboard!').prop('hidden', false);
      notify('Fit note copied to clipboard!');
      copyTimer = setTimeout(function () {
        $button.text('Copy fit note');
        $('#jq-copy-feedback').prop('hidden', true);
      }, 2500);
    } catch (error) {
      notify('Copy is unavailable. Select the fit note and copy it manually.');
    }
  });

  // Task 9: these images have NO src until they approach the viewport.
  function loadImage(image) {
    var $image = $(image);
    $image.one('load', function () { $(this).addClass('jq-loaded'); updateProgress(); });
    $image.one('error', function () { $(this).addClass('jq-loaded'); });
    $image.attr('src', $image.attr('data-jq-src')).removeAttr('data-jq-src');
  }
  if ('IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { loadImage(entry.target); imageObserver.unobserve(entry.target); }
      });
    }, { rootMargin: '150px' });
    $('img[data-jq-src]').each(function () { imageObserver.observe(this); });
  } else $('img[data-jq-src]').each(function () { loadImage(this); });
});
