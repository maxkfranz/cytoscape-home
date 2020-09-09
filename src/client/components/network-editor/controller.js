import EventEmitter from 'eventemitter3';

function randomArg(... args) {
  return args[Math.floor(Math.random() * args.length)];
}

export class NetworkEditorController {
  constructor(cy, bus){
    this.cy = cy;
    this.bus = bus || new EventEmitter();
    this.drawModeEnabled = false;
    this.styleTargets = cy.collection();
  }

  addNode(){
    const node = this.cy.add({
      renderedPosition: { x: 100, y: 50 },
      data: {
        color: 'rgb(128, 128, 128)',
        attr1: Math.random(),
        attr2: Math.random(),
        attr3: randomArg("A", "B", "C")
      }
    });

    this.bus.emit('addNode', node);
  }

  toggleDrawMode(bool = !this.drawModeEnabled){
    if( bool ){
      this.eh.enableDrawMode();
      this.bus.emit('enableDrawMode');
    } else {
      this.eh.disableDrawMode();
      this.bus.emit('disableDrawMode');
    }

    this.drawModeEnabled = bool;

    this.bus.emit('toggleDrawMode', bool);
  }

  enableDrawMode(){
    return this.toggleDrawMode(true);
  }

  disableDrawMode(){
    this.toggleDrawMode(false);
  }

  deletedSelectedElements(){
    const deletedEls = this.cy.$(':selected').remove();

    this.bus.emit('deletedSelectedElements', deletedEls);
  }

  setStyleTargets(eles){
    if( eles == null ){ // don't allow setting null, use empty collection instead
      eles = this.cy.collection();
    }

    this.styleTargets = eles;

    this.bus.emit('setStyleTargets', eles);
  }

  resetStyleTargets(){
    const emptyEles = this.cy.collection();

    this.setStyleTargets(emptyEles);
  }

  setColor(color){
    const [r, g, b] = color.rgb;
    const eles = this.styleTargets.nonempty() ? this.styleTargets : this.cy.elements();

    eles.data('color', `rgb(${r}, ${g}, ${b})`);
  }

  setColorGradient(attribute, gradient){
    console.log("setColorGradient: " + attribute + " " + gradient)
  }
}