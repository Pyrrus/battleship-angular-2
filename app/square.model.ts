export class Square{
  public ship:boolean = false;
  public hit:boolean = false;
  public miss:boolean = false;
  public sunk:boolean = false;
  public id:number;
  public position:number;
  public rotation:boolean;
  constructor(){
    this.id = -1;
  }
}
