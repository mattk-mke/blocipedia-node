const markdown = require("markdown").markdown;

window.onload = () => {
  const editor = document.getElementById('text-input');
  const markdownArea = document.getElementById('preview');   
  const convertText = () => {
    let markdownText = editor.value;
    let html = markdown.toHTML(markdownText);
    markdownArea.innerHTML = html;
  };
  editor.addEventListener('input', convertText);
  convertText();
};