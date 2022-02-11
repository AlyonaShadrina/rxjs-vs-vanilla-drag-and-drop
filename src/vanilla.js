// collect all required elements
const draggable = document.querySelectorAll('.draggable');
const droppable = document.querySelectorAll('.droppable');

// add event listeners
function addListeners() {
  draggable.forEach((element) => {
    element.addEventListener('mousedown', mouseDown);
  })
}

// on mousedown, add mouseup and mousemove listeners
function mouseDown(event) {
  const mouseMoveListener = mouseMove(event);
  document.addEventListener('mouseup', mouseUp(event, mouseMoveListener), false);
  document.addEventListener('mousemove', mouseMoveListener, false);
}

// on mouseup, move .draggable, remove mouseup and mousemove listeners
function mouseUp(mouseDownEvent, mouseMoveListener) {
  return function mouseUpListener(mouseUpEvent) {
    if (mouseUpEvent.target.closest('.droppable') !== mouseDownEvent.target.closest('.droppable')) {
      const droppableElement = mouseUpEvent.target.closest('.droppable');
      if (droppableElement) {
        droppableElement.appendChild(mouseDownEvent.target)
      }
    }
    document.removeEventListener('mousemove', mouseMoveListener);
    document.removeEventListener('mouseup', mouseUpListener);
  }
}

function mouseMove(mouseDownEvent){
  return function mouseMoveListener(mouseMoveEvent) {
    document.getSelection().removeAllRanges(); // helps remove bugs when text selected
  }
}

addListeners();