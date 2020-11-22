(() => {
  document.getElementById('upload').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'upload.html';
  });
  document.getElementById('query').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'query.html';
  });
})();