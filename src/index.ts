import { Assembler } from "./tracescript";

const editor = document.getElementById('editor') as HTMLInputElement;
const submit = document.getElementById('submit');
const cvs = document.getElementById('canvas') as HTMLCanvasElement;


submit?.addEventListener('click', (e) => {
  e.preventDefault();

  const a = new Assembler(editor.value);
  const scene = a.assemble();

  scene.render(2);
  scene.draw();
  cvs.innerHTML = '';
  scene.setParent(cvs as HTMLElement);
})