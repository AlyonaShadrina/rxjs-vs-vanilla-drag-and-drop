import { fromEvent } from 'rxjs';
import { takeUntil, switchMap, withLatestFrom } from 'rxjs/operators';

// collect all required elements
const draggable = document.querySelectorAll('.draggable');
const droppable = document.querySelectorAll('.droppable');

// add event listeners
const mouseDownOnDraggable$ = fromEvent(draggable, 'mousedown');
const mouseUpOnDocument$ = fromEvent(document, 'mouseup');
const mouseMoveOnDocument$ = fromEvent(document, 'mousemove');
const mouseUpOnDroppable$ = fromEvent(droppable, 'mouseup');

// define move event
const dragMove$ = mouseDownOnDraggable$.pipe( // on every mousedown
  switchMap(() => mouseMoveOnDocument$.pipe( // on every mousemove
    takeUntil(mouseUpOnDocument$) // until mouseup
  )),
);
// define drop event
const dragDrop$ = dragMove$.pipe( // when move event
  switchMap(() => mouseUpOnDroppable$.pipe( // check for mouseup on droppable
    takeUntil(mouseUpOnDocument$) // until mouseup on document (hoists to document from droppable)
  )),
);

// subscibe to move
dragMove$.subscribe(() => {
  window.getSelection().removeAllRanges(); // helps remove bugs when text selected
});
// subscibe to drop and move element
dragDrop$.pipe(
  withLatestFrom(mouseDownOnDraggable$), // get info from latest mouseDownOnDraggable$
).subscribe(([dropToElement, draggedElement]) => {
  if (draggedElement.target.closest('.droppable') !== dropToElement.target.closest('.droppable')) {
    dropToElement.target.closest('.droppable').appendChild(draggedElement.target)
  }
});