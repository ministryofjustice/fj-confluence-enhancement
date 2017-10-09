// ==UserScript==
// @name         Family Justice Confluence Enhancements
// @namespace    https://github.com/ministryofjustice/fj-confluence-enhancement/raw/master/fj-confluence-enhancements.user.js
// @version      0.1
// @description  Make Confluence more useful
// @author       alex.robinson@digital.justice.gov.uk
// @match        https://dsdmoj.atlassian.net/wiki/spaces/*
// ==/UserScript==

(function() {
  'use strict';
  const getAllComments = () => {
    const t = [];
    const w = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT, null, null);
    while (w.nextNode()) {
        t.push(w.currentNode);
    }
    return t;
  };
  const interval = 500;
  const duration = 10;
  let loop = 0;
  const renderComments = () => {
    loop++;
    if (loop > (duration * 1000 / interval)) {
      return;
    }
    const comments = getAllComments();
    comments.forEach(commentNode => {
      if (commentNode.data.match(/<p>Boom/)) {
        const commentData = commentNode.data.trim();
        const div = document.createElement('div');
        div.innerHTML = commentData;
        commentNode.parentNode.replaceChild(div, commentNode);
      }
    });
    setTimeout(renderComments, interval);
  };
  renderComments();

  setTimeout(() => {
    const links = document.querySelectorAll('a');
    links.forEach(linkNode => {
      const linkText = linkNode.textContent.trim();
      if (linkText.match(/fj-{0,1}embed.*/i)) {
        const iframe = document.createElement('iframe');
        iframe.src = linkNode.getAttribute('href');
        iframe.style = 'width:100%;height:600px;';
        linkNode.textContent = 'Open “' + linkText.replace(/(\s*-\s*)*fj-{0,1}embed.*/i, '') + '” in new window';
        linkNode.parentNode.insertBefore(iframe, linkNode);
      }
    });
  }, 2000);

})();